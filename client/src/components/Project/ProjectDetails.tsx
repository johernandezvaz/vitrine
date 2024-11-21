import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../api/projects";
import { useAuth } from "../../context/AuthContext";

interface Project {
  id: number;
  title: string;
  description: string;
  status: "in_progress" | "completed" | "on_hold";
  created_at: string;
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjectDetails = async () => {
    if (!token) {
      setError("No se ha encontrado un token de autenticación. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (!projectId) {
        throw new Error("El ID del proyecto es inválido.");
      }
      const data = await getProjectById(Number(projectId), token);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los detalles del proyecto.");
    } finally {
      setLoading(false);
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
      {project ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
          <p className="mb-4 text-gray-600">{project.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Estado:</span>{" "}
            <span 
              className={`${
                project.status === "completed" 
                  ? "text-green-600" 
                  : project.status === "on_hold" 
                  ? "text-yellow-600" 
                  : "text-blue-600"
              }`}
            >
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