import { createContext, useState } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/authService";

export type AuthContextType = {
  user: { id: string; email: string; role: "client" | "provider" } | null;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: "client" | "provider" }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      setUser(response.user); // Actualiza el estado con el usuario autenticado
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: "client" | "provider" }) => {
    try {
      const response = await apiRegister(data);
      setUser(response.user); // Actualiza el estado con el usuario registrado
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout(); // Llama al servicio si es necesario
    setUser(null); // Limpia el estado del usuario
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
