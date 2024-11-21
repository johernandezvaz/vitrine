import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Navbar from './components/Navbar';
import ProjectUpdate from './components/Project/ProjectUpdate';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Aquí se incluye el Navbar, que será visible en todas las páginas */}
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Definir las rutas principales */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/projects/update/:id" element={<ProjectUpdate project={{
              id: 0,
              title: '',
              description: '',
              status: ''
            }} onUpdate={function (): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/file-upload" element={<FileUpload projectId={0} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
