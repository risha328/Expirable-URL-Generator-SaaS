/**
 * Server-side plan pricing (source of truth).
 * Amounts are in paise (₹1 = 100 paise). Never trust client amounts.
 */
export const PLAN_CONFIG = {
  Pro: {
    monthly: {
      amount: 39900,
      currency: "INR",
      days: 30,
      label: "Expireo Pro Monthly",
      period: "monthly",
      interval: 1,
      totalCount: 120, // ~10 years; user can cancel anytime
    },
    annual: {
      amount: 399000,
      currency: "INR",
      days: 365,
      label: "Expireo Pro Annual",
      period: "yearly",
      interval: 1,
      totalCount: 10,
    },
  },
  Business: {
    monthly: {
      amount: 99900,
      currency: "INR",
      days: 30,
      label: "Expireo Business Monthly",
      period: "monthly",
      interval: 1,
      totalCount: 120,
    },
    annual: {
      amount: 999000,
      currency: "INR",
      days: 365,
      label: "Expireo Business Annual",
      period: "yearly",
      interval: 1,
      totalCount: 10,
    },
  },
};

export const PAID_PLANS = Object.keys(PLAN_CONFIG);

export function getPlanPricing(plan, billingCycle) {
  const cycle = billingCycle === "annual" ? "annual" : "monthly";
  const config = PLAN_CONFIG[plan]?.[cycle];
  if (!config) return null;
  return { plan, billingCycle: cycle, ...config };
}

export function planCacheKey(plan, billingCycle, amountOverride = null) {
  const cycle = billingCycle === "annual" ? "annual" : "monthly";
  return amountOverride != null ? `${plan}_${cycle}_${amountOverride}` : `${plan}_${cycle}`;
}
