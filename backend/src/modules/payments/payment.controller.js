import Payment from "../../models/Payment.js";
import User from "../../models/User.js";
import PromoCode from "../../models/PromoCode.js";
import {
  createRazorpayOrder,
  createRazorpaySubscription,
  cancelRazorpaySubscription,
  getRazorpayKeyId,
  verifyPaymentSignature,
  verifySubscriptionSignature,
  resetRazorpayClient,
  isSubscriptionsEnabled,
} from "./payment.service.js";
import { getPlanPricing, PAID_PLANS } from "./planConfig.js";
import { sendPaymentReceipt, sendPaymentFailedNotice } from "./email.service.js";
import { buildInvoicePdf, nextInvoiceNumber } from "./invoice.service.js";
import { processWebhookEvent } from "./payment.webhook.js";

function publicUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isSubscribed: user.isSubscribed,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionExpiresAt: user.subscriptionExpiresAt,
    billingCycle: user.billingCycle,
    razorpaySubscriptionId: user.razorpaySubscriptionId,
    gstin: user.gstin,
    businessName: user.businessName,
    billingAddress: user.billingAddress,
  };
}

async function resolvePromo({ code, plan, amountPaise }) {
  if (!code) {
    return { amount: amountPaise, promoCode: null, discountPaise: 0, promoDoc: null };
  }

  const promo = await PromoCode.findOne({ code: String(code).toUpperCase().trim() });
  if (!promo || !promo.isValidFor(plan)) {
    const err = new Error("Invalid or expired promo code");
    err.statusCode = 400;
    throw err;
  }

  const discounted = promo.applyToAmount(amountPaise);
  return {
    amount: discounted,
    promoCode: promo.code,
    discountPaise: amountPaise - discounted,
    promoDoc: promo,
  };
}

export async function activateFromPayment({
  userId,
  plan,
  billingCycle,
  paymentId,
  orderId = null,
  subscriptionId = null,
}) {
  const pricing = getPlanPricing(plan, billingCycle);
  if (!pricing) throw new Error("Invalid plan configuration");

  const existingPaid = await Payment.findOne({
    razorpayPaymentId: paymentId,
    status: { $in: ["paid", "active"] },
  });
  if (existingPaid) {
    const user = await User.findById(userId).select("-passwordHash");
    return { user, alreadyActivated: true, payment: existingPaid };
  }

  let payment = null;
  if (subscriptionId) {
    payment = await Payment.findOne({ razorpaySubscriptionId: subscriptionId });
  } else if (orderId) {
    payment = await Payment.findOne({ razorpayOrderId: orderId });
  }

  if (!payment) {
    const err = new Error("Payment record not found");
    err.statusCode = 404;
    throw err;
  }

  if (payment.userId.toString() !== userId.toString()) {
    const err = new Error("Payment does not belong to this user");
    err.statusCode = 403;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const now = new Date();
  const currentExpiry =
    user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now
      ? new Date(user.subscriptionExpiresAt)
      : now;
  const expiresAt = new Date(currentExpiry.getTime() + pricing.days * 24 * 60 * 60 * 1000);

  payment.razorpayPaymentId = paymentId;
  payment.status = payment.mode === "subscription" ? "active" : "paid";
  payment.paidAt = now;
  if (!payment.invoiceNumber) {
    payment.invoiceNumber = nextInvoiceNumber();
  }
  await payment.save();

  if (payment.promoCode) {
    await PromoCode.updateOne({ code: payment.promoCode }, { $inc: { usedCount: 1 } });
  }

  user.isSubscribed = true;
  user.subscriptionPlan = plan;
  user.subscriptionStatus = "active";
  user.subscriptionExpiresAt = expiresAt;
  user.billingCycle = billingCycle;
  user.razorpayPaymentId = paymentId;
  if (orderId) user.razorpayOrderId = orderId;
  if (subscriptionId) user.razorpaySubscriptionId = subscriptionId;
  await user.save();

  try {
    const mail = await sendPaymentReceipt({
      to: user.email,
      userName: user.firstName,
      plan,
      amountPaise: payment.amount,
      currency: payment.currency,
      invoiceNumber: payment.invoiceNumber,
      paymentId,
    });
    if (mail.sent) {
      payment.receiptSentAt = new Date();
      await payment.save();
    }
  } catch (e) {
    console.warn("Receipt email failed:", e.message);
  }

  const safeUser = await User.findById(userId).select("-passwordHash");
  return { user: safeUser, alreadyActivated: false, payment };
}

/** One-time order (kept for retries / promo edge cases) */
export const createOrder = async (req, res) => {
  try {
    const { plan, billingCycle, promoCode, gstin, businessName } = req.body;
    const userId = req.user.id;

    if (!PAID_PLANS.includes(plan)) {
      return res.status(400).json({ message: "Only Pro and Business plans can be purchased" });
    }

    const cycle = billingCycle === "annual" ? "annual" : "monthly";
    const pricing = getPlanPricing(plan, cycle);
    if (!pricing) return res.status(400).json({ message: "Invalid plan or billing cycle" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const promo = await resolvePromo({
      code: promoCode,
      plan,
      amountPaise: pricing.amount,
    });

    const { order } = await createRazorpayOrder({
      plan,
      billingCycle: cycle,
      userId,
      receiptSuffix: `${Date.now()}`,
      amount: promo.amount,
    });

    await Payment.create({
      userId,
      plan,
      billingCycle: cycle,
      amount: promo.amount,
      currency: pricing.currency,
      mode: "order",
      razorpayOrderId: order.id,
      promoCode: promo.promoCode,
      discountPaise: promo.discountPaise,
      gstin: gstin || user.gstin || null,
      businessName: businessName || user.businessName || null,
      status: "created",
    });

    if (gstin || businessName) {
      if (gstin) user.gstin = gstin;
      if (businessName) user.businessName = businessName;
      await user.save();
    }

    res.json({
      mode: "order",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      plan,
      billingCycle: cycle,
      discountPaise: promo.discountPaise,
      promoCode: promo.promoCode,
      prefill: {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        contact: user.phone || "",
      },
    });
  } catch (err) {
    console.error("createOrder error:", err);
    const razorpayDesc = err?.error?.description || err?.message;
    const isAuth =
      err?.statusCode === 401 || /authentication failed/i.test(razorpayDesc || "");
    res.status(err.statusCode || 500).json({
      message: isAuth
        ? "Razorpay authentication failed. Regenerate Test Mode API keys in the Razorpay dashboard and update RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in backend/.env (and VITE_RAZORPAY_KEY_ID in frontend/.env), then restart both servers."
        : razorpayDesc || "Failed to create payment order",
    });
  }
};

/** Phase 2: recurring subscription checkout */
export const createSubscription = async (req, res) => {
  try {
    const { plan, billingCycle, promoCode, gstin, businessName } = req.body;
    const userId = req.user.id;

    if (!PAID_PLANS.includes(plan)) {
      return res.status(400).json({ message: "Only Pro and Business plans can be purchased" });
    }

    const cycle = billingCycle === "annual" ? "annual" : "monthly";
    const pricing = getPlanPricing(plan, cycle);
    if (!pricing) return res.status(400).json({ message: "Invalid plan or billing cycle" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cancel existing active Razorpay subscription when changing plan
    if (user.razorpaySubscriptionId && user.subscriptionStatus === "active") {
      try {
        await cancelRazorpaySubscription(user.razorpaySubscriptionId, false);
      } catch (e) {
        console.warn("Cancel previous subscription:", e.message);
      }
    }

    const promo = await resolvePromo({
      code: promoCode,
      plan,
      amountPaise: pricing.amount,
    });

    // Skip Plans/Subscriptions API unless explicitly enabled (many test accounts return 401 on plans.create)
    if (!isSubscriptionsEnabled()) {
      resetRazorpayClient();
      const { order } = await createRazorpayOrder({
        plan,
        billingCycle: cycle,
        userId,
        receiptSuffix: `${Date.now()}`,
        amount: promo.amount,
      });

      await Payment.create({
        userId,
        plan,
        billingCycle: cycle,
        amount: promo.amount,
        currency: pricing.currency,
        mode: "order",
        razorpayOrderId: order.id,
        promoCode: promo.promoCode,
        discountPaise: promo.discountPaise,
        gstin: gstin || user.gstin || null,
        businessName: businessName || user.businessName || null,
        status: "created",
      });

      if (gstin || businessName) {
        if (gstin) user.gstin = gstin;
        if (businessName) user.businessName = businessName;
        await user.save();
      }

      return res.json({
        mode: "order",
        fallback: true,
        fallbackReason:
          "Using one-time Razorpay Orders. Set RAZORPAY_SUBSCRIPTIONS_ENABLED=true after Plans API works in your account.",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: getRazorpayKeyId(),
        plan,
        billingCycle: cycle,
        discountPaise: promo.discountPaise,
        promoCode: promo.promoCode,
        prefill: {
          name: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          contact: user.phone || "",
        },
      });
    }

    let subscriptionResult;
    try {
      subscriptionResult = await createRazorpaySubscription({
        plan,
        billingCycle: cycle,
        userId,
        amount: promo.amount,
      });
    } catch (subErr) {
      // Plans/Subscriptions API often returns 401 if Subscriptions product is not enabled
      const desc = subErr?.error?.description || subErr?.message || "";
      const isAuthOrUnavailable =
        subErr?.statusCode === 401 ||
        /authentication failed/i.test(desc) ||
        /not.*enabled|access denied|forbidden/i.test(desc);

      if (!isAuthOrUnavailable) throw subErr;

      console.warn(
        "Razorpay Subscriptions unavailable — falling back to one-time order:",
        desc
      );

      resetRazorpayClient();

      try {
        const { order } = await createRazorpayOrder({
          plan,
          billingCycle: cycle,
          userId,
          receiptSuffix: `${Date.now()}`,
          amount: promo.amount,
        });

        await Payment.create({
          userId,
          plan,
          billingCycle: cycle,
          amount: promo.amount,
          currency: pricing.currency,
          mode: "order",
          razorpayOrderId: order.id,
          promoCode: promo.promoCode,
          discountPaise: promo.discountPaise,
          gstin: gstin || user.gstin || null,
          businessName: businessName || user.businessName || null,
          status: "created",
        });

        if (gstin || businessName) {
          if (gstin) user.gstin = gstin;
          if (businessName) user.businessName = businessName;
          await user.save();
        }

        return res.json({
          mode: "order",
          fallback: true,
          fallbackReason:
            "Razorpay Subscriptions/Plans API is not enabled on this account. Using one-time payment instead.",
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: getRazorpayKeyId(),
          plan,
          billingCycle: cycle,
          discountPaise: promo.discountPaise,
          promoCode: promo.promoCode,
          prefill: {
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            contact: user.phone || "",
          },
        });
      } catch (orderErr) {
        console.error("Order fallback also failed:", orderErr);
        return res.status(orderErr.statusCode || 500).json({
          message:
            orderErr?.error?.description ||
            orderErr.message ||
            "Payment order failed. Check Razorpay Test API keys in Account & Settings → API Keys.",
        });
      }
    }

    const { subscription, razorpayPlanId } = subscriptionResult;

    await Payment.create({
      userId,
      plan,
      billingCycle: cycle,
      amount: promo.amount,
      currency: pricing.currency,
      mode: "subscription",
      razorpaySubscriptionId: subscription.id,
      razorpayPlanId,
      promoCode: promo.promoCode,
      discountPaise: promo.discountPaise,
      gstin: gstin || user.gstin || null,
      businessName: businessName || user.businessName || null,
      status: "created",
    });

    if (gstin || businessName) {
      if (gstin) user.gstin = gstin;
      if (businessName) user.businessName = businessName;
      await user.save();
    }

    res.json({
      mode: "subscription",
      subscriptionId: subscription.id,
      amount: promo.amount,
      currency: pricing.currency,
      keyId: getRazorpayKeyId(),
      plan,
      billingCycle: cycle,
      discountPaise: promo.discountPaise,
      promoCode: promo.promoCode,
      prefill: {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        contact: user.phone || "",
      },
    });
  } catch (err) {
    console.error("createSubscription error:", err);
    const razorpayDesc = err?.error?.description || err?.description;
    res.status(err.statusCode || 500).json({
      message: razorpayDesc || err.message || "Failed to create subscription",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;
    const userId = req.user.id;

    if (!razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    // Subscription flow
    if (razorpay_subscription_id) {
      const valid = verifySubscriptionSignature(
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
      );
      if (!valid) {
        await Payment.findOneAndUpdate(
          { razorpaySubscriptionId: razorpay_subscription_id },
          { status: "failed", razorpayPaymentId: razorpay_payment_id, failureReason: "Invalid signature" }
        );
        return res.status(400).json({ message: "Invalid subscription payment signature" });
      }

      const payment = await Payment.findOne({ razorpaySubscriptionId: razorpay_subscription_id });
      if (!payment) return res.status(404).json({ message: "Subscription payment not found" });

      payment.razorpaySignature = razorpay_signature;
      await payment.save();

      const { user, alreadyActivated } = await activateFromPayment({
        userId,
        plan: payment.plan,
        billingCycle: payment.billingCycle,
        paymentId: razorpay_payment_id,
        subscriptionId: razorpay_subscription_id,
      });

      return res.json({
        message: alreadyActivated ? "Already verified" : "Subscription activated",
        alreadyActivated,
        user: publicUser(user),
      });
    }

    // One-time order flow
    if (!razorpay_order_id) {
      return res.status(400).json({ message: "Missing order or subscription id" });
    }

    const valid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!valid) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed", razorpayPaymentId: razorpay_payment_id, failureReason: "Invalid signature" }
      );
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return res.status(404).json({ message: "Payment order not found" });

    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    const { user, alreadyActivated } = await activateFromPayment({
      userId,
      plan: payment.plan,
      billingCycle: payment.billingCycle,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.json({
      message: alreadyActivated ? "Payment already verified" : "Payment verified successfully",
      alreadyActivated,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(err.statusCode || 500).json({
      message: err.message || "Payment verification failed",
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.razorpaySubscriptionId) {
      return res.status(400).json({ message: "No active Razorpay subscription to cancel" });
    }

    const cancelAtCycleEnd = req.body?.cancelAtCycleEnd !== false;

    try {
      await cancelRazorpaySubscription(user.razorpaySubscriptionId, cancelAtCycleEnd);
    } catch (e) {
      // If already cancelled on Razorpay, continue local update
      console.warn("Razorpay cancel:", e.message);
    }

    await Payment.updateMany(
      { razorpaySubscriptionId: user.razorpaySubscriptionId, status: { $in: ["created", "active"] } },
      { status: "cancelled" }
    );

    if (cancelAtCycleEnd) {
      user.subscriptionStatus = "cancelled";
      // Keep isSubscribed until expiry
    } else {
      user.isSubscribed = false;
      user.subscriptionPlan = "Free";
      user.subscriptionStatus = "cancelled";
      user.subscriptionExpiresAt = new Date();
      user.razorpaySubscriptionId = null;
    }
    await user.save();

    res.json({
      message: cancelAtCycleEnd
        ? "Subscription will end at the current billing period"
        : "Subscription cancelled immediately",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("cancelSubscription error:", err);
    res.status(500).json({ message: err.message || "Failed to cancel subscription" });
  }
};

export const changePlan = async (req, res) => {
  // Change plan = create new subscription (createSubscription already cancels old)
  req.body = {
    ...req.body,
    plan: req.body.plan,
    billingCycle: req.body.billingCycle || "monthly",
  };
  return createSubscription(req, res);
};

export const validatePromo = async (req, res) => {
  try {
    const { code, plan, billingCycle } = req.body;
    const pricing = getPlanPricing(plan, billingCycle || "monthly");
    if (!pricing) return res.status(400).json({ message: "Invalid plan" });

    const promo = await resolvePromo({
      code,
      plan,
      amountPaise: pricing.amount,
    });

    res.json({
      valid: true,
      code: promo.promoCode,
      originalAmount: pricing.amount,
      amount: promo.amount,
      discountPaise: promo.discountPaise,
      currency: pricing.currency,
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({ valid: false, message: err.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBillingSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    await syncSubscriptionExpiry(user);

    const payments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const failed = payments.filter((p) => p.status === "failed");

    res.json({
      user: publicUser(user),
      payments,
      failedPayments: failed,
      canRetry: failed.length > 0 || user.subscriptionStatus === "past_due",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: { $in: ["paid", "active"] },
    });
    if (!payment) return res.status(404).json({ message: "Invoice not found" });

    const user = await User.findById(req.user.id);
    const pdf = await buildInvoicePdf({
      invoiceNumber: payment.invoiceNumber || nextInvoiceNumber(),
      paidAt: payment.paidAt,
      customerName: `${user.firstName} ${user.lastName}`,
      customerEmail: user.email,
      businessName: payment.businessName || user.businessName,
      gstin: payment.gstin || user.gstin,
      billingAddress: user.billingAddress || user.address,
      plan: payment.plan,
      billingCycle: payment.billingCycle,
      amountPaise: payment.amount,
      currency: payment.currency,
      paymentId: payment.razorpayPaymentId,
      promoCode: payment.promoCode,
      discountPaise: payment.discountPaise,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${payment.invoiceNumber || "invoice"}.pdf"`
    );
    res.send(pdf);
  } catch (err) {
    console.error("downloadInvoice error:", err);
    res.status(500).json({ message: err.message || "Failed to generate invoice" });
  }
};

export const updateBillingProfile = async (req, res) => {
  try {
    const { gstin, businessName, billingAddress } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(gstin !== undefined && { gstin }),
        ...(businessName !== undefined && { businessName }),
        ...(billingAddress !== undefined && { billingAddress }),
      },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Billing profile updated", user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const retryFailedPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const failed = await Payment.findOne({
      _id: paymentId,
      userId: req.user.id,
      status: "failed",
    });

    if (!failed) {
      return res.status(404).json({ message: "Failed payment not found" });
    }

    // Create a fresh subscription for the same plan
    req.body = {
      plan: failed.plan,
      billingCycle: failed.billingCycle,
      promoCode: failed.promoCode || undefined,
      gstin: failed.gstin || undefined,
      businessName: failed.businessName || undefined,
    };
    return createSubscription(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message || "Retry failed" });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    await processWebhookEvent(req);
    res.json({ status: "ok" });
  } catch (err) {
    console.error("webhook error:", err);
    res.status(err.statusCode || 500).json({ message: err.message || "Webhook processing failed" });
  }
};

export async function syncSubscriptionExpiry(user) {
  if (!user) return user;
  if (
    user.isSubscribed &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) < new Date()
  ) {
    user.isSubscribed = false;
    user.subscriptionPlan = "Free";
    user.subscriptionStatus = "expired";
    await user.save();
  }
  return user;
}

export async function seedDefaultPromos() {
  const defaults = [
    {
      code: "WELCOME20",
      description: "20% off first subscription",
      discountPercent: 20,
      applicablePlans: ["Pro", "Business"],
      maxUses: 1000,
    },
    {
      code: "EXPIREO50",
      description: "Flat ₹50 off",
      discountAmount: 5000,
      applicablePlans: ["Pro", "Business"],
      maxUses: 500,
    },
  ];

  for (const p of defaults) {
    await PromoCode.updateOne({ code: p.code }, { $setOnInsert: p }, { upsert: true });
  }
}
