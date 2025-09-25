# Task: Add subscription column to admin users management page

## Completed Steps
- Updated backend User model to add subscriptionPlan field
- Updated backend getAllUsers controller to include isSubscribed and subscriptionPlan
- Updated backend updateSubscription controller to accept subscriptionPlan updates
- Updated frontend Pricing page to send subscriptionPlan on subscription update
- Updated frontend AuthContext to handle subscriptionPlan in updateSubscription
- Updated frontend AdminUsers page to add Subscription column showing subscription status and plan

## Next Steps
- Test subscription update flow from Pricing page for Pro plan
- Verify subscription status and plan display correctly in AdminUsers page
- Verify no regressions in user listing, filtering, and pagination in AdminUsers page
- Verify backend API responses include subscription info correctly
