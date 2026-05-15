"use client";

import { useState } from "react";
import type { User } from "@/domain/entities/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Error de conexion");
        return { ok: false as const };
      }

      setUser(data.user);
      return { ok: true as const, user: data.user as User };
    } catch {
      setError("Error de conexion");
      return { ok: false as const };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setError(null);
  }

  return { user, loading, error, login, logout };
}
