import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarCliente: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirigir a la página principal después de cerrar sesión
        navigate("/");
      } else {
        console.error("Error al cerrar sesión:", await response.json());
        alert("Hubo un problema al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión al servidor.");
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-teal-300">
              Vitrine
            </Link>
          </div>

          {/* Links */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/projects"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Proyectos
            </Link>
            <Link
              to="/profile"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Perfil
            </Link>
            <Link
              to="/upload"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Subir Archivos
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarCliente;
