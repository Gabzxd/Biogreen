// apps/api/src/modules/auth/routes.ts
import { Router } from "express";
import { prisma } from "../../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../../shared/mailer";

const r = Router();

r.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "E-mail já cadastrado" });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });

  // cria código de verificação 6 dígitos
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
  await prisma.verificationToken.create({ data: { userId: user.id, code, expiresAt } });
  await sendMail(email, "Verificação Biogreen", `Seu código: ${code}`);

  res.json({ id: user.id });
});

r.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });
  const vt = await prisma.verificationToken.findUnique({ where: { userId: user.id } });
  if (!vt || vt.code !== code || vt.expiresAt < new Date()) {
    return res.status(400).json({ error: "Código inválido" });
  }
  await prisma.user.update({ where: { id: user.id }, data: { verified: true } });
  await prisma.verificationToken.delete({ where: { userId: user.id } });
  res.json({ ok: true });
});

r.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.json({ token });
});

r.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });
    const link = `${process.env.APP_URL}/reset?token=${token}`;
    await sendMail(email, "Recuperação de senha Biogreen", `Use este link para redefinir sua senha: ${link}`);
  }
  res.json({ ok: true });
});

r.post("/reset", async (req, res) => {
  const { token, password } = req.body;
  const prt = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!prt || prt.used || prt.expiresAt < new Date()) return res.status(400).json({ error: "Token inválido" });
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id: prt.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.update({ where: { id: prt.id }, data: { used: true } });
  res.json({ ok: true });
});

export const authRoutes = r;