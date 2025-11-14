import React, { useState } from 'react';
import StyledInput from '../common/StyledInput';
import StyledButton from '../common/StyledButton';

const SimulatorForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    activityType: '',
    estimatedIncome: '',
    employees: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="simulator-form" onSubmit={handleSubmit}>
      <h3>Datos de tu Negocio</h3>
      
      <label>Nombre del negocio</label>
      <StyledInput 
        name="businessName" 
        value={formData.businessName}
        onChange={handleChange}
        placeholder="Ej: Mi Empresa SAC"
      />
      
      <label>Tipo de actividad</label>
      <StyledInput 
        name="activityType" 
        value={formData.activityType}
        onChange={handleChange}
        placeholder="Ej: Comercio, Servicios, etc."
      />
      
      <label>Ingresos estimados (S/)</label>
      <StyledInput 
        name="estimatedIncome" 
        type="number"
        value={formData.estimatedIncome}
        onChange={handleChange}
        placeholder="Ej: 50000"
      />
      
      <label>Número de empleados</label>
      <StyledInput 
        name="employees" 
        type="number"
        value={formData.employees}
        onChange={handleChange}
        placeholder="Ej: 5"
      />
      
      <StyledButton type="submit">Simular Costos</StyledButton>
    </form>
  );
};

export default SimulatorForm;
