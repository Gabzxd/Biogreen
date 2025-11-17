// apps/api/src/modules/cart/routes.ts
import { Router } from "express";
import { prisma } from "../../prisma/client";
import { authGuard } from "../../middleware/auth";
const r = Router();

r.post("/create-order", authGuard, async (req: any, res) => {
  const { items } = req.body as { items: { productId: string; quantity: number }[] };

  // valida estoque
  const products = await prisma.product.findMany({ where: { id: { in: items.map(i => i.productId) } } });
  const orderItems = items.map(i => {
    const p = products.find(x => x.id === i.productId)!;
    return { productId: p.id, quantity: i.quantity, priceCents: p.priceCents };
  });
  const totalCents = orderItems.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

  // regra: bloquear se qualquer item hazardous e usuário não verificado
  const hasHazardous = products.some(p => p.hazardous);
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (hasHazardous && !user?.verified) {
    return res.status(403).json({ error: "Conta não verificada. Verifique seu e-mail para comprar produtos restritos." });
  }

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      totalCents,
      items: { create: orderItems }
    },
    include: { items: { include: { product: true } } }
  });

  res.json({ orderId: order.id });
});

export const cartRoutes = r;