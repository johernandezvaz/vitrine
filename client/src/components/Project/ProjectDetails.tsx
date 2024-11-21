import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para capturar el ID del proyecto desde la URL
import { getProjectById } from "../../api/projects";
import { useAuth } from "../../context/AuthContext"; // Contexto para manejar el token de usuario

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Captura el ID desde la URL
  const { token } = useAuth(); // Obtén el token del usuario
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<any>(null); // Estado para guardar los detalles del proyecto
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [loading, setLoading] = useState<boolean>(true); // Estado para mostrar un indicador de carga

  // Función para obtener los detalles del proyecto
  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      if (!projectId) {
        throw new Error("El ID del proyecto es inválido.");
      }
      const data = await getProjectById(Number(projectId), token);
      setProject(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Error al cargar los detalles del proyecto.");
    } finally {
      setLoading(false);
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

  // Renderizado de los detalles del proyecto
  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      {project ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
          <p className="mb-4 text-gray-600">{project.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Estado:</span>{" "}
            <span className={`text-${project.status === "completed" ? "green" : project.status === "on_hold" ? "yellow" : "blue"}-600`}>
              {project.status === "in_progress" ? "En progreso" : project.status === "completed" ? "Completado" : "En espera"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Creado el:</span> {new Date(project.created_at).toLocaleDateString()}
          </div>
        </>
      ) : (
        <p>No se encontraron detalles para este proyecto.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
