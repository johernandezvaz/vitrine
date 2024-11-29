import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectUpdate, { Update } from "../../components/Project/ProjectUpdate";
import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";

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

const ProjectsClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [projectsAvailable, setProjectsAvailable] = useState<boolean>(true); // Nuevo estado
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No se ha encontrado un token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/all-projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.message || `Error al obtener proyectos: ${response.status}`;
          console.error("Error en respuesta:", errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        if (data.length === 0) {
          setProjectsAvailable(false);
        } else {
          setProject(data[0]); // Carga el primer proyecto (puedes cambiar esto si es necesario)
          setProjectsAvailable(true);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleBack = () => {
    navigate("/projects");
  };

  const handleRequestProject = () => {
    console.log("Solicitando proyecto...");
    // Lógica para solicitar un nuevo proyecto
  };

  const handleAddProject = () => {
    console.log("Agregando un nuevo proyecto...");
    // Lógica para agregar un nuevo proyecto
  };

  if (loading) {
    return <p className="text-center">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* Navigation */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Vitrine</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/dashboard-client")}
            >
              <FaHome size={20} />
              <span>Dashboard</span>
            </li>
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/projects-client")}
            >
              <FaProjectDiagram size={20} />
              <span>Proyectos</span>
            </li>
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/tasks")}
            >
              <FaTasks size={20} />
              <span>Tareas</span>
            </li>
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/messages")}
            >
              <FaEnvelope size={20} />
              <span>Mensajes</span>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full flex items-center gap-4 bg-red-600 hover:bg-red-700 p-3 rounded-lg"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 p-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={() => navigate("/dashboard-client")}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Volver al dashboard
          </button>

          {projectsAvailable && project ? (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                <p className="text-sm text-gray-500">
                  Creado por: {project.owner?.name || "Desconocido"} el{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-gray-600">{project.description}</p>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Actualizaciones</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  {project.updates && project.updates.length > 0 ? (
                    project.updates.map((update) => (
                      <ProjectUpdate
                        key={update.id}
                        project={update}
                        onUpdate={(updatedUpdate) => {
                          console.log("Actualización guardada:", updatedUpdate);
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-gray-600">No hay actualizaciones disponibles.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No hay proyectos disponibles.</p>
              <button
                onClick={handleRequestProject}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
              >
                Solicitar Proyecto
              </button>
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Agregar Proyecto
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsClient;