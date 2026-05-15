"use client";

import { useState } from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(email, pass);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-center">
          <h2 className="text-2xl font-bold text-white">Portal de Recursos</h2>
          <p className="text-slate-300 mt-2 text-sm">
            Ingresa con tu cuenta de Unimayor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Correo Institucional
            </label>
            <input
              type="email"
              placeholder="ejemplo@unimayor.edu.co"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Contrasena
            </label>
            <input
              type="password"
              placeholder="........"
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none text-black"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 active:scale-[0.98]"
            }`}
          >
            {loading ? "Verificando credenciales..." : "Iniciar Sesion"}
          </button>
        </form>
      </div>
    </div>
  );
}
