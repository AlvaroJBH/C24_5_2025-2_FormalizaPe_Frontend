import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Calculate as CalculateIcon,
  Chat as ChatIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';

const QuickAccess = () => {
  const quickLinks = [
    { 
      title: 'Simulador Tributario', 
      icon: <CalculateIcon fontSize="large" />, 
      path: '/dashboard/simulator',
      color: '#3563E9',
    },
    { 
      title: 'Asistente IA', 
      icon: <ChatIcon fontSize="large" />, 
      path: '/dashboard/assistant',
      color: '#10B981',
    },
    { 
      title: 'Gestionar Trámites', 
      icon: <AssignmentIcon fontSize="large" />, 
      path: '/dashboard/procedures',
      color: '#8B5CF6',
    },
    { 
      title: 'Reportes', 
      icon: <BarChartIcon fontSize="large" />, 
      path: '/dashboard/reports',
      color: '#F59E0B',
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Accesos Rápidos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Herramientas principales para gestionar tu negocio
      </Typography>

      <Grid container spacing={2}>
        {quickLinks.map((link, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              component={Link}
              to={link.path}
              sx={{ 
                textDecoration: 'none',
                height: '100%',
                transition: 'all 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3,
              }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: `${link.color}15`,
                    color: link.color,
                    mb: 1,
                  }}
                >
                  {link.icon}
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                >
                  {link.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickAccess;
