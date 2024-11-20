import React, { useEffect, useState } from "react";
import { getProjects } from "../../api/projects"; // Servicio para obtener proyectos
import { Link } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        const projectsData = await getProjects(token);
        setProjects(projectsData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Error al cargar proyectos");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p className="text-center">Cargando proyectos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Proyectos</h1>
      {projects.length === 0 ? (
        <p className="text-center">No hay proyectos para mostrar.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="p-4 border rounded-md shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500">
                Estado:{" "}
                <span
                  className={`font-medium ${
                    project.status === "completed"
                      ? "text-green-500"
                      : project.status === "on_hold"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                >
                  {project.status === "in_progress"
                    ? "En progreso"
                    : project.status === "completed"
                    ? "Completado"
                    : "En espera"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Creado: {new Date(project.created_at).toLocaleDateString()}
              </p>
              <Link
                to={`/projects/${project.id}`}
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Ver detalles
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
