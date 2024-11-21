import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProjectUpdate from "../components/Project/ProjectUpdate";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al cargar los detalles del proyecto.");
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, user?.token]);

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
            project.updates.map((update: any) => (
              <ProjectUpdate key={update.id} update={update} />
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
