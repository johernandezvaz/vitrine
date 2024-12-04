import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectDocuments from '../../components/Project/ProjectDocuments';
import Sidebar from '../../components/dashboard/Sidebar';

interface Project {
  id: string;  // Changed to string for UUID
  name: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface Contract {
  id: string;  // Changed to string for UUID
  project_id: string;  // Changed to string for UUID
  contract_url: string;
  payment_url: string;
  created_at: string;
}

const ProjectDetailsClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('authToken');

  const fetchProjectDetails = useCallback(async () => {
    if (!token || !id) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los detalles del proyecto');
      }

      const data = await response.json();
      setProject(data);

      // Fetch contract documents
      const documentsResponse = await fetch(`http://localhost:5000/api/projects/${id}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json();
        if (documentsData.length > 0) {
          setContract(documentsData[0]);
        }
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

  console.log(contract);
  console.log(contract);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{project.name}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-500">Estado:</span>
                <span className="ml-2 font-medium">{project.status}</span>
              </div>
              <div>
                <span className="text-gray-500">Fecha de creación:</span>
                <span className="ml-2 font-medium">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {contract ? (
            <div className="bg-white rounded-lg shadow-md p-6">
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
          ) : (
            <ProjectDocuments
              projectId={id}  // Pass the UUID string directly
              onDocumentsUploaded={fetchProjectDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsClient;