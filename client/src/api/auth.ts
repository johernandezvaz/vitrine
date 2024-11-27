/* eslint-disable @typescript-eslint/no-explicit-any */
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
  role: "user"; // Solo se permite el rol 'user' en el registro
}

interface AuthResponse {
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export type UserResponse = {
  user: {
    id: string;
    email: string;
    role: "client" | "provider";
  };
};

// Función para iniciar sesión
export async function login(data: { email: string; password: string }): Promise<UserResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error en el inicio de sesión");
  }

  return response.json(); // Aquí retornamos el objeto esperado
}

// Función para registrar un nuevo usuario
export async function register(data: { name: string; email: string; password: string; role: "client" | "provider" }): Promise<UserResponse> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error en el registro");
  }

  return response.json(); // Aquí retornamos el objeto esperado
}

// Función para verificar la autenticación
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, { withCredentials: true });
    return response.status === 200;
  } catch (error: any) {
    console.error("Usuario no autenticado:", error.response?.data || error.message);
    return false;
  }
};

// Función para cerrar sesión
export const logout = (): void => {
  // Aquí podrías implementar una llamada al backend si es necesario limpiar sesiones
  window.location.href = "/login"; // Redirige al usuario a la página de inicio de sesión
};
