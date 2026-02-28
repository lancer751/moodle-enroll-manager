// Payment controller — manual payment registration and admin-initiated workflows.

import type { Request, Response } from "express";
import { processPayment, type PaymentMethod } from "../services/payment.service";

/**
 * POST /payments/manual
 * Admin-only. Body: { orderId, amount, method, status }
 *
 * method: efectivo | transferencia | pos | otro
 * status: confirmado | rechazado | pendiente
 */
export async function registerManualPayment(req: Request, res: Response) {
    try {
        const { orderId, amount, method, status } = req.body;

        if (!orderId || !amount || !method || !status) {
            return res.status(400).json({ error: "orderId, amount, method, and status are required" });
        }

        const allowedMethods: PaymentMethod[] = ["efectivo", "transferencia", "pos", "online", "otro"];
        if (!allowedMethods.includes(method as PaymentMethod)) {
            return res.status(400).json({ error: `Invalid method. Allowed: ${allowedMethods.join(", ")}` });
        }

        const allowedStatuses = ["confirmado", "rechazado", "pendiente"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatuses.join(", ")}` });
        }

        const result = await processPayment({
            compraId: orderId,
            amount: Number(amount),
            method: method as PaymentMethod,
            status,
            isManual: true,
        });

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(201).json({
            message: `Manual payment ${status === "confirmado" ? "confirmed and enrollment triggered" : status}`,
            pagoId: result.pagoId,
            enrollmentResults: result.enrollmentResults,
        });
    } catch (error) {
        console.error("[PAYMENT] registerManualPayment failed:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
