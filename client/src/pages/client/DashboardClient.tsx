/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaProjectDiagram,
  FaTasks,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DashboardClient: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [today] = useState(new Date());

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("http://localhost:5000/api/all-projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error("Error al cargar los proyectos");
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Vitrine</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/dashboard-client")}
            >
              <FaHome size={20} />
              <span>Dashboard</span>
            </li>
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/projects-client")}
            >
              <FaProjectDiagram size={20} />
              <span>Proyectos</span>
            </li>
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/tasks")}
            >
              <FaTasks size={20} />
              <span>Tareas</span>
            </li>
            <li
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg"
              onClick={() => navigate("/messages")}
            >
              <FaEnvelope size={20} />
              <span>Mensajes</span>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full flex items-center gap-4 bg-red-600 hover:bg-red-700 p-3 rounded-lg"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="bg-white shadow-md rounded-lg mb-6 p-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Calendar Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Calendario
            </h2>
            <Calendar value={today} />
          </div>

          {/* Projects Card */}
          <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Proyectos
            </h2>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer"
                    onClick={() => navigate(`/projects-client/${project.id}`)}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {project.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No hay proyectos disponibles.</p>
              )}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Progreso
            </h2>
            <p className="text-gray-600">Tareas completadas: 15/30</p>
            <div className="mt-4 w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
