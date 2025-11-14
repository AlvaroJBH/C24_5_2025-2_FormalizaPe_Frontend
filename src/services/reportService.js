import { apiRequest } from './api';

// 🔧 DATOS SIMULADOS para reportes
const mockReportData = {
  costs: {
    totalCost: 1384.99,
    completedCost: 350,
    pendingCost: 1034.99,
    breakdown: [
      { category: 'Licencias', amount: 350, percentage: 25.2 },
      { category: 'Registros', amount: 534.99, percentage: 38.5 },
      { category: 'Certificaciones', amount: 500, percentage: 36.3 }
    ]
  },
  regimenComparison: {
    current: 'RER',
    comparison: [
      { regime: 'RUS', annualCost: 6000, taxRate: '1.5% - 5%', limit: 96000 },
      { regime: 'RER', annualCost: 9000, taxRate: '1.5%', limit: 525000 },
      { regime: 'MYPE', annualCost: 15000, taxRate: '10%', limit: 1700000 },
      { regime: 'General', annualCost: 22500, taxRate: '29.5%', limit: 'Sin límite' }
    ]
  },
  proceduresReport: {
    total: 5,
    completed: 1,
    inProgress: 1,
    pending: 2,
    blocked: 1,
    completionRate: 20
  },
  userStats: {
    totalProcedures: 5,
    daysActive: 35,
    estimatedCompletion: '2025-05-15',
    efficiency: 75
  }
};

/**
 * Obtener datos de costos de formalización
 * @returns {Promise} - Datos de costos
 */
export const fetchReportCosts = async () => {
  try {
    return await apiRequest('/api/reports/costs');
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando datos simulados de costos');
    return mockReportData.costs;
  }
};

/**
 * Obtener comparación de regímenes tributarios
 * @returns {Promise} - Datos de comparación
 */
export const fetchRegimenComparison = async () => {
  try {
    return await apiRequest('/api/reports/regimen');
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando comparación simulada');
    return mockReportData.regimenComparison;
  }
};

/**
 * Obtener reporte general de trámites
 * @returns {Promise} - Reporte de trámites
 */
export const fetchProceduresReport = async () => {
  try {
    return await apiRequest('/api/reports/procedures');
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando reporte simulado');
    return mockReportData.proceduresReport;
  }
};

/**
 * Obtener estadísticas del usuario
 * @returns {Promise} - Estadísticas
 */
export const fetchUserStats = async () => {
  try {
    return await apiRequest('/api/reports/stats');
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando estadísticas simuladas');
    return mockReportData.userStats;
  }
};

export default { 
  fetchReportCosts, 
  fetchRegimenComparison, 
  fetchProceduresReport,
  fetchUserStats 
};
