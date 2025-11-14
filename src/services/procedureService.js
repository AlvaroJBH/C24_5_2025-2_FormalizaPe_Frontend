import { apiRequest } from './api';

// 🔧 DATOS SIMULADOS para desarrollo sin backend
const mockProcedures = [
  {
    id: 1,
    name: 'Registro Único de Contribuyentes (RUC)',
    entity: 'SUNAT',
    status: 'completed',
    progress: 100,
    estimatedCost: 0,
    estimatedTime: '1 día',
    deadline: '2025-01-15',
    description: 'Inscripción en el RUC para poder emitir comprobantes',
    requirements: ['DNI', 'Recibo de agua o luz'],
    completedDate: '2025-01-10'
  },
  {
    id: 2,
    name: 'Licencia de Funcionamiento',
    entity: 'Municipalidad',
    status: 'in-progress',
    progress: 60,
    estimatedCost: 350,
    estimatedTime: '15 días',
    deadline: '2025-02-01',
    description: 'Autorización para operar tu negocio',
    requirements: ['RUC', 'Certificado de Defensa Civil', 'Plano de ubicación'],
    currentStep: 'Revisión de documentos'
  },
  {
    id: 3,
    name: 'Registro Sanitario',
    entity: 'DIGESA',
    status: 'pending',
    progress: 0,
    estimatedCost: 500,
    estimatedTime: '30 días',
    deadline: '2025-03-01',
    description: 'Registro sanitario para productos alimenticios',
    requirements: ['Licencia de funcionamiento', 'Análisis de laboratorio']
  },
  {
    id: 4,
    name: 'Registro de Marca',
    entity: 'INDECOPI',
    status: 'pending',
    progress: 0,
    estimatedCost: 534.99,
    estimatedTime: '120 días',
    deadline: '2025-05-15',
    description: 'Protección legal de tu marca comercial',
    requirements: ['Logo en formato digital', 'Clasificación de Niza']
  },
  {
    id: 5,
    name: 'Planilla Electrónica',
    entity: 'SUNAT',
    status: 'blocked',
    progress: 0,
    estimatedCost: 0,
    estimatedTime: '1 día',
    deadline: '2025-02-20',
    description: 'Registro de trabajadores en planilla',
    requirements: ['RUC activo', 'Datos de trabajadores'],
    blockReason: 'Requiere RUC completado'
  }
];

/**
 * Obtener todos los trámites/procedimientos de formalización
 * @returns {Promise} - Lista de trámites
 */
export const fetchProcedures = async () => {
  try {
    return await apiRequest('/api/formalization');
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando procedimientos simulados');
    return mockProcedures;
  }
};

/**
 * Obtener un trámite específico por ID
 * @param {string} id - ID del trámite
 * @returns {Promise} - Detalle del trámite
 */
export const fetchProcedureById = async (id) => {
  try {
    return await apiRequest(`/api/formalization/${id}`);
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando procedimiento simulado');
    return mockProcedures.find(p => p.id === parseInt(id)) || mockProcedures[0];
  }
};

/**
 * Crear un nuevo trámite
 * @param {object} procedureData - Datos del trámite
 * @returns {Promise} - Trámite creado
 */
export const createProcedure = async (procedureData) => {
  try {
    return await apiRequest('/api/formalization', {
      method: 'POST',
      body: JSON.stringify(procedureData),
    });
  } catch (error) {
    console.warn('🔧 Backend no disponible, simulando creación');
    return { ...procedureData, id: Date.now(), status: 'pending', progress: 0 };
  }
};

/**
 * Actualizar estado de un trámite
 * @param {string} id - ID del trámite
 * @param {object} updates - Datos a actualizar
 * @returns {Promise} - Trámite actualizado
 */
export const updateProcedure = async (id, updates) => {
  try {
    return await apiRequest(`/api/formalization/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  } catch (error) {
    console.warn('🔧 Backend no disponible, simulando actualización');
    return { ...updates, id };
  }
};

export default { 
  fetchProcedures, 
  fetchProcedureById, 
  createProcedure, 
  updateProcedure 
};
