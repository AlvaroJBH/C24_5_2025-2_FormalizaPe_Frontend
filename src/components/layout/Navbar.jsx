import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  AccountCircle as AccountCircleIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 40, 
              height: 40 
            }}
          >
            <BusinessCenterIcon />
          </Avatar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/dashboard"
            sx={{ 
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Formaliza.pe
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              ml: 1,
            }}
          >
            Bienvenido, Emprendedor
          </Typography>
        </Box>

        {/* Iconos de la derecha */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            color="default" 
            title="Notificaciones"
            sx={{ color: 'text.secondary' }}
          >
            <NotificationsIcon />
          </IconButton>
          
          <IconButton 
            color="default" 
            onClick={handleMenuOpen}
            sx={{ color: 'text.secondary' }}
          >
            <AccountCircleIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
            <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
