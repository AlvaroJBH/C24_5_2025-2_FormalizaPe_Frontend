import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';

const ProgressOverview = () => {
  const procedures = [
    { name: 'Constitución SUNARP', progress: 100, status: 'completed' },
    { name: 'Registro RUC', progress: 65, status: 'in-progress' },
    { name: 'Licencia Municipal', progress: 0, status: 'pending' },
    { name: 'Registro ESSALUD', progress: 0, status: 'pending' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success.main';
      case 'in-progress': return 'info.main';
      case 'pending': return 'text.disabled';
      default: return 'text.disabled';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'in-progress': return <ScheduleIcon sx={{ color: 'info.main' }} />;
      case 'pending': return <PendingIcon sx={{ color: 'text.disabled' }} />;
      default: return null;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Progreso de Trámites
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Estado actual de tus procesos de formalización
        </Typography>

        {procedures.map((proc, index) => (
          <Box key={index} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStatusIcon(proc.status)}
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {proc.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {proc.progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={proc.progress}
              sx={{ 
                height: 8, 
                borderRadius: 1,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(proc.status),
                },
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProgressOverview;
