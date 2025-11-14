import { apiRequest } from './api';

/**
 * Servicio de autenticación - Login
 * @param {object} credentials - { email, password }
 * @returns {Promise} - Datos del usuario autenticado
 */
export const login = async (credentials) => {
  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Guardar token si existe
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    // 🔧 MODO DESARROLLO: Login simulado sin backend
    console.warn('🔧 Backend no disponible, usando login simulado');
    const mockData = {
      token: 'fake-jwt-token-dev-' + Date.now(),
      user: {
        id: 1,
        name: 'Álvaro Begazo',
        email: credentials.email || credentials.identifier,
        dni: '12345678',
        businessName: 'Mi Empresa Demo SAC',
        businessType: 'SAC',
        ruc: '20123456789'
      }
    };
    localStorage.setItem('token', mockData.token);
    localStorage.setItem('user', JSON.stringify(mockData.user));
    return mockData;
  }
};

/**
 * Servicio de autenticación - Registro
 * @param {object} userData - { name, email, password }
 * @returns {Promise} - Confirmación de registro
 */
export const register = async (userData) => {
  try {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  } catch (error) {
    // 🔧 MODO DESARROLLO: Registro simulado
    console.warn('🔧 Backend no disponible, usando registro simulado');
    const mockData = {
      token: 'fake-jwt-token-dev-' + Date.now(),
      user: {
        id: 1,
        name: userData.name,
        email: userData.email,
        dni: userData.dni,
        businessName: userData.name + ' Empresa',
        businessType: 'SAC'
      }
    };
    localStorage.setItem('token', mockData.token);
    localStorage.setItem('user', JSON.stringify(mockData.user));
    return mockData;
  }
};

/**
 * Servicio de autenticación - Logout
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default { login, register, logout };
