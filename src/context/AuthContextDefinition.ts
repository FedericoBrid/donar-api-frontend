import { createContext } from "react";
import type { AuthResponse } from "../types/auth";
import type { User } from "../types/User";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (authResponse: AuthResponse) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);