import { ResourceCard } from "@/components/ResourceCard";
import type { User } from "@/types/user";
import type { Resource } from "@/types/resource";

interface DashboardProps {
  user: User;
  resources: Resource[];
  onLogout: () => void;
}

export const Dashboard = ({ user, resources, onLogout }: DashboardProps) => {
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
            onClick={onLogout}
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
            {resources.map((item) => (
              <ResourceCard
                key={item.id}
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
};
