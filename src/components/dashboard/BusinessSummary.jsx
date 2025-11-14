import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { 
  Business as BusinessIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const BusinessSummary = () => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Mi Negocio
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Emprendedor
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Tipo
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Persona Natural
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                RUC
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                No registrado
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            fullWidth
            sx={{ mt: 1 }}
          >
            Generar Documentos
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BusinessSummary;
