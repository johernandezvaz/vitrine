import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectUpdate, { Update } from "../../components/Project/ProjectUpdate";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No se ha encontrado un token de autenticación.");
        setLoading(false);
        return;
      }
    
      try {
        const response = await fetch(`/api/all-projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        if (!response.ok) {
          const errorText = await response.text(); // Captura la respuesta como texto
          console.error("Error en respuesta:", errorText);
          throw new Error(`Error al obtener proyectos: ${response.status}`);
        }
      
        const data: Project[] = await response.json(); // Intenta parsear como JSON
        console.log("Datos recibidos:", data);
        setProject(data[0]); // Ajusta según la estructura
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido.");
      }finally {
        setLoading(false);
      }
    };
    

    fetchProjectDetails();
  }, [id]);

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!project) {
    return <p className="text-center">No se encontró el proyecto.</p>;
  }

  const handleBack = () => {
    navigate("/projects");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E293B] text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">Vitrine</div>
        <nav className="flex-grow">
          <ul>
            <li className="p-4 hover:bg-[#334155] cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-[#334155] cursor-pointer bg-[#334155]">Proyectos</li>
            <li className="p-4 hover:bg-[#334155] cursor-pointer">Tareas</li>
            <li className="p-4 hover:bg-[#334155] cursor-pointer">Mensajes</li>
          </ul>
        </nav>
        <button className="p-4 bg-red-500 hover:bg-red-600 text-white mt-auto">
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 p-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Volver a Proyectos
          </button>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-sm text-gray-500">
              Creado por: {project.owner?.name || "Desconocido"} el{" "}
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="mt-2 text-gray-600">{project.description}</p>
        </div>

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
      </main>
    </div>
  );
};

export default ProjectsClient;
