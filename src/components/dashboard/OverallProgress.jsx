import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const OverallProgress = () => {
  const stats = {
    completed: 1,
    total: 4,
    percentage: 41,
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Resumen
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Trámites completados
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {stats.completed}/{stats.total}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progreso total
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {stats.percentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={stats.percentage}
            sx={{ 
              height: 10, 
              borderRadius: 1,
            }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Régimen actual
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Por definir
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OverallProgress;
