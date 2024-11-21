import React, { useState } from "react";
import { uploadFile } from "../api/files"; // Función para manejar la subida de archivos
import { useAuth } from "../context/AuthContext"; // Contexto para manejar el token de usuario

interface FileUploadProps {
  projectId: number; // ID del proyecto asociado al archivo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileUploaded?: (file: any) => void; // Callback opcional al finalizar la subida
}

const FileUpload: React.FC<FileUploadProps> = ({ projectId, onFileUploaded }) => {
  const { token } = useAuth(); // Obtener el token de autenticación
  const [file, setFile] = useState<File | null>(null); // Estado para almacenar el archivo seleccionado
  const [uploading, setUploading] = useState<boolean>(false); // Estado para el indicador de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Manejar el cambio de archivo en el input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, selecciona un archivo para subir.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Subir el archivo
      const uploadedFile = await uploadFile(projectId, file, token);
      alert("Archivo subido exitosamente.");

      // Callback opcional para informar que el archivo ha sido subido
      if (onFileUploaded) {
        onFileUploaded(uploadedFile);
      }

      // Limpiar el estado del archivo después de subir
      setFile(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Subir Archivo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Seleccionar Archivo
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir Archivo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
