import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ProjectStats from '../../components/dashboard/ProjectStats';
import CustomCalendar from '../../components/dashboard/CustomCalendar';
import RecentProjects from '../../components/dashboard/RecentProjects';

interface Project {
  project_id: number;
  project_name: string;
  project_description: string;
  project_status: string;
  project_created_at: string;
  user_name: string;
  user_email: string;
}

const DashboardClient = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [today] = useState(new Date());

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
        setProjects(Array.isArray(data) ? data : []);
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

  const getProjectStats = () => {
    return {
      total: projects.length,
      completed: projects.filter((p) => p.project_status === 'completed').length,
      in_progress: projects.filter((p) => p.project_status === 'in_progress')
        .length,
      pending: projects.filter((p) => p.project_status === 'pending').length,
    };
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 p-6 overflow-y-auto">
        <header className="bg-white shadow-lg rounded-xl mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <div className="mt-4">
            <button
              onClick={() => navigate('/projects-client/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nuevo Proyecto
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProjectStats stats={getProjectStats()} />
          <CustomCalendar value={today} />
          <RecentProjects projects={projects} />
        </div>

        {/* Quick Actions Section */}
        <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/projects-client')}
              className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <h3 className="font-semibold text-indigo-700">Ver Todos los Proyectos</h3>
              <p className="text-sm text-indigo-600 mt-1">
                Gestiona todos tus proyectos activos
              </p>
            </button>
            <button
              onClick={() => navigate('/messages-client')}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-semibold text-purple-700">Mis Mensajes</h3>
              <p className="text-sm text-purple-600 mt-1">
                Novedades de los proyectos
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;