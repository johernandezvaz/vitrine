import React, { useState } from "react";
import { uploadFile } from "../api/files";
import { useAuth } from "../context/AuthContext";

interface FileUploadProps {
  projectId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileUploaded?: (file: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ projectId, onFileUploaded }) => {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, selecciona un archivo para subir.");
      return;
    }

    if (!token) {
      setError("No se ha encontrado un token de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const uploadedFile = await uploadFile(projectId, file, token);
      alert("Archivo subido exitosamente.");

      if (onFileUploaded) {
        onFileUploaded(uploadedFile);
      }

      setFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error al subir el archivo.");
      } else {
        setError("Ocurrió un error desconocido al subir el archivo.");
      }
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
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading || !file || !token}
          >
            {uploading ? "Subiendo..." : "Subir Archivo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;