import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

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
          {user && (
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
          )}

          {/* User Actions */}
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
