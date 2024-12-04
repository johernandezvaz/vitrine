import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { MessageSquare, FileText, CreditCard, ExternalLink } from 'lucide-react';

interface Message {
  id: string;
  project_id: string;
  content: string;
  type: 'contract' | 'payment' | 'update';
  created_at: string;
  project: {
    name: string;
  };
  urls?: {
    contract_url?: string;
    payment_url?: string;
  };
}

const MessagesClient: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los mensajes');
        }

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-6 w-6 text-green-500" />;
      default:
        return <MessageSquare className="h-6 w-6 text-gray-500" />;
    }
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Mensajes</h1>
            <p className="text-gray-600 mt-2">
              Aquí encontrarás actualizaciones sobre tus proyectos, enlaces de pago y contratos.
            </p>
          </header>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {message.project.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{message.content}</p>
                      {message.urls && (
                        <div className="mt-4 space-y-2">
                          {message.urls.contract_url && (
                            <a
                              href={message.urls.contract_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                              <FileText className="h-4 w-4" />
                              Ver Contrato
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {message.urls.payment_url && (
                            <a
                              href={message.urls.payment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-green-600 hover:text-green-700"
                            >
                              <CreditCard className="h-4 w-4" />
                              Ver Comprobante de Pago
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay mensajes disponibles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesClient;