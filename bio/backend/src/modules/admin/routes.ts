// apps/api/src/modules/admin/routes.ts
import { Router } from "express";
import { prisma } from "../../prisma/client";
import { authGuard, adminGuard } from "../../middleware/auth";
const r = Router();

r.use(authGuard, adminGuard);

r.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products);
});

r.post("/products", async (req, res) => {
  const { name, description, priceCents, stock, categoryId, imageUrl, hazardous } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const p = await prisma.product.create({ data: { name, description, priceCents, stock, categoryId, imageUrl, hazardous, slug } });
  res.json(p);
});

r.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const p = await prisma.product.update({ where: { id }, data });
  res.json(p);
});

r.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.json({ ok: true });
});

r.get("/orders", async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(orders);
});

r.put("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // PAID | PENDING | CANCELLED
  const o = await prisma.order.update({ where: { id }, data: { status } });
  res.json(o);
});

export const adminRoutes = r;