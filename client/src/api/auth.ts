import axios from "axios";

const API_URL = "http://localhost:5000/api"; // URL base del backend

// Tipos de datos para los endpoints
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "client" | "provider";
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Función para iniciar sesión
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en el inicio de sesión:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};

// Función para registrar un nuevo usuario
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en el registro:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al registrar usuario");
  }
};

// Función para verificar el token de autenticación
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.valid;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al verificar el token:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Token inválido");
  }
};

// Función para cerrar sesión
export const logout = (): void => {
  localStorage.removeItem("token"); // Elimina el token del almacenamiento local
};
