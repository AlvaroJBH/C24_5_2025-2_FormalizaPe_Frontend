import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AlertBox from '../../components/common/AlertBox';
import ProgressOverview from '../../components/dashboard/ProgressOverview';
import QuickAccess from '../../components/dashboard/QuickAccess';
import AiRecommendations from '../../components/dashboard/AiRecommendations';
import BusinessSummary from '../../components/dashboard/BusinessSummary';
import OverallProgress from '../../components/dashboard/OverallProgress';

const DashboardHomePage = () => (
  <DashboardLayout>
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Panel Principal
      </Typography>

      {/* Alertas Importantes */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
          Alertas Importantes
        </Typography>
        
        <AlertBox type="warning">
          ⚠️ <strong>Pago de IGV vence en 5 días (15 de Octubre)</strong>
        </AlertBox>

        <AlertBox type="info">
          📊 <strong>Nuevo régimen MYPE disponible para tu negocio</strong>
        </AlertBox>

        <AlertBox type="success">
          ✅ <strong>RUC actualizado correctamente</strong>
        </AlertBox>
      </Box>

      <Grid container spacing={3}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={12} lg={7}>
          <ProgressOverview />
          <QuickAccess />
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={12} lg={5}>
          <BusinessSummary />
          <OverallProgress />
          <AiRecommendations />
        </Grid>
      </Grid>
    </Box>
  </DashboardLayout>
);

export default DashboardHomePage;
