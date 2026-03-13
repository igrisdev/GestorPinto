"use client";
import { useState } from "react";
import { ResourceCard } from "@/components/ResourceCard";
import { getLinks, loginUser } from "./lib/notion";

export default function RecursosPage() {
  const [user, setUser] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginUser(email, pass);

    if (res.success) {
      setUser(res);
      const data = await getLinks(res.clase);
      setResources(data);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  // --- INTERFAZ DE LOGIN ---
  if (!user) {
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
            <div>
              <label className="block text-sm font-medium mb-1">
                Correo Institucional
              </label>
              <input
                type="email"
                placeholder="ejemplo@unimayor.edu.co"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPass(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
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
  }

  // --- INTERFAZ PRINCIPAL (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación superior */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Hola, {user.nombre} 👋
            </h1>
            <p className="text-sm text-gray-500">
              Clase:{" "}
              <span className="font-medium text-slate-700">{user.clase}</span>
            </p>
          </div>
          <button
            onClick={() => setUser(null)}
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenedor de las tarjetas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Tus enlaces asignados
          </h2>
          <span className="bg-slate-100 text-slate-700 py-1 px-3 rounded-full text-sm font-medium">
            {resources.length} recursos
          </span>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">
              No hay enlaces disponibles para esta clase aún.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map((item, index) => (
              <ResourceCard
                key={index}
                title={item.title}
                description={item.description}
                link={item.link}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
