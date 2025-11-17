// apps/api/src/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const email = "biogreen20111@gmail.com";
  const passwordHash = await bcrypt.hash("Bio22445", 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      name: "Admin Biogreen",
      role: "ADMIN",
      passwordHash,
      verified: true
    }
  });

  console.log("Admin seeded:", admin.email);
}
main().finally(() => prisma.$disconnect());