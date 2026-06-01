import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Alert } from "react-native";
import { loginUser } from "../services/auth";
import { clearUser, loadUser, saveUser } from "../store/auth";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await loadUser();
        if (stored) {
          setUser(stored);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      const response = await loginUser(email, password);
      if (response.success) {
        setUser(response.user);
        await saveUser(response.user);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error";
      Alert.alert("Error", message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    await clearUser();
    setUser(null);
    setLoading(false);
  }

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
