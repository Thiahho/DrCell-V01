import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import PowerInputIcon from '@mui/icons-material/PowerInput';

const servicios = [
  {
    titulo: 'Módulos',
    icono: <BuildIcon sx={{ fontSize: 50, color: '#17436b' }} />,
    descripcion: 'Reparación y cambio de pantallas y módulos en 3 horas. Garantía de 15 días.'
  },
  {
    titulo: 'Baterías',
    icono: <BatteryChargingFullIcon sx={{ fontSize: 50, color: '#17436b' }} />,
    descripcion: 'Cambio de baterías originales y compatibles. Garantía de 15 días.'
  },
  {
    titulo: 'Pines',
    icono: <PowerInputIcon sx={{ fontSize: 50, color: '#17436b' }} />,
    descripcion: 'Reparación de pines de carga y placa. Garantía de 15 días.'
  }
];

const ServiciosSection: React.FC = () => (
  <Box sx={{ my: 8 }}>
    <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
      Contacta con expertos
    </Typography>
    <Typography variant="body1" align="center" color="text.secondary" mb={5}>
      Nuestro equipo está listo para ayudarte con cualquier reparación de tu celular. Consulta sin compromiso.
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {servicios.map((servicio) => (
        <Grid item xs={12} md={4} key={servicio.titulo}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
            <Box sx={{ mb: 2 }}>{servicio.icono}</Box>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                {servicio.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {servicio.descripcion}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ServiciosSection; 