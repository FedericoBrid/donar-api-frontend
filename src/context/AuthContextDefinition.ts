import { createContext } from "react";
import type { AuthResponse } from "../types/auth";

export interface AuthContextType {
  user: AuthResponse | null;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);