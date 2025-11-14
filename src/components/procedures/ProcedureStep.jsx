import React from 'react';
import { Card, CardContent, Typography, Box, Button, LinearProgress, Chip } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ProcedureStep = ({ 
  title, 
  description, 
  entity,
  cost,
  time,
  progress = 0,
  status = 'pending' 
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { 
          icon: <CheckCircleIcon />, 
          color: 'success',
          label: 'Completado',
          borderColor: '#10B981',
        };
      case 'in-progress':
        return { 
          icon: <ScheduleIcon />, 
          color: 'info',
          label: 'En Proceso',
          borderColor: '#3B82F6',
        };
      case 'pending':
        return { 
          icon: <PendingIcon />, 
          color: 'default',
          label: 'Pendiente',
          borderColor: '#9CA3AF',
        };
      case 'blocked':
        return { 
          icon: <ErrorIcon />, 
          color: 'error',
          label: 'Bloqueado',
          borderColor: '#EF4444',
        };
      default:
        return { 
          icon: <PendingIcon />, 
          color: 'default',
          label: 'Pendiente',
          borderColor: '#9CA3AF',
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card sx={{ 
      borderLeft: `4px solid ${statusConfig.borderColor}`,
      mb: 2,
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: `${statusConfig.color}.main` }}>
              {statusConfig.icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          <Chip 
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          {entity && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Entidad
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {entity}
              </Typography>
            </Box>
          )}
          
          {cost && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Costo
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {cost}
              </Typography>
            </Box>
          )}
          
          {time && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tiempo
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {time}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Progreso
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            color={statusConfig.color}
            sx={{ height: 8, borderRadius: 1 }}
          />
        </Box>

        <Button variant="outlined" size="small">
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcedureStep;
