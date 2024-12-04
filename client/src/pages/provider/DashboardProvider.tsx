import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ProjectStats from '../../components/dashboard/ProjectStats';
import CustomCalendar from '../../components/dashboard/CustomCalendar';
import RecentProjects from '../../components/dashboard/RecentProjects';
import { Users, MessageSquare } from 'lucide-react';

interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  project_status: string;
  project_created_at: string;
  user_name: string;
  user_email: string;
}

interface Stats {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
}

const DashboardProvider = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [today] = useState(new Date());
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    in_progress: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await fetch('http://localhost:5000/api/all-projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los proyectos');
        }

        const data = await response.json();
        const projectsArray = Array.isArray(data) ? data : [];
        setProjects(projectsArray);

        // Calculate stats
        setStats({
          total: projectsArray.length,
          completed: projectsArray.filter(p => p.project_status === 'completed').length,
          in_progress: projectsArray.filter(p => p.project_status === 'in_progress').length,
          pending: projectsArray.filter(p => p.project_status === 'pending').length
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Proyectos',
      description: 'Gestionar Proyectos',
      icon: Users,
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
      onClick: () => navigate('/projects-provider'),
    },
    {
      title: 'Mensajes',
      description: 'Ver mensajes',
      icon: MessageSquare,
      color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      onClick: () => navigate('/messages-provider'),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 p-6 overflow-y-auto">
        <header className="bg-white shadow-lg rounded-xl mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <p className="mt-2 text-gray-600">
            Bienvenido al panel de administración de proyectos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <ProjectStats stats={stats} />
          <CustomCalendar value={today} />
          <RecentProjects projects={projects} />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.onClick}
                className={`p-4 rounded-lg transition-colors ${action.color}`}
              >
                <action.icon className="h-8 w-8 mb-2" />
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm mt-1">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.project_id}
                className="mb-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{project.project_name}</h3>
                    <p className="text-sm text-gray-600">
                      Cliente: {project.user_name}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(project.project_created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Próximas Entregas</h2>
            {projects
              .filter((p) => p.project_status === 'in_progress')
              .slice(0, 5)
              .map((project) => (
                <div
                  key={project.project_id}
                  className="mb-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{project.project_name}</h3>
                      <p className="text-sm text-gray-600">
                        Estado: {project.project_status}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/projects/${project.project_id}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProvider;