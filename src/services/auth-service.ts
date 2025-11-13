const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RegisterData {
  username: string;
  email: string;
  password: string;
  dni: string;
  ruc: string;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Error al iniciar sesión");
  }

  const data = await res.json();
  return data.token as string;
}

export async function register(data: RegisterData) {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear cuenta");
  }

  const response = await res.json();
  return response.token as string;
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener usuario");
  }

  return await res.json();
}
