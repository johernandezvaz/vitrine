import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import ProjectUpdate, { Update } from "../components/Project/ProjectUpdate";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  owner?: {
    name: string;
  };
  updates: Update[];
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!token) {
        setError("No se ha encontrado un token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del proyecto.");
        }
        const data: Project = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al cargar los detalles del proyecto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, token]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!project) {
    return <p className="text-center">No se encontró el proyecto.</p>;
  }

  const handleBack = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Volver a Proyectos
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
          <p className="mt-2 text-gray-600">{project.description}</p>
          <p className="mt-4 text-sm text-gray-500">
            Creado por: {project.owner?.name || "Desconocido"} el{" "}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Actualizaciones</h2>
          {project.updates && project.updates.length > 0 ? (
            project.updates.map((update) => (
                <ProjectUpdate 
                project={update} 
                onUpdate={(updatedUpdate) => {
                  // Lógica para manejar la actualización
                  console.log("Actualización guardada:", updatedUpdate);
                }} 
              />
            ))
          ) : (
            <p className="text-gray-600">No hay actualizaciones disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
