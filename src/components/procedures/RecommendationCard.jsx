import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const RecommendationCard = ({ level = 'importante', title, text, action }) => {
  const getLevelConfig = (level) => {
    switch (level.toLowerCase()) {
      case 'urgente':
        return {
          icon: <ErrorIcon />,
          color: '#EF4444',
          bgColor: '#FEE2E2',
          textColor: '#991B1B',
          label: 'Urgente',
        };
      case 'importante':
        return {
          icon: <WarningIcon />,
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          textColor: '#92400E',
          label: 'Importante',
        };
      case 'sugerencia':
        return {
          icon: <InfoIcon />,
          color: '#3B82F6',
          bgColor: '#DBEAFE',
          textColor: '#1E40AF',
          label: 'Sugerencia',
        };
      case 'bien hecho':
        return {
          icon: <CheckCircleIcon />,
          color: '#10B981',
          bgColor: '#D1FAE5',
          textColor: '#065F46',
          label: '¡Bien hecho!',
        };
      default:
        return {
          icon: <InfoIcon />,
          color: '#3B82F6',
          bgColor: '#DBEAFE',
          textColor: '#1E40AF',
          label: 'Info',
        };
    }
  };

  const config = getLevelConfig(level);

  return (
    <Card 
      sx={{ 
        borderLeft: `4px solid ${config.color}`,
        backgroundColor: config.bgColor,
        mb: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box sx={{ color: config.color, mt: 0.5 }}>
            {config.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ fontWeight: 600, color: config.textColor }}
              >
                {title || config.label}
              </Typography>
              <Chip 
                label={config.label}
                size="small"
                sx={{ 
                  backgroundColor: config.color,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
            <Typography 
              variant="body2" 
              sx={{ color: config.textColor, mb: action ? 2 : 0 }}
            >
              {text}
            </Typography>
            {action && (
              <Button 
                variant="text" 
                size="small"
                sx={{ 
                  color: config.textColor,
                  fontWeight: 600,
                  textTransform: 'none',
                  p: 0,
                }}
              >
                {action}
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
