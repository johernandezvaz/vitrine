const API_URL = "http://localhost:5000/api";

export type UserResponse = {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: "client" | "provider";
  };
};

export const login = async (data: { email: string; password: string }): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error en el inicio de sesión");
  }

  return response.json();
};

export const register = async (data: { name: string; email: string; password: string; role: "client" | "provider" }): Promise<UserResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error en el registro");
  }

  return response.json();
};

export const logout = (): void => {
  window.location.href = "/login";
};
