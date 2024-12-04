/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, register } from "../../api/auth";
import { Mail, Lock, User } from 'lucide-react';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isLogin) {
        const response = await login({ email, password });
        if (!response.access_token) {
          throw new Error("Respuesta inesperada del servidor");
        }

        localStorage.setItem("authToken", response.access_token);
        const userPayload = JSON.parse(atob(response.access_token.split(".")[1]));
        navigate(userPayload.identity.role === "client" ? "/dashboard-client" : "/dashboard-provider");
      } else {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          return;
        }
        
        await register({ name, email, password, role: "client" });
        setSuccessMessage("Registro exitoso. Por favor, inicie sesión.");
        setIsLogin(true);
        clearForm();
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };


 


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <img src="/vitrine-logo.png" alt="Logo" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-600 mb-1">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-600 mb-1">Correo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-600 mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirmar Contraseña"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Crear una cuenta" : "¿Ya tienes una cuenta?"}
            </button>
            {isLogin && (
              <Link to="/forgot-password" className="text-gray-500 text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

       

        
      </div>
    </div>
  );
};

export default AuthForm;