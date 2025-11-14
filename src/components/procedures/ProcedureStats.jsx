import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ProcedureStats = () => {
  const stats = [
    { 
      label: 'Completados', 
      value: 1, 
      icon: <CheckCircleIcon fontSize="large" />,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    { 
      label: 'En Proceso', 
      value: 1, 
      icon: <ScheduleIcon fontSize="large" />,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    { 
      label: 'Pendientes', 
      value: 1, 
      icon: <PendingIcon fontSize="large" />,
      color: '#9CA3AF',
      bgColor: '#F3F4F6',
    },
    { 
      label: 'Bloqueados', 
      value: 1, 
      icon: <ErrorIcon fontSize="large" />,
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            sx={{ 
              borderLeft: `4px solid ${stat.color}`,
              backgroundColor: stat.bgColor,
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProcedureStats;
