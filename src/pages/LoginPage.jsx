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
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import AuthLayout from '../components/layout/AuthLayout';
import { login as loginService } from '../services/authService';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginService(formData);
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
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
        Iniciar Sesión
      </Typography>
      
      <Typography 
        variant="body2" 
        align="center" 
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Accede a tu cuenta para gestionar tu negocio
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
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
          Iniciar Sesión
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            sx={{ textDecoration: 'none' }}
          >
            ¿No tienes cuenta? <strong>Regístrate</strong>
          </Link>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'none' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
