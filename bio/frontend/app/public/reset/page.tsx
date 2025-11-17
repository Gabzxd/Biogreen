"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function ResetPage() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset`, {
        token,
        password,
      });
      setOk(true);
    } catch (err: any) {
      setError("Token inválido ou expirado.");
    }
  };

  return (
    <div className="grid place-items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-[#111936] p-6 rounded-lg border border-[#1C2541]">
        <h1 className="text-2xl font-semibold text-green-400">Biogreen</h1>
        <p className="text-sm mt-1 text-neutral-300">Redefinição de Senha</p>

        {!ok ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm">Nova Senha</label>
              <input
                type="password"
                className="mt-1 w-full rounded bg-[#0E142B] border border-[#26335A] p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Confirmar Nova Senha</label>
              <input
                type="password"
                className="mt-1 w-full rounded bg-[#0E142B] border border-[#26335A] p-2"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={submit}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded p-2"
            >
              Redefinir Senha
            </button>
          </div>