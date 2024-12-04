import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { MessageSquare, Send, FileText, CreditCard } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  project: {
    name: string;
    user_name: string;
  };
}

interface Project {
  id: string;
  name: string;
  user_name: string;
}

const MessagesProvider: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [messageType, setMessageType] = useState<'update' | 'contract' | 'payment'>('update');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      try {
        // Fetch messages
        const messagesResponse = await fetch('http://localhost:5000/api/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!messagesResponse.ok) {
          throw new Error('Error al cargar los mensajes');
        }

        const messagesData = await messagesResponse.json();
        setMessages(messagesData);

        // Fetch projects
        const projectsResponse = await fetch('http://localhost:5000/api/all-projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!projectsResponse.ok) {
          throw new Error('Error al cargar los proyectos');
        }

        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (!token || !messageContent || !selectedProject) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: selectedProject,
          content: messageContent,
          type: messageType,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      // Reset form
      setMessageContent('');
      setSelectedProject('');

      // Refresh messages
      const messagesResponse = await fetch('http://localhost:5000/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
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
              Envía mensajes a los clientes sobre sus proyectos
            </p>
          </header>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* New Message Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Nuevo Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyecto
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione un proyecto</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.project_id}>
                      {project.project_name} - {project.user_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Mensaje
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="update"
                      checked={messageType === 'update'}
                      onChange={(e) => setMessageType(e.target.value as 'update')}
                      className="mr-2"
                    />
                    <MessageSquare className="h-5 w-5 mr-1" />
                    Actualización
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="contract"
                      checked={messageType === 'contract'}
                      onChange={(e) => setMessageType(e.target.value as 'contract')}
                      className="mr-2"
                    />
                    <FileText className="h-5 w-5 mr-1" />
                    Contrato
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="payment"
                      checked={messageType === 'payment'}
                      onChange={(e) => setMessageType(e.target.value as 'payment')}
                      className="mr-2"
                    />
                    <CreditCard className="h-5 w-5 mr-1" />
                    Pago
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Escriba su mensaje aquí..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {message.project.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Cliente: {message.project.user_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Enviado el: {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{message.content}</p>
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

export default MessagesProvider;