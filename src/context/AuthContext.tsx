import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../types/auth";
import type { User } from "../types/User";
import { AuthContext } from "./AuthContextDefinition";
import api from "../services/api";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(
    () => localStorage.getItem("token") !== null,
  );

  const login = async (authResponse: AuthResponse): Promise<void> => {
    localStorage.setItem("token", authResponse.token);

    try {
      const response = await api.get<User>("/users/me");
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    api
      .get<User>("/users/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}