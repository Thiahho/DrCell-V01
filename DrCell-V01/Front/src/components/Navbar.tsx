import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Link,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  HomeIcon,
  CubeIcon,
  UsersIcon,
  ClipboardIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setUser(userData);
  }, []);

  const handleCountryClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCountryClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {/* Barra informativa */}
      <Box sx={{ width: '100%', bgcolor: '#17436b', color: 'white', py: 1, textAlign: 'center', fontSize: 15 }}>
        Lunes a Viernes de 09:00 a 19:00. <b>Cotizacion sin cargo.</b>
      </Box>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 0,
                textDecoration: 'none',
                color: '#17436b',
                fontWeight: 700,
                mr: 4,
              }}
            >
              DrCell
            </Typography>
            {/* Menú principal */}
            <Box sx={{ display: 'flex', gap: 3, flexGrow: 1 }}>
              <Button component={RouterLink} to="/tienda" color="inherit">Tienda</Button>
              <Button component={RouterLink} to="/sobre-nosotros" color="inherit">Sobre nosotros</Button>
              <Button component={RouterLink} to="/mayoristas" color="inherit">Mayoristas</Button>
              <Button component={RouterLink} to="/soporte" color="inherit" sx={{ borderBottom: '2px solid #17436b', fontWeight: 600 }}>Soporte</Button>
            </Box>
            {/* Acciones a la derecha */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* <Link href="#" underline="none" sx={{ color: 'text.primary', fontSize: 14 }}>
                Crear cuenta empresa y empieza a comprar
              </Link>*/}
              <IconButton color="inherit">
                <HelpOutlineIcon />
              </IconButton>
              <IconButton color="inherit">
                <ShoppingCartIcon />
              </IconButton>
              {/* País */}
              {/*<Button
                color="inherit"
                endIcon={<ExpandMoreIcon />}
                onClick={handleCountryClick}
                sx={{ textTransform: 'none', fontSize: 14 }}
              >
                Argentina
              </Button>
               <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCountryClose}>
                <MenuItem onClick={handleCountryClose}>España</MenuItem>
                <MenuItem onClick={handleCountryClose}>México</MenuItem>
                <MenuItem onClick={handleCountryClose}>Argentina</MenuItem>
              </Menu>*/}
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<AccountCircleIcon />}
                    component={RouterLink}
                    to="/cuenta"
                    sx={{ ml: 1, borderRadius: 2, borderColor: '#17436b', color: '#17436b', fontWeight: 500 }}
                  >
                    {user?.email}
                  </Button>
                  {user?.rol === 'ADMIN' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AdminPanelSettingsIcon />}
                      component={RouterLink}
                      to="/admin"
                      sx={{ ml: 1, borderRadius: 2, bgcolor: '#17436b', '&:hover': { bgcolor: '#0d2b4a' } }}
                    >
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ ml: 1, borderRadius: 2 }}
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AccountCircleIcon />}
                  component={RouterLink}
                  to="/login"
                  sx={{ ml: 1, borderRadius: 2, bgcolor: '#17436b', '&:hover': { bgcolor: '#0d2b4a' } }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar; 