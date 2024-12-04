import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
  user_name: string;
  user_email: string;
}

interface Contract {
  id: string;
  project_id: string;
  contract_url: string;
  payment_url: string;
  created_at: string;
}

interface Update {
  id: string;
  project_id: string;
  update: string;
  created_at: string;
}

const ProjectDetailsProvider: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('authToken');

  const fetchProjectDetails = useCallback(async () => {
    if (!token || !id) return;

    try {
      // Fetch project details
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los detalles del proyecto');
      }

      const projectData = await response.json();
      setProject(projectData);

      // Fetch contract documents
      const documentsResponse = await fetch(`http://localhost:5000/api/projects/${id}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json();
        setContract(documentsData);
      }

      // Fetch project updates
      const updatesResponse = await fetch(`http://localhost:5000/api/projects/${id}/updates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatesResponse.ok) {
        const updatesData = await updatesResponse.json();
        setUpdates(updatesData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleStatusChange = async (newStatus: Project['status']) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del proyecto');
      }

      await fetchProjectDetails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ update: newUpdate }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar la actualización');
      }

      setNewUpdate('');
      await fetchProjectDetails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar la actualización');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">{error || 'Proyecto no encontrado'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                <p className="text-gray-500">Cliente: {project.user_name}</p>
                <p className="text-gray-500">Email: {project.user_email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange('pending')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    project.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <AlertCircle className="h-5 w-5" />
                  Pendiente
                </button>
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    project.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  En Progreso
                </button>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                  Completado
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <p className="text-sm text-gray-500">
              Creado el: {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Documents Section */}
          {contract && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Documentos del Proyecto</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Contrato Firmado:</h3>
                  <a
                    href={contract.contract_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver Contrato
                  </a>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Comprobante de Pago:</h3>
                  <a
                    href={contract.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver Comprobante
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Updates Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Actualizaciones del Proyecto</h2>
            
            {/* Add Update Form */}
            <form onSubmit={handleAddUpdate} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  placeholder="Agregar una actualización..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newUpdate.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Enviar
                </button>
              </div>
            </form>

            {/* Updates List */}
            <div className="space-y-4">
              {updates.length > 0 ? (
                updates.map((update) => (
                  <div
                    key={update.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-700">{update.update}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(update.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No hay actualizaciones disponibles.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsProvider;