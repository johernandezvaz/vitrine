/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, register, UserResponse } from "../../api/auth"; // Importa las funciones de autenticación
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const toggleForm = () => {
    navigate(isLogin ? "/register" : "/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response: UserResponse;
      if (isLogin) {
        response = await login({ email, password });
      } else {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }
        response = await register({ name, email, password, role: "client" }); // Rol por defecto: "client"
      }

      // Redirección basada en el rol
      if (response.user.role === "client") {
        navigate("/dashboard-client");
      } else if (response.user.role === "provider") {
        navigate("/dashboard-provider");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/vitrine-logo.png" alt="Logo" className="w-20 h-20" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-600">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-600">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Contraseña"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-600">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Confirmar Contraseña"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={toggleForm}
            >
              {isLogin ? "Crea una cuenta" : "¿Ya tienes una cuenta?"}
            </button>
            {isLogin && (
              <a href="#" className="text-gray-500 text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-noubeau-blue hover:bg-noubeau-blue-800 text-white font-semibold py-2 rounded-lg"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">O inicia sesión con:</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white p-2 rounded-full">
            <FontAwesomeIcon icon={faFacebookF} />
          </button>
          <button className="bg-red-500 text-white p-2 rounded-full">
            <FontAwesomeIcon icon={faGoogle} />
          </button>
          <button className="bg-blue-400 text-white p-2 rounded-full">
            <FontAwesomeIcon icon={faTwitter} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
