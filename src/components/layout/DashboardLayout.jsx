import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'background.default',
    m: 0,
    p: 0,
  }}>
    <Navbar />
    <Box 
      sx={{ 
        py: 2.5,
        px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 8 },
        flexGrow: 1,
        maxWidth: '1600px',
        width: '100%',
        mx: 'auto',
      }}
    >
      {children}
    </Box>
  </Box>
);

export default DashboardLayout;
