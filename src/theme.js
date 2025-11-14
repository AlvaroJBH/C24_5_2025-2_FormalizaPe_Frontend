import { createTheme } from '@mui/material/styles';

// Tema personalizado basado en el diseño de FormalizaPe
const theme = createTheme({
  palette: {
    primary: {
      main: '#3563E9', // Azul principal del diseño
      light: '#5B7FFF',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981', // Verde para estados completados
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444', // Rojo para bloqueados/urgente
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B', // Amarillo/naranja para importante
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6', // Azul para "en proceso"
      light: '#60A5FA',
      dark: '#2563EB',
    },
    success: {
      main: '#10B981',
      light: '#D1FAE5',
      dark: '#059669',
    },
    background: {
      default: '#F1F5F9', // Fondo general (gris muy claro)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1E293B',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1E293B',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1E293B',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#1E293B',
    },
    body1: {
      fontSize: '1rem',
      color: '#475569',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#64748B',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 6px 12px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    ...Array(20).fill('0px 10px 20px rgba(0, 0, 0, 0.12)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(53, 99, 233, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
