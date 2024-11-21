import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card for Projects */}
          <div
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => handleNavigation("/projects")}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Proyectos</h2>
            <p className="text-gray-600">Visualiza y administra tus proyectos.</p>
          </div>

          {/* Card for File Upload */}
          <div
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => handleNavigation("/file-upload")}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Subir Archivos</h2>
            <p className="text-gray-600">Carga y gestiona tus archivos aquí.</p>
          </div>

          {/* Additional Feature Card */}
          <div
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
            onClick={() => handleNavigation("/profile")}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Mi Perfil</h2>
            <p className="text-gray-600">Consulta y actualiza tu información personal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
