import Razorpay from "razorpay";
import crypto from "crypto";
import { getPlanPricing, planCacheKey } from "./planConfig.js";
import RazorpayPlanCache from "../../models/RazorpayPlanCache.js";

let razorpayClient = null;

function cleanEnv(value) {
  return value?.replace(/\r/g, "").trim() || "";
}

export function resetRazorpayClient() {
  razorpayClient = null;
}

export function isSubscriptionsEnabled() {
  return cleanEnv(process.env.RAZORPAY_SUBSCRIPTIONS_ENABLED).toLowerCase() === "true";
}

export function getRazorpayClient() {
  if (razorpayClient) return razorpayClient;

  const keyId = cleanEnv(process.env.RAZORPAY_KEY_ID);
  const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);

  if (!keyId || !keySecret) {
    const err = new Error(
      "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env and restart the server."
    );
    err.statusCode = 503;
    throw err;
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayClient;
}

export function getRazorpayKeyId() {
  return cleanEnv(process.env.RAZORPAY_KEY_ID);
}

export function verifyPaymentSignature(orderId, paymentId, signature) {
  const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);
  if (!keySecret) return false;

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
}

/** Subscription checkout signature: payment_id|subscription_id */
export function verifySubscriptionSignature(paymentId, subscriptionId, signature) {
  const keySecret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);
  if (!keySecret) return false;

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  return expected === signature;
}

export function verifyWebhookSignature(rawBody, signature) {
  const webhookSecret = cleanEnv(process.env.RAZORPAY_WEBHOOK_SECRET);
  if (!webhookSecret || !signature) return false;

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}

/**
 * Ensure a Razorpay Plan exists (cached in Mongo). Creates once per amount/cycle.
 */
export async function ensureRazorpayPlan({ plan, billingCycle, amount }) {
  const pricing = getPlanPricing(plan, billingCycle);
  if (!pricing) {
    const err = new Error("Invalid plan or billing cycle");
    err.statusCode = 400;
    throw err;
  }

  const finalAmount = amount ?? pricing.amount;
  const key = planCacheKey(plan, billingCycle, finalAmount === pricing.amount ? null : finalAmount);

  const cached = await RazorpayPlanCache.findOne({ key });
  if (cached?.razorpayPlanId) {
    return { razorpayPlanId: cached.razorpayPlanId, pricing: { ...pricing, amount: finalAmount } };
  }

  const razorpay = getRazorpayClient();
  const rzPlan = await razorpay.plans.create({
    period: pricing.period,
    interval: pricing.interval,
    item: {
      name: pricing.label + (finalAmount !== pricing.amount ? " (promo)" : ""),
      amount: finalAmount,
      currency: pricing.currency,
      description: `${plan} ${billingCycle} subscription`,
    },
  });

  await RazorpayPlanCache.findOneAndUpdate(
    { key },
    {
      key,
      razorpayPlanId: rzPlan.id,
      plan,
      billingCycle,
      amount: finalAmount,
    },
    { upsert: true, new: true }
  );

  return { razorpayPlanId: rzPlan.id, pricing: { ...pricing, amount: finalAmount } };
}

export async function createRazorpayOrder({ plan, billingCycle, userId, receiptSuffix, amount }) {
  const pricing = getPlanPricing(plan, billingCycle);
  if (!pricing) {
    const err = new Error("Invalid plan or billing cycle");
    err.statusCode = 400;
    throw err;
  }

  const finalAmount = amount ?? pricing.amount;
  const razorpay = getRazorpayClient();
  const receipt = `exp_${receiptSuffix || userId}`.slice(0, 40);

  const order = await razorpay.orders.create({
    amount: finalAmount,
    currency: pricing.currency,
    receipt,
    notes: {
      userId: String(userId),
      plan: pricing.plan,
      billingCycle: pricing.billingCycle,
    },
  });

  return { order, pricing: { ...pricing, amount: finalAmount } };
}

export async function createRazorpaySubscription({
  plan,
  billingCycle,
  userId,
  amount,
  customerNotify = 1,
}) {
  const { razorpayPlanId, pricing } = await ensureRazorpayPlan({
    plan,
    billingCycle,
    amount,
  });

  const razorpay = getRazorpayClient();
  const subscription = await razorpay.subscriptions.create({
    plan_id: razorpayPlanId,
    total_count: pricing.totalCount,
    customer_notify: customerNotify,
    notes: {
      userId: String(userId),
      plan,
      billingCycle,
    },
  });

  return { subscription, pricing, razorpayPlanId };
}

export async function cancelRazorpaySubscription(subscriptionId, cancelAtCycleEnd = false) {
  const razorpay = getRazorpayClient();
  return razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
}

export async function fetchRazorpaySubscription(subscriptionId) {
  const razorpay = getRazorpayClient();
  return razorpay.subscriptions.fetch(subscriptionId);
}
