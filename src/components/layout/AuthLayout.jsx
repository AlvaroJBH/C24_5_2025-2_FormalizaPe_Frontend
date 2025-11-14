import React from 'react';
import { Box, Card, CardContent, Avatar } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const AuthLayout = ({ children }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'background.default',
    padding: 2,
  }}>
    <Card 
      elevation={3}
      sx={{ 
        maxWidth: 500, 
        width: '100%',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Logo centrado */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3 
        }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 64, 
              height: 64 
            }}
          >
            <BusinessCenterIcon fontSize="large" />
          </Avatar>
        </Box>
        {children}
      </CardContent>
    </Card>
  </Box>
);

export default AuthLayout;
