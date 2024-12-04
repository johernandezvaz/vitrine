import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}

      {/* Hero Section */}
      <header className="bg-white shadow-md py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Bienvenido a Vitrine
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gestiona proyectos y comparte archivos de manera sencilla y segura.
          </p>
          <div className="mt-6">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 mr-4"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
            <button
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            ¿Por qué usar Vitrine?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Gestión Centralizada
              </h3>
              <p className="text-gray-600">
                Maneja todos tus proyectos y archivos en un solo lugar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Seguridad
              </h3>
              <p className="text-gray-600">
                Tus datos y archivos están protegidos con las últimas tecnologías.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Colaboración
              </h3>
              <p className="text-gray-600">
                Comparte y trabaja con otros de forma eficiente y organizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-300">
          <p>© 2024 Vitrine. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
