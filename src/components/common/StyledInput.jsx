import React from 'react';

const StyledInput = ({ value, onChange, placeholder, type = 'text', name }) => (
  <input
    className="styled-input"
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
);

export default StyledInput;
