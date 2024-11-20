import axios from "axios";

// Configuración base de la API
const API_URL = "http://localhost:5000/api/users";

/**
 * Obtiene la información del perfil del usuario autenticado.
 * @param token Token de autenticación del usuario.
 * @returns Datos del usuario.
 */
export const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener el perfil del usuario:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener el perfil del usuario");
  }
};

/**
 * Actualiza la información del perfil del usuario autenticado.
 * @param updatedData Datos actualizados del usuario.
 * @param token Token de autenticación del usuario.
 * @returns Perfil actualizado.
 */
export const updateUserProfile = async (
  updatedData: { name?: string; email?: string; password?: string },
  token: string
) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al actualizar el perfil del usuario:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al actualizar el perfil del usuario");
  }
};

/**
 * Obtiene la lista de usuarios (solo para administradores).
 * @param token Token de autenticación del usuario administrador.
 * @returns Lista de usuarios.
 */
export const getAllUsers = async (token: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener la lista de usuarios:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener la lista de usuarios");
  }
};

/**
 * Elimina un usuario (solo para administradores).
 * @param userId ID del usuario a eliminar.
 * @param token Token de autenticación del usuario administrador.
 */

export const deleteUser = async (userId: number, token: string) => {
  try {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al eliminar al usuario:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar al usuario");
  }
};
