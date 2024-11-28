import { createContext } from "react";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "client" | "provider";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);