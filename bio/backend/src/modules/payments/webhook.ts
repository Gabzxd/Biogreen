// apps/api/src/modules/payments/webhook.ts
import { Router } from "express";
import { prisma } from "../../prisma/client";
import fetch from "node-fetch";
const r = Router();

r.post("/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type === "payment") {
      const paymentId = data.id;
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}` }
      }).then(r => r.json());

      const status = payment.status;
      const next =
        status === "approved" ? "PAID" :
        status === "pending" || status === "in_process" ? "PENDING" :
        "CANCELLED";

      await prisma.order.updateMany({ where: { paymentId: paymentId.toString() }, data: { status: next } });
    }
    res.sendStatus(200);
  } catch {
    res.sendStatus(200);
  }
});

export const webhookRoutes = r;