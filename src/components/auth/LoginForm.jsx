import React, { useState } from 'react';
import StyledInput from '../common/StyledInput';
import StyledButton from '../common/StyledButton';

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
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
      <StyledButton type="submit">Iniciar Sesión</StyledButton>
    </form>
  );
};

export default LoginForm;
