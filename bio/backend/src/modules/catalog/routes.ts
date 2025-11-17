// apps/api/src/modules/catalog/routes.ts
import { Router } from "express";
import { prisma } from "../../prisma/client";
const r = Router();

r.get("/products", async (req, res) => {
  const { q, category, min, max, page = "1", pageSize = "12" } = req.query as any;
  const where: any = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  if (category) where.category = { slug: category };
  if (min || max) where.priceCents = { gte: Number(min) || undefined, lte: Number(max) || undefined };

  const skip = (Number(page) - 1) * Number(pageSize);
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip, take: Number(pageSize), orderBy: { name: "asc" } }),
    prisma.product.count({ where })
  ]);

  res.json({ items, total });
});

export const catalogRoutes = r;