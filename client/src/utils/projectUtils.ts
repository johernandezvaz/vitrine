import { Project, ProjectStats, ProjectStatus, StatusConfig } from '../types/project';

export const calculateProjectStats = (projects: Project[]): ProjectStats => {
  return {
    total: projects.length,
    completed: projects.filter(p => p.project_status === 'completed').length,
    in_progress: projects.filter(p => p.project_status === 'in_progress').length,
    pending: projects.filter(p => p.project_status === 'pending').length,
  };
};

export const getStatusConfig = (status: ProjectStatus): StatusConfig => {
  const configs: Record<ProjectStatus, StatusConfig> = {
    completed: {
      color: 'bg-green-100 text-green-800'
    },
    in_progress: {
      color: 'bg-blue-100 text-blue-800'
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800'
    },
  };

  return configs[status] || { color: 'bg-gray-100 text-gray-800' };
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};