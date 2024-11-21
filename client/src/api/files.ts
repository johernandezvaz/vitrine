import axios from "axios";

// URL base de la API
const API_URL = "http://localhost:5000/api/projects";

/**
 * Sube un archivo asociado a un proyecto.
 * @param projectId ID del proyecto.
 * @param file Archivo a subir.
 * @param token Token de autenticación.
 * @returns Datos del archivo subido.
 */
export const uploadFile = async (projectId: number, file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/${projectId}/files`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al subir el archivo:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al subir el archivo.");
  }
};
