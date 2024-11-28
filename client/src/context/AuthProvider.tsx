import { useAuth } from "../hooks/useAuth";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/authService"
import { AuthContext } from "./AuthContext";

export const AuthProviderWithActions = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      setUser(response.user); // Actualiza el contexto con el usuario autenticado
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: "client" | "provider" }) => {
    try {
      const response = await apiRegister(data);
      setUser(response.user); // Actualiza el contexto con el usuario registrado
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout(); // Llama al servicio si es necesario
    setUser(null); // Limpia el usuario del contexto
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
