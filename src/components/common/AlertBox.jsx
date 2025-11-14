import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const AlertBox = ({ children, type = 'info', title }) => {
  return (
    <Alert 
      severity={type}
      sx={{ 
        borderRadius: 2,
        mb: 2,
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </Alert>
  );
};

export default AlertBox;
