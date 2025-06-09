import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Button } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#17436b', color: 'white', mt: 8, pt: 6, pb: 2 }}>
      <Container maxWidth="lg">
        {/* Frase de contacto */}
        <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight={600}>
              ¿Tienes una pregunta? Comentanos por WhatsApp.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' }, mt: { xs: 2, md: 0 } }}>
            <Button variant="contained" color="secondary" sx={{ fontWeight: 600, borderRadius: 2 }}>
              Habla con nosotros o agenda una llamada →
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Driven by <span style={{ color: '#00e676' }}>Excellence.</span>
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Ubicados hace 18 años en el mismo lugar, atendido por su dueño.
              <br />
              Libertador 362,Moreno, Buenos Aires, Argentina.
            </Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Mi Cuenta
            </Typography>
            <Box>
              <Link href="#" color="inherit" underline="hover" display="block">Login</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Registrar</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Pedidos</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Retiros</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Salir</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Soporte
            </Typography>
            <Box>
              <Link href="#" color="inherit" underline="hover" display="block">FAQ</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Enviar mensaje</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Hablar con expertos</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Agendar llamada</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Reclamos</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              Datos generales
            </Typography>
            <Box>
              <Link href="#" color="inherit" underline="hover" display="block">Condiciones</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Política de privacidad</Link>
              <Link href="#" color="inherit" underline="hover" display="block">Eliminar mis datos</Link>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 4 }} />
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              &copy; {new Date().getFullYear()} DrCell. Todos los derechos reservados.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Pagos seguros: VISA, AMEX, PayPal
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 