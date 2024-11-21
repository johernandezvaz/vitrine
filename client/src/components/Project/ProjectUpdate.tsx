import React, { useState } from "react";

interface ProjectUpdateProps {
  project: {
    id: number;
    title: string;
    description: string;
    status: string;
  };
  onUpdate: (updatedProject: {
    id: number;
    title: string;
    description: string;
    status: string;
  }) => void;
}

export interface Update {
  id: number;
  title: string;
  description: string;
  status: string;
}

const ProjectUpdate: React.FC<ProjectUpdateProps> = ({ project, onUpdate }) => {
  const [updatedProject, setUpdatedProject] = useState(project);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!updatedProject.title || !updatedProject.description) {
      setError("El título y la descripción son obligatorios.");
      return;
    }

    setError(null);
    onUpdate(updatedProject);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Actualizar Proyecto</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={updatedProject.title}
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
            value={updatedProject.description}
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
            value={updatedProject.status}
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
