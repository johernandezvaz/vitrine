import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarCliente: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token no encontrado en el almacenamiento local.");
        alert("No se encontró token de sesión.");
        return;
      }

      console.log("Token encontrado:", token);

      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("authToken");
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
    <nav className="bg-white h-screen shadow-lg flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-6">
        <Link to="/">
          <div className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded">
            <span className="text-white font-bold text-lg">V</span>
          </div>
        </Link>
      </div>

      {/* Links */}
      <div className="flex flex-col space-y-4 w-full items-center">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-orange-100 group"
        >
          <div className="text-orange-500 group-hover:text-orange-600">
            <i className="fas fa-th-large"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-orange-600">
            Dashboard
          </span>
        </Link>
        <Link
          to="/projects"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-gray-100 group"
        >
          <div className="text-gray-500 group-hover:text-gray-700">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-gray-700">
            Projects
          </span>
        </Link>
        <Link
          to="/tasks"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-gray-100 group"
        >
          <div className="text-gray-500 group-hover:text-gray-700">
            <i className="fas fa-tasks"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-gray-700">
            My Task
          </span>
        </Link>
        <Link
          to="/calendar"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-gray-100 group"
        >
          <div className="text-gray-500 group-hover:text-gray-700">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-gray-700">
            Calendar
          </span>
        </Link>
        <Link
          to="/time-manage"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-gray-100 group"
        >
          <div className="text-gray-500 group-hover:text-gray-700">
            <i className="fas fa-clock"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-gray-700">
            Time Manage
          </span>
        </Link>
        <Link
          to="/reports"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-gray-100 group"
        >
          <div className="text-gray-500 group-hover:text-gray-700">
            <i className="fas fa-chart-bar"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-gray-700">
            Reports
          </span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg hover:bg-gray-100 group"
        >
          <div className="text-gray-500 group-hover:text-gray-700">
            <i className="fas fa-cog"></i>
          </div>
          <span className="text-gray-700 font-medium group-hover:text-gray-700">
            Settings
          </span>
        </Link>
      </div>

      {/* Logout */}
      <div className="mt-auto mb-4 w-full flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 w-4/5 rounded-lg bg-red-500 hover:bg-red-600 text-white"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarCliente;
