// apps/api/src/middleware/auth.ts
import jwt from "jsonwebtoken";
export function authGuard(req: any, res: any, next: any) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "Não autorizado" });
  const token = h.replace("Bearer ", "");
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function adminGuard(req: any, res: any, next: any) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Acesso negado" });
  next();
}