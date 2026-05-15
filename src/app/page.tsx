"use client";
import { LoginForm } from "@/presentation/components/LoginForm";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";
import { ResourcesGrid } from "@/presentation/components/ResourcesGrid";
import { EmptyResourcesState } from "@/presentation/components/EmptyResourcesState";
import { useAuth } from "@/presentation/hooks/use-auth";
import { useResources } from "@/presentation/hooks/use-resources";

export default function RecursosPage() {
  const { user, loading: authLoading, error: authError, login, logout } = useAuth();
  const { resources, loading: resourcesLoading, error: resourcesError, refresh } =
    useResources(user?.clase);

  async function handleLogin(email: string, password: string) {
    const result = await login(email, password);
    if (result.ok) {
      await refresh(result.user.clase);
    }
  }

  if (!user) {
    return <LoginForm onSubmit={handleLogin} loading={authLoading} error={authError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Tus enlaces asignados</h2>
          <span className="bg-slate-100 text-slate-700 py-1 px-3 rounded-full text-sm font-medium">
            {resources.length} recursos
          </span>
        </div>

        {resourcesLoading ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Cargando recursos...</p>
          </div>
        ) : null}

        {resourcesError ? <p className="text-sm text-red-600 mb-4">{resourcesError}</p> : null}

        {!resourcesLoading && resources.length === 0 ? (
          <EmptyResourcesState />
        ) : (
          <ResourcesGrid resources={resources} />
        )}
      </main>
    </div>
  );
}
