import React from 'react';
import { Card, CardContent, Typography, Box, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Lightbulb as LightbulbIcon,
  Chat as ChatIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  HowToReg as HowToRegIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AiRecommendations = () => {
  const recommendations = [
    {
      text: 'Considera cambiar al Régimen MYPE para ahorrar en impuestos',
      icon: <TrendingUpIcon sx={{ color: 'success.main' }} />,
    },
    {
      text: 'Completa tu licencia municipal para operar legalmente',
      icon: <HowToRegIcon sx={{ color: 'warning.main' }} />,
    },
    {
      text: 'Registra a tus empleados en ESSALUD antes del 30 de octubre',
      icon: <ScheduleIcon sx={{ color: 'error.main' }} />,
    },
  ];

  return (
    <Card>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <LightbulbIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recomendaciones IA
          </Typography>
        </Box>

        <List sx={{ py: 0 }}>
          {recommendations.map((rec, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {rec.icon}
              </ListItemIcon>
              <ListItemText 
                primary={rec.text}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { color: 'text.secondary' },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          component={Link}
          to="/dashboard/assistant"
          variant="contained"
          fullWidth
          size="small"
          startIcon={<ChatIcon />}
          sx={{ mt: 1.5 }}
        >
          Chatear con IA
        </Button>
      </CardContent>
    </Card>
  );
};

export default AiRecommendations;
