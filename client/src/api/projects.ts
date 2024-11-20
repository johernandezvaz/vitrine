import axios from "axios";

// Configuración base de la API
const API_URL = "http://localhost:5000/api/projects";

/**
 * Obtiene la lista de proyectos.
 * @param token Token de autenticación del usuario.
 * @returns Lista de proyectos.
 */
export const getProjects = async (token: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener los proyectos:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener los proyectos");
  }
};

/**
 * Obtiene los detalles de un proyecto específico.
 * @param projectId ID del proyecto.
 * @param token Token de autenticación del usuario.
 * @returns Detalles del proyecto.
 */
export const getProjectById = async (projectId: number, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener los detalles del proyecto:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener los detalles del proyecto");
  }
};

/**
 * Crea un nuevo proyecto.
 * @param project Datos del proyecto a crear.
 * @param token Token de autenticación del usuario.
 * @returns Proyecto creado.
 */
export const createProject = async (project: { title: string; description: string; serviceId: number }, token: string) => {
  try {
    const response = await axios.post(API_URL, project, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al crear el proyecto:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al crear el proyecto");
  }
};

/**
 * Actualiza un proyecto existente.
 * @param projectId ID del proyecto a actualizar.
 * @param updatedProject Datos del proyecto actualizado.
 * @param token Token de autenticación del usuario.
 * @returns Proyecto actualizado.
 */
export const updateProject = async (
  projectId: number,
  updatedProject: { title?: string; description?: string; status?: string },
  token: string
) => {
  try {
    const response = await axios.put(`${API_URL}/${projectId}`, updatedProject, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al actualizar el proyecto:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al actualizar el proyecto");
  }
};

/**
 * Elimina un proyecto.
 * @param projectId ID del proyecto a eliminar.
 * @param token Token de autenticación del usuario.
 */
export const deleteProject = async (projectId: number, token: string) => {
  try {
    await axios.delete(`${API_URL}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al eliminar el proyecto:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar el proyecto");
  }
};
