import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthForm from './components/auth/AuthForm';
import DashboardClient from './pages/DashboardClient';
// import DashboardProvider from './pages/DashboardProvider';
import ProjectDetails from './pages/ProjectDetails';
import Navbar from './components/Navbar';
import ProjectUpdate from './components/Project/ProjectUpdate';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  return (
    <Router>
      {/* Mover Router aquí */}
      <AuthProvider>
        {/* AuthProvider envuelto por el Router */}
        <Navbar /> {/* Navbar sigue siendo visible en todas las páginas */}
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Definir las rutas principales */}
            <Route path="/" element={<AuthForm />} />
            <Route path="/dashboard-client" element={<DashboardClient />} />
            {/* <Route path="/dashboard-provider" element={<DashboardProvider />} /> */}
            <Route path="/projects/:id" element={<ProjectDetails />} />
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
            <Route path="/file-upload" element={<FileUpload projectId={0} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
