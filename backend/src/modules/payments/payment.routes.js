import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
  createOrder,
  createSubscription,
  verifyPayment,
  cancelSubscription,
  changePlan,
  validatePromo,
  handleWebhook,
  getPaymentHistory,
  getBillingSummary,
  downloadInvoice,
  updateBillingProfile,
  retryFailedPayment,
} from "./payment.controller.js";

const router = express.Router();

// One-time orders (Phase 1 + retry fallback)
router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);

// Recurring subscriptions (Phase 2)
router.post("/create-subscription", authMiddleware, createSubscription);
router.post("/cancel-subscription", authMiddleware, cancelSubscription);
router.post("/change-plan", authMiddleware, changePlan);

// Promos + billing profile (Phase 3)
router.post("/validate-promo", authMiddleware, validatePromo);
router.put("/billing-profile", authMiddleware, updateBillingProfile);
router.post("/retry", authMiddleware, retryFailedPayment);

router.get("/history", authMiddleware, getPaymentHistory);
router.get("/billing", authMiddleware, getBillingSummary);
router.get("/invoice/:id", authMiddleware, downloadInvoice);

// Webhook — no JWT
router.post("/webhook", handleWebhook);

export default router;
