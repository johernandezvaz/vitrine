import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import DashboardClient from './pages/client/DashboardClient';
import MessagesClient from './pages/client/MessagesClient';
import ProjectDetailsClient from './pages/client/ProjectDetailsClient';
import ProjectsClient from './pages/client/ProjectsClient';
import ProjectUpdate from './components/Project/ProjectUpdate';
import FileUpload from './components/FileUpload';
import { AuthProvider } from './context/AuthContext';
import DashboardProvider from './pages/provider/DashboardProvider';
import ProjectsProvider from './pages/provider/ProjectsProvider';
import ProjectDetailsProvider from './pages/provider/ProjectsDetailsProvider';
import MessagesProvider from './pages/provider/MessagesProvider';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';




const App: React.FC = () => {
  return (
    <Router>
      {/* Mover Router aquí */}
      <AuthProvider>
        {/* AuthProvider envuelto por el Router */}
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Definir las rutas principales */}
            <Route path="/" element={<AuthForm />} />
            <Route path="/dashboard-client" element={<DashboardClient />} />
            <Route path="/projects-client" element={<ProjectsClient />} />
            <Route path="/projects-provider" element={<ProjectsProvider />} />
            <Route path="/dashboard-provider" element={<DashboardProvider />} />
            <Route path="/projects/:id" element={<ProjectDetailsClient />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/projects/update/:id"
              element={
                <ProjectUpdate
                  project={{
                    id: 0,
                    title: '',
                    description: '',
                    status: '',
                  }}
                  onUpdate={() => {
                    throw new Error('Function not implemented.');
                  }}
                />
              }
            />
            <Route path="/messages-client" element={<MessagesClient />} />
            <Route path="/messages-provider" element={<MessagesProvider />} />
            <Route path="projects-provider/:id" element={<ProjectDetailsProvider />} />
            <Route path="/file-upload" element={<FileUpload projectId={0} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
