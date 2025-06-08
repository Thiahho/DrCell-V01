import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
  InputAdornment
} from '@mui/material';
import axios from 'axios';

interface ReparacionInfo {
  arreglomodulo?: number;
  arreglobateria?: number;
  arreglopin?: number;
}

const API_URL = 'http://localhost:5015'; // Cambia esto si tu backend usa otro puerto

const ConsultaReparacionSection: React.FC = () => {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [precio, setPrecio] = useState('');
  const [modulo, setModulo] = useState('');
  const [pin, setPin] = useState('');
  const [info, setInfo] = useState<ReparacionInfo | null>(null);
  const [loading, setLoading] = useState(false);

  // Obtener marcas reales
  useEffect(() => {
    axios.get(`${API_URL}/celulares/marcas`)
      .then(res => setMarcas(res.data))
      .catch(() => setMarcas([]));
  }, []);

  // Obtener modelos según marca
  useEffect(() => {
    setModelo('');
    setInfo(null);
    setPrecio('');
    if (marca) {
      axios.get(`${API_URL}/celulares/modelos/${marca}`)
        .then(res => setModelos(res.data))
        .catch(() => setModelos([]));
    } else {
      setModelos([]);
    }
  }, [marca]);

  // Obtener info de reparación (precios) según marca y modelo
  useEffect(() => {
    setInfo(null);
    setPrecio('');
    if (marca && modelo) {
      setLoading(true);
      axios.get(`${API_URL}/celulares/info/${marca}/${modelo}`)
        .then(res => {
          const data = res.data[0];
          setInfo(data);
          // Mostrar el precio más relevante
          if (data) {
            let precioStr = '';
            if (data.arreglomodulo) precioStr += `Módulo: $${data.arreglomodulo}  `;
            if (data.arreglobateria) precioStr += `Batería: $${data.arreglobateria}  `;
            if (data.arreglopin) precioStr += `Pin: $${data.arreglopin}`;
            setPrecio(precioStr.trim());
          } else {
            setPrecio('No disponible');
          }
        })
        .catch(() => setPrecio('No disponible'))
        .finally(() => setLoading(false));
    }
  }, [marca, modelo]);

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    // Ya se consulta automáticamente al elegir marca y modelo
  };

  return (
    <Box sx={{ my: 8 }}>
      <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
          Consulta tu reparación
        </Typography>
        <Box component="form" onSubmit={handleConsultar} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Marca"
                value={marca}
                onChange={e => setMarca(e.target.value)}
                fullWidth
                required
              >
                {marcas.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Modelo"
                value={modelo}
                onChange={e => setModelo(e.target.value)}
                fullWidth
                required
                disabled={!marca}
              >
                {modelos.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Módulo"
                value={info?.arreglomodulo ? `$${info.arreglomodulo}` : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pin de carga"
                value={info?.arreglopin ? `$${info.arreglopin}` : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Batería"
                value={info?.arreglobateria ? `$${info.arreglobateria}` : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio total"
                value={precio}
                InputProps={{ readOnly: true }}
                fullWidth
                helperText={loading ? 'Consultando...' : ''}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button type="submit" variant="contained" sx={{ px: 6, borderRadius: 2 }} disabled>
                Consultar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConsultaReparacionSection; 