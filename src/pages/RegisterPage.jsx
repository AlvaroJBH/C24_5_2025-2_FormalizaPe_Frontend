import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import AuthLayout from '../components/layout/AuthLayout';
import { register as registerService } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dni: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerService(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
    }
  };

  return (
    <AuthLayout>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom
        sx={{ fontWeight: 600, mb: 1 }}
      >
        Crear Cuenta
      </Typography>
      
      <Typography 
        variant="body2" 
        align="center" 
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Regístrate para comenzar a formalizar tu negocio
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ¡Registro exitoso! Redirigiendo al login...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Nombre Completo
        </Typography>
        <TextField
          fullWidth
          name="name"
          placeholder="Juan Pérez"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Correo Electrónico
        </Typography>
        <TextField
          fullWidth
          name="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          DNI
        </Typography>
        <TextField
          fullWidth
          name="dni"
          placeholder="12345678"
          value={formData.dni}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Contraseña
        </Typography>
        <TextField
          fullWidth
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{ mb: 2, py: 1.5 }}
        >
          Crear Cuenta
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            ¿Ya tienes cuenta? <strong>Inicia sesión</strong>
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
