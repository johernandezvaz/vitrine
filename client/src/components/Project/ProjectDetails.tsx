import React from 'react';
import { Clock, FileText } from 'lucide-react';

interface ProjectDetailsProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
    user_name?: string;
    user_email?: string;
  };
  contract?: {
    contract_url: string;
    payment_url: string;
  };
  updates: Array<{
    id: string;
    update: string;
    created_at: string;
  }>;
  isProvider?: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  contract,
  updates,
  isProvider = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h1>
        {isProvider && (
          <div className="mb-2">
            <p className="text-gray-600">Cliente: {project.user_name}</p>
            <p className="text-gray-600">Email: {project.user_email}</p>
          </div>
        )}
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Estado:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'completed' 
              ? 'bg-green-100 text-green-800'
              : project.status === 'in_progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {project.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Creado el: {new Date(project.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Documents Section */}
      {contract && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Documentos del Proyecto</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Contrato Firmado:</h3>
              <a
                href={contract.contract_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Ver Contrato
              </a>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Comprobante de Pago:</h3>
              <a
                href={contract.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Ver Comprobante
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Updates Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Actualizaciones del Proyecto</h2>
        <div className="space-y-4">
          {updates.length > 0 ? (
            updates.map((update) => (
              <div
                key={update.id}
                className="p-4 bg-gray-50 rounded-lg flex items-start gap-3"
              >
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-700">{update.update}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>
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
  );
};

export default ProjectDetails;