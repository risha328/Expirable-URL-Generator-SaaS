import Payment from "../../models/Payment.js";
import User from "../../models/User.js";
import {
  verifyWebhookSignature,
} from "./payment.service.js";
import { getPlanPricing } from "./planConfig.js";
import { sendPaymentFailedNotice } from "./email.service.js";
import { nextInvoiceNumber } from "./invoice.service.js";
import { sendPaymentReceipt } from "./email.service.js";

/**
 * Handle Razorpay webhook events for Phase 1 + Phase 2.
 */
export async function processWebhookEvent(req) {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  if (process.env.RAZORPAY_WEBHOOK_SECRET?.replace(/\r/g, "").trim()) {
    const valid = verifyWebhookSignature(rawBody, signature);
    if (!valid) {
      const err = new Error("Invalid webhook signature");
      err.statusCode = 400;
      throw err;
    }
  } else {
    console.warn("RAZORPAY_WEBHOOK_SECRET not set — skipping webhook signature check");
  }

  const event = req.body?.event;
  const paymentEntity = req.body?.payload?.payment?.entity;
  const subscriptionEntity = req.body?.payload?.subscription?.entity;

  switch (event) {
    case "payment.captured":
      await onPaymentCaptured(paymentEntity);
      break;
    case "subscription.activated":
      await onSubscriptionActivated(subscriptionEntity, paymentEntity);
      break;
    case "subscription.charged":
      await onSubscriptionCharged(subscriptionEntity, paymentEntity);
      break;
    case "subscription.cancelled":
    case "subscription.completed":
      await onSubscriptionCancelled(subscriptionEntity);
      break;
    case "payment.failed":
      await onPaymentFailed(paymentEntity);
      break;
    default:
      console.log(`[webhook] ignored event: ${event}`);
  }
}

async function activateUserFromEntities({ subscriptionId, orderId, paymentId, notes = {} }) {
  let payment = null;
  if (subscriptionId) {
    payment = await Payment.findOne({ razorpaySubscriptionId: subscriptionId });
  }
  if (!payment && orderId) {
    payment = await Payment.findOne({ razorpayOrderId: orderId });
  }
  if (!payment) return;

  if (payment.status === "paid" || payment.status === "active") {
    if (payment.razorpayPaymentId === paymentId) return;
  }

  const userId = notes.userId || payment.userId;
  const user = await User.findById(userId);
  if (!user) return;

  const pricing = getPlanPricing(payment.plan, payment.billingCycle);
  const now = new Date();
  const currentExpiry =
    user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now
      ? new Date(user.subscriptionExpiresAt)
      : now;
  const days = pricing?.days || 30;
  const expiresAt = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

  payment.razorpayPaymentId = paymentId;
  payment.status = payment.mode === "subscription" ? "active" : "paid";
  payment.paidAt = now;
  if (!payment.invoiceNumber) payment.invoiceNumber = nextInvoiceNumber();
  await payment.save();

  user.isSubscribed = true;
  user.subscriptionPlan = payment.plan;
  user.subscriptionStatus = "active";
  user.subscriptionExpiresAt = expiresAt;
  user.billingCycle = payment.billingCycle;
  user.razorpayPaymentId = paymentId;
  if (subscriptionId) user.razorpaySubscriptionId = subscriptionId;
  if (orderId) user.razorpayOrderId = orderId;
  await user.save();

  try {
    await sendPaymentReceipt({
      to: user.email,
      userName: user.firstName,
      plan: payment.plan,
      amountPaise: payment.amount,
      currency: payment.currency,
      invoiceNumber: payment.invoiceNumber,
      paymentId,
    });
  } catch (_) {
    /* ignore */
  }
}

async function onPaymentCaptured(entity) {
  if (!entity) return;
  await activateUserFromEntities({
    subscriptionId: entity.subscription_id || null,
    orderId: entity.order_id || null,
    paymentId: entity.id,
    notes: entity.notes || {},
  });
}

async function onSubscriptionActivated(subscription, payment) {
  if (!subscription) return;
  await activateUserFromEntities({
    subscriptionId: subscription.id,
    paymentId: payment?.id || `sub_act_${subscription.id}`,
    notes: subscription.notes || {},
  });
}

async function onSubscriptionCharged(subscription, payment) {
  if (!subscription || !payment) return;

  // Extend expiry on recurring charge
  const record = await Payment.findOne({ razorpaySubscriptionId: subscription.id });
  const userId = subscription.notes?.userId || record?.userId;
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  const plan = record?.plan || subscription.notes?.plan || user.subscriptionPlan;
  const cycle = record?.billingCycle || subscription.notes?.billingCycle || user.billingCycle || "monthly";
  const pricing = getPlanPricing(plan, cycle);
  const now = new Date();
  const base =
    user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > now
      ? new Date(user.subscriptionExpiresAt)
      : now;

  user.isSubscribed = true;
  user.subscriptionStatus = "active";
  user.subscriptionPlan = plan;
  user.subscriptionExpiresAt = new Date(base.getTime() + (pricing?.days || 30) * 86400000);
  user.razorpayPaymentId = payment.id;
  await user.save();

  // Audit renewals
  await Payment.create({
    userId: user._id,
    plan,
    billingCycle: cycle,
    amount: payment.amount || record?.amount || pricing?.amount || 0,
    currency: payment.currency || "INR",
    mode: "subscription",
    razorpaySubscriptionId: subscription.id,
    razorpayPaymentId: payment.id,
    razorpayPlanId: record?.razorpayPlanId,
    status: "active",
    paidAt: now,
    invoiceNumber: nextInvoiceNumber(),
    gstin: user.gstin,
    businessName: user.businessName,
  });
}

async function onSubscriptionCancelled(subscription) {
  if (!subscription) return;
  const userId = subscription.notes?.userId;
  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ razorpaySubscriptionId: subscription.id });

  if (!user) return;

  // Keep access until period end if expiry is in future
  user.subscriptionStatus = "cancelled";
  if (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) <= new Date()) {
    user.isSubscribed = false;
    user.subscriptionPlan = "Free";
  }
  await user.save();

  await Payment.updateMany(
    { razorpaySubscriptionId: subscription.id, status: { $in: ["created", "active"] } },
    { status: "cancelled" }
  );
}

async function onPaymentFailed(entity) {
  if (!entity) return;

  const subscriptionId = entity.subscription_id;
  const orderId = entity.order_id;

  let payment = null;
  if (subscriptionId) {
    payment = await Payment.findOne({ razorpaySubscriptionId: subscriptionId });
  }
  if (!payment && orderId) {
    payment = await Payment.findOne({ razorpayOrderId: orderId });
  }

  if (payment) {
    payment.status = "failed";
    payment.failureReason = entity.error_description || entity.error_code || "payment_failed";
    payment.razorpayPaymentId = entity.id;
    await payment.save();
  }

  const userId = entity.notes?.userId || payment?.userId;
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.subscriptionStatus = user.isSubscribed ? "past_due" : user.subscriptionStatus;
  await user.save();

  try {
    await sendPaymentFailedNotice({
      to: user.email,
      userName: user.firstName,
      plan: payment?.plan || user.subscriptionPlan,
      reason: entity.error_description || "Payment failed",
    });
  } catch (_) {
    /* ignore */
  }
}
