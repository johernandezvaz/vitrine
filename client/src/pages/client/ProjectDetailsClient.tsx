import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ProjectDetails from '../../components/Project/ProjectDetails';
import ProjectDocuments from '../../components/Project/ProjectDocuments';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
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

const ProjectDetailsClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('authToken');

  const fetchProjectDetails = useCallback(async () => {
    if (!token || !id) return;

    try {
      const [projectRes, documentsRes, updatesRes] = await Promise.all([
        fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/projects/${id}/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/projects/${id}/updates`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projectRes.ok) throw new Error('Error al cargar los detalles del proyecto');

      const projectData = await projectRes.ok ? await projectRes.json() : null;
      const contractData = await documentsRes.ok ? await documentsRes.json() : null;
      const updatesData = await updatesRes.ok ? await updatesRes.json() : [];

      setProject(projectData);
      setContract(contractData);
      setUpdates(updatesData);
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

  const handleDocumentsUploaded = () => {
    fetchProjectDetails();
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
          <ProjectDetails
            project={project}
            contract={contract || undefined}
            updates={updates}
          />
          
          {!contract && (
            <div className="mt-6">
              <ProjectDocuments
                projectId={project.id}
                onDocumentsUploaded={handleDocumentsUploaded}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsClient;