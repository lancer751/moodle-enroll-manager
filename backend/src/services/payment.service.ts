// Payment processing service
// Handles webhook validation (simulated), payment registration (Pago),
// idempotency (duplicate transaction code check), and Compra status update.

import { prisma } from "../config/connection";
import { enrollClientFromCompra } from "./enrollment.service";
import {
    sendPaymentConfirmedEmail,
    sendPaymentRejectedEmail,
    sendManualPaymentRegisteredEmail,
} from "./email.service";

export type PaymentMethod = "efectivo" | "transferencia" | "pos" | "online" | "otro";
export type PaymentStatus = "confirmado" | "rechazado" | "pendiente";

export interface ProcessPaymentOptions {
    compraId: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionCode?: string; // required for online/webhook payments
    isManual?: boolean;
}

export interface ProcessPaymentResult {
    success: boolean;
    pagoId?: string;
    isDuplicate?: boolean;
    enrollmentResults?: Array<{ success: boolean; alreadyEnrolled?: boolean; matriculaId?: string; error?: string }>;
    error?: string;
}

/**
 * Simulated webhook signature validation.
 * Returns true if the signature looks valid (always true in simulation).
 */
export function validateWebhookSignature(
    _payload: unknown,
    _signature: string
): boolean {
    // In production: compare HMAC-SHA256 of payload with secret key.
    // For MVP: always return true (simulated).
    return true;
}

/**
 * Core payment processing function used by both webhook and manual routes.
 */
export async function processPayment(
    options: ProcessPaymentOptions
): Promise<ProcessPaymentResult> {
    const { compraId, amount, method, status, transactionCode, isManual } = options;

    // 1. Validate the order exists
    const compra = await prisma.compra.findUnique({
        where: { id: compraId },
        include: { cliente: true },
    });

    if (!compra) {
        return { success: false, error: `Compra ${compraId} not found` };
    }

    // 2. Idempotency — prevent duplicate transaction codes
    if (transactionCode) {
        const duplicate = await prisma.pago.findUnique({
            where: { codigo_transaccion: transactionCode },
        });
        if (duplicate) {
            console.log(`⚠️ [PAYMENT] Duplicate transaction code: ${transactionCode}`);
            return { success: true, isDuplicate: true, pagoId: duplicate.id };
        }
    }

    // 3. Map status to Prisma enum
    const estadoPago =
        status === "confirmado"
            ? "confirmado"
            : status === "rechazado"
                ? "rechazado"
                : "pendiente";

    const estadoCompra =
        status === "confirmado"
            ? "pagado"
            : status === "rechazado"
                ? "cancelado"
                : "pendiente";

    // 4. Create Pago + update Compra in a transaction
    const pago = await prisma.$transaction(async (tx) => {
        const newPago = await tx.pago.create({
            data: {
                orden_id: compraId,
                cantidad: amount,
                estado: estadoPago as "confirmado" | "rechazado" | "pendiente" | "reembolsado",
                codigo_transaccion: transactionCode ?? null,
                metodo_pago: method,
                fecha_pago: status === "confirmado" ? new Date() : null,
            },
        });

        await tx.compra.update({
            where: { id: compraId },
            data: { estado_order: estadoCompra as "pagado" | "cancelado" | "pendiente" | "reembolsado" },
        });

        return newPago;
    });

    const clientName = `${compra.cliente.nombre} ${compra.cliente.apellido_paterno}`;
    const clientEmail = compra.cliente.email;

    // 5. Post-payment actions
    if (status === "confirmado") {
        // Send payment confirmed email
        sendPaymentConfirmedEmail(
            clientEmail,
            clientName,
            amount,
            transactionCode ?? pago.id
        );

        if (isManual) {
            sendManualPaymentRegisteredEmail(clientEmail, clientName, amount, method);
        }

        // Enroll client in all courses from this order
        const enrollmentResults = await enrollClientFromCompra(compraId);
        return { success: true, pagoId: pago.id, enrollmentResults };
    }

    if (status === "rechazado") {
        sendPaymentRejectedEmail(clientEmail, clientName, amount);
    }

    return { success: true, pagoId: pago.id };
}
