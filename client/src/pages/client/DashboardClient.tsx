import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarCliente from "./NavbarCliente";

const DashboardClient: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
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
          console.error("Error al cargar los proyectos:", await response.json());
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <NavbarCliente />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Task Progress */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Progreso de Tareas
              </h2>
              <p className="text-sm text-gray-500">Tareas completadas: 10/20</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* My Tasks */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Mis Tareas
              </h2>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{task.name}</span>
                    <span
                      className={`${
                        task.completed ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {task.completed ? "✔️" : "❌"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendar */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Calendario
              </h2>
              <div>
                <p className="text-sm text-gray-500">Febrero 2020</p>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mt-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div
                      key={day}
                      className="text-center font-medium text-gray-700"
                    >
                      {day}
                    </div>
                  ))}
                  {Array(28)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        className={`text-center text-sm ${
                          index === 4
                            ? "bg-orange-500 text-white rounded-full"
                            : "text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-6 bg-white rounded-lg shadow-md col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Mensajes
              </h2>
              <ul className="space-y-2">
                {messages.map((msg) => (
                  <li key={msg.id} className="flex items-center space-x-4">
                    <img
                      src={msg.avatar}
                      alt={msg.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {msg.name}
                      </p>
                      <p className="text-sm text-gray-500">{msg.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardClient;
