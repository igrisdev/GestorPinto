"use client";

import { useCallback, useEffect, useState } from "react";
import type { Resource } from "@/domain/entities/resource";

export function useResources(clase?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (currentClase?: string) => {
    const claseTarget = currentClase ?? clase;
    if (!claseTarget) {
      setResources([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/resources?clase=${encodeURIComponent(claseTarget)}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError("No fue posible cargar los recursos");
        setResources([]);
        return;
      }

      setResources(data.resources ?? []);
    } catch {
      setError("No fue posible cargar los recursos");
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [clase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { resources, loading, error, refresh };
}
