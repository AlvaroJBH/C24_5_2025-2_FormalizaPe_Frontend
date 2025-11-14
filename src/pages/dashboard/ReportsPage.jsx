import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Divider,
  Alert,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const costs = [
    { item: 'Constitución SUNARP', amount: 'S/ 800' },
    { item: 'Registro RUC', amount: 'S/ 0' },
    { item: 'Licencia Municipal', amount: 'S/ 250' },
    { item: 'Registro ESSALUD', amount: 'S/ 0' },
  ];

  const regimens = [
    { name: 'RUS', monthly: 'S/ 200/mes', annual: 'S/ 2400', percentage: 20 },
    { name: 'RER', monthly: 'S/ 450/mes', annual: 'S/ 5400', percentage: 45 },
    { name: 'MYPE Tributario', monthly: 'S/ 320/mes', annual: 'S/ 3840', percentage: 32 },
    { name: 'Régimen General', monthly: 'S/ 850/mes', annual: 'S/ 10200', percentage: 85 },
  ];

  const timeline = [
    { date: '2024-01-15', event: 'Iniciado proceso de constitución', status: 'completed' },
    { date: '2024-01-20', event: 'Búsqueda de nombre aprobada', status: 'completed' },
    { date: '2024-01-25', event: 'Minuta elaborada', status: 'completed' },
    { date: '2024-02-01', event: 'Escritura pública notarizada', status: 'completed' },
    { date: '2024-02-10', event: 'Inscripción SUNARP completada', status: 'completed' },
    { date: '2024-02-15', event: 'Iniciado trámite RUC', status: 'in-progress' },
    { date: '2024-02-20', event: 'Documentos RUC presentados', status: 'in-progress' },
    { date: '2024-02-25', event: 'Licencia municipal - pendiente', status: 'pending' },
    { date: '2024-03-01', event: 'Registro ESSALUD - bloqueado', status: 'blocked' },
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
              📊 Reportes e Informes
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

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Trámites" />
          <Tab label="Financiero" />
          <Tab label="Cronología" />
          <Tab label="Proyecciones" />
        </Tabs>
      </Box>

      {/* Tab: Trámites */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reporte de Trámites
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Estado General
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Completados</Typography>
                      <Typography variant="body2" fontWeight={600}>1/4</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">En Proceso</Typography>
                      <Typography variant="body2" fontWeight={600}>1/4</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Pendientes</Typography>
                      <Typography variant="body2" fontWeight={600}>1/4</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Bloqueados</Typography>
                      <Typography variant="body2" fontWeight={600}>1/4</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>Progreso Total</Typography>
                    <Typography variant="body2" fontWeight={600}>47%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={47} sx={{ height: 10, borderRadius: 1 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Tiempo Estimado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Tiempo promedio para completar todos los trámites
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" color="primary" fontWeight={700}>
                      45
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      días hábiles
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab: Financiero */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reporte Financiero
          </Typography>

          <Grid container spacing={3}>
            {/* Costos de Formalización */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <MoneyIcon color="success" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Costos de Formalización
                    </Typography>
                  </Box>

                  {costs.map((cost, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2">{cost.item}</Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {cost.amount}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight={700}>Total Gastado</Typography>
                    <Typography variant="body1" fontWeight={700} color="success.main">
                      S/ 1050
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Costos Proyectados: S/ 500
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Comparación de Regímenes */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TrendingUpIcon color="info" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Comparación de Regímenes
                    </Typography>
                  </Box>

                  {regimens.map((reg, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{reg.name}</Typography>
                        <Typography variant="body2" fontWeight={600}>{reg.monthly}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={reg.percentage}
                        sx={{ height: 8, borderRadius: 1, mb: 0.5 }}
                      />
                    </Box>
                  ))}

                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="caption">
                      <strong>Recomendación:</strong> El RUS es el más económico para tu nivel de ingresos actual.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            {/* Proyección Anual */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Proyección Anual de Impuestos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Estimación de pagos tributarios según diferentes regímenes
                  </Typography>

                  <Grid container spacing={2}>
                    {regimens.map((reg, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'background.default', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {reg.name}
                          </Typography>
                          <Typography variant="h5" color="primary" fontWeight={700}>
                            {reg.annual}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            anual
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab: Cronología */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Cronología de Trámites
          </Typography>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📅 Historial de Actividades
                </Typography>
              </Box>

              {timeline.map((item, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 2,
                    pb: 2,
                    borderBottom: index < timeline.length - 1 ? '1px solid #E2E8F0' : 'none',
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%',
                      backgroundColor: 
                        item.status === 'completed' ? 'success.main' :
                        item.status === 'in-progress' ? 'info.main' :
                        item.status === 'pending' ? 'grey.400' : 'error.main',
                      mt: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.event}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          item.status === 'completed' ? 'success.light' :
                          item.status === 'in-progress' ? 'info.light' :
                          item.status === 'pending' ? 'grey.200' : 'error.light',
                        color: 
                          item.status === 'completed' ? 'success.dark' :
                          item.status === 'in-progress' ? 'info.dark' :
                          item.status === 'pending' ? 'text.secondary' : 'error.dark',
                        fontWeight: 600,
                      }}
                    >
                      {item.status === 'completed' ? 'Completado' :
                       item.status === 'in-progress' ? 'En proceso' :
                       item.status === 'pending' ? 'Pendiente' : 'Bloqueado'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Tab: Proyecciones */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Proyecciones
          </Typography>
          <Alert severity="info">
            Próximamente: Proyecciones de crecimiento y análisis predictivo.
          </Alert>
        </Box>
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;
