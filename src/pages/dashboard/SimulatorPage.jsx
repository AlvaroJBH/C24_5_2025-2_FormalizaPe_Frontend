import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Card,
  CardContent,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Divider,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Calculate as CalculateIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const SimulatorPage = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '15000',
    monthlyExpenses: '8000',
    employees: '',
    businessType: '',
    assets: '50000',
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimulate = () => {
    // Simulación de cálculo (esto se haría con el backend)
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const netIncome = income - expenses;

    const calculations = {
      rus: netIncome * 0.015,
      rer: netIncome * 0.015 + income * 0.18,
      mype: netIncome * 0.10,
      general: netIncome * 0.295,
    };

    setResults(calculations);
  };

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
              📊 Simulador de Costos e Impuestos
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MoneyIcon color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Datos de tu Negocio
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ingresa la información de tu negocio para calcular el régimen tributario más conveniente
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ingresos Mensuales (S/)"
                    name="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="15000"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Gastos Mensuales (S/)"
                    name="monthlyExpenses"
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={handleChange}
                    placeholder="8000"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Número de Trabajadores</InputLabel>
                    <Select
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      label="Número de Trabajadores"
                    >
                      <MenuItem value="">Selecciona cantidad</MenuItem>
                      <MenuItem value="0">0 (Solo yo)</MenuItem>
                      <MenuItem value="1-5">1-5 trabajadores</MenuItem>
                      <MenuItem value="6-10">6-10 trabajadores</MenuItem>
                      <MenuItem value="11-20">11-20 trabajadores</MenuItem>
                      <MenuItem value="20+">Más de 20</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Negocio</InputLabel>
                    <Select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      label="Tipo de Negocio"
                    >
                      <MenuItem value="">Selecciona tipo</MenuItem>
                      <MenuItem value="comercio">Comercio</MenuItem>
                      <MenuItem value="servicios">Servicios</MenuItem>
                      <MenuItem value="manufactura">Manufactura</MenuItem>
                      <MenuItem value="tecnologia">Tecnología</MenuItem>
                      <MenuItem value="otros">Otros</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor de Activos (S/) - Opcional"
                    name="assets"
                    type="number"
                    value={formData.assets}
                    onChange={handleChange}
                    placeholder="50000"
                    helperText="Incluye equipos, maquinaria, vehículos, etc."
                  />
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
                <Typography variant="caption">
                  <strong>Importante:</strong> Los cálculos son referenciales y pueden variar según circunstancias específicas. Consulta con un contador para asesoría personalizada.
                </Typography>
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<CalculateIcon />}
                onClick={handleSimulate}
                sx={{ mt: 2 }}
              >
                Calcular Impuestos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Resultados */}
        <Grid item xs={12} lg={6}>
          {results ? (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Resultados de la Simulación
                </Typography>

                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Régimen Recomendado:</strong> MYPE Tributario
                  </Typography>
                  <Typography variant="caption">
                    Basado en tus ingresos proyectados, el RER podría ser más conveniente.
                  </Typography>
                </Alert>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Impuestos Mensuales Estimados
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">RUS</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        S/ {results.rus.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Régimen Único Simplificado
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">RER</Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        S/ {results.rer.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Régimen Especial de Renta
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">MYPE Tributario</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        S/ {results.mype.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Régimen para Micro y Pequeña Empresa
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Régimen General</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        S/ {results.general.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Para empresas más grandes
                    </Typography>
                  </Box>
                </Box>

                <Card sx={{ backgroundColor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      📈 Proyección Anual
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      S/ {(results.rer * 12).toFixed(2)}
                    </Typography>
                    <Typography variant="caption">
                      Impuestos anuales estimados (RER)
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalculateIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Completa el formulario para ver los resultados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresa los datos de tu negocio y haz clic en "Calcular Impuestos"
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default SimulatorPage;
