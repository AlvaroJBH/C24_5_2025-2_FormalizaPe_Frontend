import React from 'react';
import { Typography, Box, IconButton, Grid } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatWindow from '../../components/assistant/ChatWindow';
import FaqSidebar from '../../components/assistant/FaqSidebar';

const AssistantPage = () => {
  const handleQuestionClick = (question) => {
    console.log('Pregunta seleccionada:', question);
    // Aquí podrías enviar la pregunta automáticamente al chat
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
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
            💬 Asistente Virtual con IA
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sidebar de FAQs */}
        <Grid item xs={12} md={4}>
          <FaqSidebar onQuestionClick={handleQuestionClick} />
        </Grid>

        {/* Ventana de Chat */}
        <Grid item xs={12} md={8}>
          <ChatWindow />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default AssistantPage;
