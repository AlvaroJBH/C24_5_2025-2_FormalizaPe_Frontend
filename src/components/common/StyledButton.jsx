import React from 'react';

const StyledButton = ({ children, onClick, type = 'button', className = '' }) => (
  <button type={type} className={`btn ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default StyledButton;
