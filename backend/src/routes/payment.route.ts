import express from "express";
import { registerManualPayment } from "../controllers/payment.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();

// POST /payments/manual  — admin only
router.post("/manual", adminMiddleware, registerManualPayment);

export default router;
