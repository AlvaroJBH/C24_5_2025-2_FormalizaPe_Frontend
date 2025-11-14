import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'background.default',
  }}>
    <Navbar />
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: 4,
        flexGrow: 1,
      }}
    >
      {children}
    </Container>
  </Box>
);

export default DashboardLayout;
