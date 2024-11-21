import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Inicio
            </Link>
            <Link
              to="/projects"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              Proyectos
            </Link>
            {user?.role === "provider" && (
              <Link
                to="/upload"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Subir Archivo
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium">
                  Hola, {user.name}!
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
