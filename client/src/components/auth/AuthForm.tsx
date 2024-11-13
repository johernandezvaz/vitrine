import React, { useState } from 'react';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png" // Cambia la ruta según tu logo
            alt="Logo"
            className="w-16 h-16"
          />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          {isLogin ? 'Sign in' : 'Register'}
        </h2>

        {/* Formulario */}
        <form>
          <div className="mb-4">
            <label className="block text-gray-600">Correo</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Contraseña"
              required
            />
          </div>

          {/* Campo de Confirmación de Contraseña para Registro */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-600">Confirmar Contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Confirmar Contraseña"
                required
              />
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={toggleForm}
            >
              {isLogin ? 'Crea una cuenta' : '¿Ya tienes una cuenta?'}
            </button>
            {isLogin && (
              <a href="#" className="text-gray-500 text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg"
          >
            {isLogin ? 'Sign in' : 'Register'}
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
            <i className="fab fa-facebook-f"></i>
          </button>
          <button className="bg-red-500 text-white p-2 rounded-full">
            <i className="fab fa-google"></i>
          </button>
          <button className="bg-blue-400 text-white p-2 rounded-full">
            <i className="fab fa-twitter"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
