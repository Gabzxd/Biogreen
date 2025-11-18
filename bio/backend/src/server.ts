import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Importar rotas
import { authRoutes } from "./modules/auth/routes";
import * as catalogRoutes from "./modules/catalog/routes";
import * as cartRoutes from "./modules/cart/routes";
import * as adminRoutes from "./modules/admin/routes";
import * as paymentRoutes from "./modules/payments/routes";

// Middleware de autenticação
import { authenticate } from "./middleware/auth";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use("/auth", authRoutes);
app.use("/catalog", catalogRoutes);

// Rotas protegidas
app.use("/cart", authenticate, cartRoutes);
app.use("/admin", authenticate, adminRoutes);
app.use("/payments", authenticate, paymentRoutes);

// Rota de teste
app.get("/", (_, res) => res.send("🚀 API Biogreen rodando com sucesso!"));

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});