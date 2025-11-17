// apps/web/app/(public)/login/page.tsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, form);
    localStorage.setItem("token", data.token);
    window.location.href = "/"; // redireciona para home
  };

  return (
    <div className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-[#111936] p-6 rounded-lg border border-[#1C2541]">
        <h1 className="text-2xl font-semibold text-green-400">Biogreen</h1>
        <p className="text-sm mt-1 text-neutral-300">Acesse sua conta para continuar</p>
        <div className="mt-6 space-y-4">
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
          <a href="/forgot" className="text-sm text-green-400 hover:underline">Esqueci minha senha</a>
          <button onClick={submit} className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2">Entrar</button>
          <p className="text-sm text-neutral-400">Não tem uma conta? <a href="/register" className="text-green-400 hover:underline">Criar conta</a></p>
        </div>
      </div>
    </div>
  );
}