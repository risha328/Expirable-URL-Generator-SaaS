import cron from "node-cron";
import User from "../../models/User.js";

/**
 * Daily job: expire subscriptions past subscriptionExpiresAt
 * (also covers cancelled-at-period-end).
 */
export function startSubscriptionExpiryJob() {
  // Every day at 00:15 UTC
  cron.schedule("15 0 * * *", async () => {
    try {
      const now = new Date();
      const result = await User.updateMany(
        {
          isSubscribed: true,
          subscriptionExpiresAt: { $ne: null, $lt: now },
        },
        {
          $set: {
            isSubscribed: false,
            subscriptionPlan: "Free",
            subscriptionStatus: "expired",
          },
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`[expiry-job] Downgraded ${result.modifiedCount} expired subscription(s)`);
      }
    } catch (err) {
      console.error("[expiry-job] failed:", err.message);
    }
  });

  console.log("[expiry-job] Scheduled daily subscription expiry check (00:15 UTC)");
}
