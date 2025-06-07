import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <PhoneIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            DrCell
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/cotizacion"
          >
            Cotización
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 