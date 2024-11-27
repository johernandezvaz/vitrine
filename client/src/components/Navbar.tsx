import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
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
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Perfil
                </Link>
                {user.role === "provider" && (
                  <Link
                    to="/upload"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Subir Archivos
                  </Link>
                )}
              </>
            ) : (
              <a
                href="https://www.noubeau.com/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
              >
                Página Principal
              </a>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium">Hola, {user.name}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-noubeau-blue hover:bg-noubeau-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
