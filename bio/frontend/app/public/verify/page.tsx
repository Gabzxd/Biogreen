// apps/web/app/(public)/verify/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const submit = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, { email, code });
    window.location.href = "/login";
  };
  return (
    <div className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-[#111936] p-6 rounded-lg border border-[#1C2541]">
        <h1 className="text-2xl font-semibold text-green-400">Biogreen</h1>
        <p className="text-sm mt-1 text-neutral-300">Verificação de Segurança</p>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded bg-[#0E142B] border border-[#26335A] p-2" placeholder="seu.email@exemplo.com"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full rounded bg-[#0E142B] border border-[#26335A] p-2" placeholder="Código de verificação (6 dígitos)"
            value={code} onChange={e => setCode(e.target.value)} />
          <button onClick={submit} className="w-full bg-green-600 text-white rounded p-2">Verificar Código</button>
        </div>
      </div>
    </div>
  );
}