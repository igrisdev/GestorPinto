"use client";

import { useState } from "react";
import { loginUser, getLinks } from "@/app/lib/notion";
import type { User } from "@/types/user";
import type { Resource } from "@/types/resource";

interface LoginFormProps {
  onLoginSuccess: (user: User, resources: Resource[]) => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginUser(email, pass);

    if (res.success) {
      const data = await getLinks(res.clase);
      onLoginSuccess(
        { nombre: res.nombre, clase: res.clase, estado: res.estado },
        data
      );
    } else {
      setError(res.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 px-8 py-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            Portal de Recursos
          </h2>
          <p className="text-slate-300 mt-2 text-sm">
            Ingresa con tu cuenta de Unimayor
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">
              Correo Institucional
            </label>
            <input
              type="email"
              placeholder="unico@unimayor.edu.co"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-slate-900 placeholder:text-gray-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-slate-900 placeholder:text-gray-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 active:scale-[0.98]"
            }`}
          >
            {loading ? "Verificando credenciales..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};
