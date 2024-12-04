import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectStatus from './ProjectStatus';

interface ProjectCardProps {
  project: {
    project_id: number;
    project_name: string;
    project_description: string;
    project_status: string;
    project_created_at: string;
    user_name: string;
    user_email: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => navigate(`/projects-provider/${project.project_id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {project.project_name}
        </h3>
        <ProjectStatus status={project.project_status} />
      </div>

      <p className="text-gray-600 mb-4">{project.project_description}</p>

      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Cliente</p>
            <p className="font-medium">{project.user_name}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{project.user_email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Fecha de creación</p>
            <p className="font-medium">
              {new Date(project.project_created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;