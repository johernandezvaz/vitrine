import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  project_status: string;
  project_created_at: string;
  user_name: string;
  user_email: string;
}

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects: FC<RecentProjectsProps> = ({ projects }) => {
  const navigate = useNavigate();

  const getStatusDetails = (status: string) => {
    const statusConfig = {
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
      },
      in_progress: {
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
      },
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertCircle,
      },
    };

    return statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      icon: AlertCircle,
    };
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 col-span-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Proyectos Recientes
      </h2>
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => {
            const statusDetails = getStatusDetails(project.project_status);
            return (
              <div
                key={project.project_id}
                className="p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/projects-provider/${project.project_id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {project.project_name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${statusDetails.color}`}
                  >
                    <statusDetails.icon className="h-4 w-4" />
                    {project.project_status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {project.project_description}
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="flex items-center gap-2">
                    Cliente: {project.user_name}
                  </p>
                  <p className="flex items-center gap-2">
                    Email: {project.user_email}
                  </p>
                  <p className="flex items-center gap-2">
                    Creado:{' '}
                    {new Date(project.project_created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 text-center py-4">
            No hay proyectos disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentProjects;