import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

/**
 * Hook genérico para hacer llamadas a la API
 * @param {string} endpoint - El endpoint de la API (ej: '/api/procedures')
 * @param {object} options - Opciones adicionales para fetch
 */
const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
