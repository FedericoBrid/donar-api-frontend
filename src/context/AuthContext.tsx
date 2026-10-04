import { useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse } from "../types/auth";
import { AuthContext } from "./AuthContextDefinition";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthResponse | null>(null);

  const login = (authResponse: AuthResponse) => {
    setUser(authResponse);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}