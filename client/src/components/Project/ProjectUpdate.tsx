import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Para capturar el ID del proyecto desde la URL y navegar entre páginas
import { getProjectById, updateProject } from "../../api/projects";
import { useAuth } from "../../context/AuthContext"; // Contexto para manejar el token de usuario

const ProjectUpdate: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Captura el ID del proyecto desde la URL
  const { token } = useAuth(); // Obtén el token del contexto de autenticación
  const navigate = useNavigate(); // Para redirigir después de actualizar
  const [project, setProject] = useState<{ title: string; description: string; status: string }>({
    title: "",
    description: "",
    status: "in_progress",
  }); // Estado para almacenar y editar los datos del proyecto
  const [loading, setLoading] = useState<boolean>(true); // Estado para el indicador de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función para cargar los detalles del proyecto
  const fetchProjectDetails = async () => {
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
    } catch (err: any) {
      setError(err.message || "Error al cargar los detalles del proyecto.");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  // Función para enviar el formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!projectId) {
        throw new Error("El ID del proyecto es inválido.");
      }
      await updateProject(Number(projectId), project, token);
      alert("El proyecto se ha actualizado correctamente.");
      navigate(`/projects/${projectId}`); // Redirige a la página de detalles del proyecto
    } catch (err: any) {
      setError(err.message || "Error al actualizar el proyecto.");
    }
  };

  // useEffect para cargar los datos al montar el componente
  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Renderizado mientras los datos están cargando
  if (loading) {
    return <div>Cargando detalles del proyecto...</div>;
  }

  // Renderizado si ocurre un error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Renderizado del formulario de edición
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
