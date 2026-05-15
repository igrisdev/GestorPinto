"use client";

import type { User } from "@/domain/entities/user";

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hola, {user.nombre} 👋</h1>
          <p className="text-sm text-gray-500">
            Clase: <span className="font-medium text-slate-700">{user.clase}</span>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          Cerrar Sesion
        </button>
      </div>
    </header>
  );
}
