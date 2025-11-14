import { apiRequest } from './api';

// 🔧 RESPUESTAS SIMULADAS del asistente IA
const mockChatResponses = {
  'ruc': 'Para registrar tu RUC necesitas:\n1. DNI o carnet de extranjería\n2. Recibo de servicio (agua, luz o teléfono)\n3. Acudir a una oficina SUNAT o hacerlo online en www.sunat.gob.pe\n\nEl trámite es GRATUITO y demora aproximadamente 1 día.',
  'licencia': 'La Licencia de Funcionamiento se tramita en tu municipalidad local. Requisitos:\n1. RUC activo\n2. Certificado de Defensa Civil\n3. Declaración Jurada\n4. Plano de ubicación\n\nCosto promedio: S/ 350 - S/ 500\nTiempo: 15 días hábiles',
  'regimen': 'Los regímenes tributarios en Perú son:\n\n📊 RUS: Hasta S/ 96,000/año - Cuota fija\n📊 RER: Hasta S/ 525,000/año - 1.5% mensual\n📊 MYPE: Hasta S/ 1,700 UIT - 10% impuesto\n📊 General: Sin límite - 29.5% impuesto\n\n¿Quieres que calculemos cuál te conviene más?',
  'costo': 'Los costos de formalización varían según tu negocio:\n\n✅ RUC: Gratuito\n💰 Licencia: S/ 300 - S/ 500\n💰 Registro Sanitario: S/ 400 - S/ 600\n💰 Marca INDECOPI: S/ 535\n\nTotal aproximado: S/ 1,235 - S/ 1,635',
  'default': '¡Hola! Soy tu asistente de formalización empresarial. Puedo ayudarte con:\n\n• Información sobre trámites (RUC, licencias, registros)\n• Calcular regímenes tributarios\n• Estimar costos y tiempos\n• Recomendaciones personalizadas\n\n¿En qué puedo ayudarte hoy?'
};

const mockRecommendations = [
  {
    id: 1,
    title: 'Completa tu Licencia de Funcionamiento',
    description: 'Estás al 60% de progreso. Solo faltan 2 documentos.',
    priority: 'high',
    action: 'Ver detalles',
    category: 'urgente'
  },
  {
    id: 2,
    title: 'Cambia a régimen RER',
    description: 'Podrías ahorrar S/ 3,500 al año según tus ingresos proyectados.',
    priority: 'medium',
    action: 'Simular ahorro',
    category: 'ahorro'
  },
  {
    id: 3,
    title: 'Registra tu marca ahora',
    description: 'Protege tu marca antes de expandirte. El proceso toma 4 meses.',
    priority: 'medium',
    action: 'Iniciar registro',
    category: 'recomendación'
  }
];

/**
 * Enviar mensaje al chatbot de IA
 * @param {string} message - Mensaje del usuario
 * @returns {Promise} - Respuesta del chatbot
 */
export const chat = async (message) => {
  try {
    return await apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando respuestas simuladas');
    
    // Buscar palabra clave en el mensaje
    const lowerMsg = message.toLowerCase();
    let reply = mockChatResponses.default;
    
    if (lowerMsg.includes('ruc')) reply = mockChatResponses.ruc;
    else if (lowerMsg.includes('licencia')) reply = mockChatResponses.licencia;
    else if (lowerMsg.includes('regimen') || lowerMsg.includes('régimen') || lowerMsg.includes('tributario')) reply = mockChatResponses.regimen;
    else if (lowerMsg.includes('costo') || lowerMsg.includes('precio') || lowerMsg.includes('cuanto')) reply = mockChatResponses.costo;
    
    return {
      response: reply,
      conversationId: 'mock-conversation-' + Date.now()
    };
  }
};

/**
 * Obtener recomendaciones de IA para el usuario
 * @returns {Promise} - Lista de recomendaciones
 */
export const getRecommendations = async () => {
  try {
    return await apiRequest('/api/ai/recommendations');
  } catch (error) {
    console.warn('🔧 Backend no disponible, usando recomendaciones simuladas');
    return mockRecommendations;
  }
};

/**
 * Simular costos de formalización con IA
 * @param {object} businessData - Datos del negocio
 * @returns {Promise} - Simulación de costos
 */
export const simulateCosts = async (businessData) => {
  try {
    return await apiRequest('/api/ai/simulate', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  } catch (error) {
    console.warn('🔧 Backend no disponible, calculando simulación local');
    
    // Cálculo simple de regímenes tributarios
    const income = parseFloat(businessData.monthlyIncome || 0) * 12;
    const expenses = parseFloat(businessData.monthlyExpenses || 0) * 12;
    const netIncome = income - expenses;
    
    return {
      regimens: [
        {
          name: 'RUS',
          applicable: income <= 96000,
          annualTax: income * 0.03,
          monthlyTax: income * 0.03 / 12,
          description: 'Régimen Único Simplificado - Cuota fija mensual'
        },
        {
          name: 'RER',
          applicable: income <= 525000,
          annualTax: income * 0.015 * 12,
          monthlyTax: income * 0.015,
          description: 'Régimen Especial de Renta'
        },
        {
          name: 'MYPE',
          applicable: income <= 1700 * 4950,
          annualTax: netIncome * 0.10,
          monthlyTax: netIncome * 0.10 / 12,
          description: 'Régimen MYPE Tributario'
        },
        {
          name: 'General',
          applicable: true,
          annualTax: netIncome * 0.295,
          monthlyTax: netIncome * 0.295 / 12,
          description: 'Régimen General'
        }
      ],
      recommendation: income <= 96000 ? 'RUS' : income <= 525000 ? 'RER' : 'MYPE',
      estimatedSavings: Math.abs((netIncome * 0.295) - (income * 0.015 * 12))
    };
  }
};

export default { 
  chat, 
  getRecommendations, 
  simulateCosts 
};
