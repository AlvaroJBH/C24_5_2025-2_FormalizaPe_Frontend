import React, { useState } from 'react';
import StyledInput from '../common/StyledInput';
import StyledButton from '../common/StyledButton';

const RegisterForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <StyledInput 
        name="name" 
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre completo" 
      />
      <StyledInput 
        name="email" 
        value={formData.email}
        onChange={handleChange}
        placeholder="Correo electrónico" 
      />
      <StyledInput 
        name="password" 
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Contraseña" 
      />
      <StyledButton type="submit">Regístrate</StyledButton>
    </form>
  );
};

export default RegisterForm;
