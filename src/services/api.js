// Archivo central de API con configuración base
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

/**
 * Función genérica para hacer peticiones a la API
 * @param {string} path - Ruta del endpoint (ej: '/api/auth/login')
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise} - Respuesta de la API en formato JSON
 */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${path}`, config);
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || `Error ${res.status}`);
  }
  
  return res.json();
}

export default apiRequest;
