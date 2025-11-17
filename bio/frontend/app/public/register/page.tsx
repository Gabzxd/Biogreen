// apps/web/app/(public)/register/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [ok, setOk] = useState(false);

  const submit = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, form);
    setOk(true);
  };

  return (
    <div className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-[#111936] p-6 rounded-lg border border-[#1C2541]">
        <h1 className="text-2xl font-semibold text-green-400">Biogreen</h1>
        <p className="text-sm mt-1 text-neutral-300">Crie sua conta para começar</p>
        {!ok ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm">Nome de Usuário</label>
              <input className="mt-1 w-full rounded bg-[#0E142B] border border-[#26335A] p-2"
                placeholder="Seu nome de usuário"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">E-mail</label>
              <input className="mt-1 w-full rounded bg-[#0E142B] border border-[#26335A] p-2"
                placeholder="seu.email@exemplo.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Senha</label>
              <input type="password" className="mt-1 w-full rounded bg-[#0E142B] border border-[#26335A] p-2"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button onClick={submit} className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2">Cadastrar</button>
            <p className="text-sm text-neutral-400">Já tem uma conta? <a href="/login" className="text-green-400 hover:underline">Fazer login</a></p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p>Enviamos um código de verificação para seu e-mail.</p>
            <a href="/verify" className="text-green-400 hover:underline">Ir para verificação</a>
          </div>
        )}
      </div>
    </div>
  );
}