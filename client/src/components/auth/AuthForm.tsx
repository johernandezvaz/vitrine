/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, UserResponse } from "../../api/auth"; 

const AuthForm: React.FC = () => {
  const navigate = useNavigate();

  // Estado para alternar entre login y register
  const [isLogin, setIsLogin] = useState(true);

  // Estados de los campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(""); // Limpia los errores al cambiar de formulario
    setSuccessMessage(""); // Limpia los mensajes de éxito
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response: UserResponse;
      if (isLogin) {
        response = await login({ email, password });

        if (!response.access_token) {
          throw new Error("Respuesta inesperada del servidor");
        }

        // Store token and redirect for login
        localStorage.setItem("authToken", response.access_token);
        const userPayload = JSON.parse(atob(response.access_token.split(".")[1]));
        
        // Redirect based on role
        if (userPayload.identity.role === "client") {
          navigate("/dashboard-client");
        } else if (userPayload.identity.role === "provider") {
          navigate("/dashboard-provider");
        }
      } else {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }
        
        // Register new user
        await register({ name, email, password, role: "client" });
        
        // Show success message and switch to login form
        setSuccessMessage("Registro exitoso. Por favor, inicie sesión.");
        setIsLogin(true);
        
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default AuthForm;