import { FC } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Stats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

interface ProjectStatsProps {
  stats: Stats;
}

const ProjectStats: FC<ProjectStatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Total Proyectos', value: stats.total, color: 'text-gray-600' },
    { label: 'Completados', value: stats.completed, color: 'text-green-600', icon: CheckCircle },
    { label: 'En Progreso', value: stats.in_progress, color: 'text-blue-600', icon: Clock },
    { label: 'Pendientes', value: stats.pending, color: 'text-yellow-600', icon: AlertCircle },
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Estadísticas</h2>
      <div className="space-y-4">
        {statItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className={`h-5 w-5 ${item.color}`} />}
              <span className={item.color}>{item.label}:</span>
            </div>
            <span className={`font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;