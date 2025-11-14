import React from 'react';
import { Typography, Box, Button, LinearProgress, Card, CardContent, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProcedureStep from '../../components/procedures/ProcedureStep';
import RecommendationCard from '../../components/procedures/RecommendationCard';
import ProcedureStats from '../../components/procedures/ProcedureStats';

const ProceduresPage = () => {
  const procedures = [
    {
      title: 'Constitución de Empresa (SUNARP)',
      description: 'Registro de constitución de sociedad en los Registros Públicos',
      entity: 'SUNARP',
      cost: 'S/ 300 - S/ 800',
      time: '7-15 días hábiles',
      progress: 100,
      status: 'completed',
    },
    {
      title: 'Registro RUC (SUNAT)',
      description: 'Obtención del Registro Único de Contribuyentes',
      entity: 'SUNAT',
      cost: 'Gratuito',
      time: '1 día',
      progress: 65,
      status: 'in-progress',
    },
    {
      title: 'Licencia Municipal',
      description: 'Autorización municipal de funcionamiento',
      entity: 'Municipalidad',
      cost: 'S/ 100 - S/ 500',
      time: '15-30 días',
      progress: 0,
      status: 'pending',
    },
    {
      title: 'Registro ESSALUD',
      description: 'Inscripción de trabajadores en el seguro social',
      entity: 'ESSALUD',
      cost: 'Gratuito (9% planilla)',
      time: '1-3 días',
      progress: 0,
      status: 'blocked',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/dashboard" color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <ArrowBackIcon fontSize="small" /> Volver al Dashboard
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📋 Gestión de Trámites
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
        >
          Descargar PDF
        </Button>
      </Box>

      {/* Resumen de Formalización */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Resumen de Formalización
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Estado actual de todos tus trámites de formalización
          </Typography>

          <ProcedureStats />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Progreso general
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                41%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={41}
              sx={{ height: 10, borderRadius: 1, mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              7 de 15 pasos completados
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de Trámites */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Trámites Detallados
      </Typography>

      {procedures.map((proc, index) => (
        <ProcedureStep 
          key={index}
          title={proc.title}
          description={proc.description}
          entity={proc.entity}
          cost={proc.cost}
          time={proc.time}
          progress={proc.progress}
          status={proc.status}
        />
      ))}

      {/* Recomendaciones */}
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
        Recomendaciones
      </Typography>

      <RecommendationCard 
        level="urgente"
        title="Completar RUC en SUNAT"
        text="Es necesario finalizar el registro RUC para continuar con los demás trámites."
        action="Presentar documentos faltantes"
      />

      <RecommendationCard 
        level="importante"
        title="Iniciar licencia municipal"
        text="La licencia municipal puede demorar hasta 30 días. Se recomienda iniciar pronto."
        action="Solicitar certificado de zonificación"
      />

      <RecommendationCard 
        level="bien hecho"
        title="¡Bien hecho!"
        text="Tu empresa ya está constituida en SUNARP. Continúa con los siguientes pasos."
      />
    </DashboardLayout>
  );
};

export default ProceduresPage;
