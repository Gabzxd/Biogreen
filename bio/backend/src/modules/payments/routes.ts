// apps/api/src/modules/payments/routes.ts
import { Router } from "express";
import { prisma } from "../../prisma/client";
import fetch from "node-fetch";
import { authGuard } from "../../middleware/auth";
const r = Router();

r.post("/create", authGuard, async (req: any, res) => {
  const { orderId } = req.body;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true }
  });
  if (!order || order.userId !== req.user.id) return res.status(404).json({ error: "Pedido não encontrado" });

  const items = order.items.map(i => ({
    id: i.productId,
    title: i.product.name,
    quantity: i.quantity,
    currency_id: "BRL",
    unit_price: i.priceCents / 100
  }));

  const body = {
    items,
    payer: { email: order.user.email },
    back_urls: {
      success: `${process.env.APP_URL}/success?order=${order.id}`,
      failure: `${process.env.APP_URL}/checkout?order=${order.id}`,
      pending: `${process.env.APP_URL}/checkout?order=${order.id}`
    },
    notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 12
    }
  };

  const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN!}` },
    body: JSON.stringify(body)
  }).then(r => r.json());

  await prisma.order.update({ where: { id: order.id }, data: { paymentId: mpRes.id } });
  res.json({ preferenceId: mpRes.id, init_point: mpRes.init_point });
});

export const paymentRoutes = r;