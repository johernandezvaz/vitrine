import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject } from "../../api/projects";
import { useAuth } from "../../context/AuthContext";

interface Project {
  title: string;
  description: string;
  status: string;
}

const ProjectUpdate: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    status: "in_progress",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    if (!token) {
      setError("No se ha encontrado un token de autenticación. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    try {
      if (!projectId) {
        throw new Error("El ID del proyecto es inválido.");
      }
      const data = await getProjectById(Number(projectId), token);
      setProject({
        title: data.title,
        description: data.description,
        status: data.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los detalles del proyecto.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("No se ha encontrado un token de autenticación. Por favor, inicia sesión nuevamente.");
      return;
    }

    try {
      if (!projectId) {
        throw new Error("El ID del proyecto es inválido.");
      }
      await updateProject(Number(projectId), project, token);
      alert("El proyecto se ha actualizado correctamente.");
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el proyecto.");
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId, token]);

  if (loading) {
    return <div className="p-4 text-center">Cargando detalles del proyecto...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Actualizar Proyecto</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={project.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={project.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={project.status}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="in_progress">En progreso</option>
            <option value="completed">Completado</option>
            <option value="on_hold">En espera</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectUpdate;