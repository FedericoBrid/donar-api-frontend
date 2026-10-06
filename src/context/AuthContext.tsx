import { useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../types/auth";
import { AuthContext } from "./AuthContextDefinition";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const storedUser = localStorage.getItem("auth");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (authResponse: AuthResponse) => {
    setUser(authResponse);
    localStorage.setItem("auth", JSON.stringify(authResponse));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}