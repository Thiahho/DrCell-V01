import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem
} from '@mui/material';
import axios from 'axios';

interface ReparacionInfo {
  arreglomodulo?: number;
  arreglobateria?: number;
  arreglopin?: number;
  colormodulo?: string;
  tipo?: string;
  marco?: boolean;
  version?: string;
  id?: number;
  marca?: string;
  modelo?: string;
}

const API_URL = 'http://localhost:5015';

const ConsultaReparacionSection: React.FC = () => {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [variantes, setVariantes] = useState<ReparacionInfo[]>([]);
  const [color, setColor] = useState('');
  const [marco, setMarco] = useState('');
  const [version, setVersion] = useState('');
  const [tipo, setTipo] = useState('');
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<ReparacionInfo | null>(null);
  const [precio, setPrecio] = useState('');
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
    setVariantes([]);
    setColor('');
    setMarco('');
    setVersion('');
    setTipo('');
    setVarianteSeleccionada(null);
    setPrecio('');
    if (marca) {
      axios.get(`${API_URL}/celulares/modelos/${marca}`)
        .then(res => setModelos(res.data))
        .catch(() => setModelos([]));
    } else {
      setModelos([]);
    }
  }, [marca]);

  // Obtener variantes según marca y modelo
  useEffect(() => {
    setVariantes([]);
    setColor('');
    setMarco('');
    setVersion('');
    setTipo('');
    setVarianteSeleccionada(null);
    setPrecio('');
    if (marca && modelo) {
      setLoading(true);
      axios.get(`${API_URL}/celulares/info/${marca}/${modelo}`)
        .then(res => {
          const data: ReparacionInfo[] = res.data;
          setVariantes(data);
        })
        .catch(() => setVariantes([]))
        .finally(() => setLoading(false));
    }
  }, [marca, modelo]);

  // Opciones únicas para cada campo, filtradas según las selecciones actuales
  const coloresDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!marco || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
          (!version || v.version === version) &&
          (!tipo || v.tipo === tipo)
        )
        .map(v => v.colormodulo)
        .filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [variantes, marco, version, tipo]);

  const marcosDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!color || v.colormodulo === color) &&
          (!version || v.version === version) &&
          (!tipo || v.tipo === tipo)
        )
        .map(v => (v.marco ? 'Con marco' : 'Sin marco'))
    );
    return Array.from(set) as string[];
  }, [variantes, color, version, tipo]);

  const versionesDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!color || v.colormodulo === color) &&
          (!marco || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
          (!tipo || v.tipo === tipo)
        )
        .map(v => v.version)
        .filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [variantes, color, marco, tipo]);

  const tiposDisponibles = useMemo(() => {
    const set = new Set(
      variantes
        .filter(v =>
          (!color || v.colormodulo === color) &&
          (!marco || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
          (!version || v.version === version)
        )
        .map(v => v.tipo)
        .filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [variantes, color, marco, version]);

  // Buscar la variante exacta
  useEffect(() => {
    if (!color && coloresDisponibles.length > 0) return setVarianteSeleccionada(null);
    if (!marco && marcosDisponibles.length > 0) return setVarianteSeleccionada(null);
    if (!version && versionesDisponibles.length > 0) return setVarianteSeleccionada(null);
    if (!tipo && tiposDisponibles.length > 0) return setVarianteSeleccionada(null);
    const variante = variantes.find(v =>
      (coloresDisponibles.length === 0 || v.colormodulo === color) &&
      (marcosDisponibles.length === 0 || (v.marco ? 'Con marco' : 'Sin marco') === marco) &&
      (versionesDisponibles.length === 0 || v.version === version) &&
      (tiposDisponibles.length === 0 || v.tipo === tipo)
    );
    setVarianteSeleccionada(variante || null);
  }, [color, marco, version, tipo, variantes, coloresDisponibles, marcosDisponibles, versionesDisponibles, tiposDisponibles]);

  // Actualizar precio cuando cambia la variante seleccionada
  useEffect(() => {
    if (varianteSeleccionada) {
      let precioStr = '';
      if (varianteSeleccionada.arreglomodulo) precioStr += `Módulo: $${varianteSeleccionada.arreglomodulo}  `;
      if (varianteSeleccionada.arreglobateria) precioStr += `Batería: $${varianteSeleccionada.arreglobateria}  `;
      if (varianteSeleccionada.arreglopin) precioStr += `Pin: $${varianteSeleccionada.arreglopin}`;
      setPrecio(precioStr.trim() || 'No disponible');
    } else {
      setPrecio('');
    }
  }, [varianteSeleccionada]);

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
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
            {/* Selectores independientes para cada campo */}
            {coloresDisponibles.length > 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="">Selecciona color</MenuItem>
                  {coloresDisponibles.map((c, idx) => (
                    <MenuItem key={idx} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {marcosDisponibles.length > 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Marco"
                  value={marco}
                  onChange={e => setMarco(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="">Selecciona marco</MenuItem>
                  {marcosDisponibles.map((m, idx) => (
                    <MenuItem key={idx} value={m}>{m}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {versionesDisponibles.length > 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Versión"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="">Selecciona versión</MenuItem>
                  {versionesDisponibles.map((v, idx) => (
                    <MenuItem key={idx} value={v}>{v}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {tiposDisponibles.length > 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Tipo"
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="">Selecciona tipo</MenuItem>
                  {tiposDisponibles.map((t, idx) => (
                    <MenuItem key={idx} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            {/* Mostrar detalles de la variante seleccionada */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Módulo"
                value={varianteSeleccionada?.arreglomodulo ? `$${varianteSeleccionada.arreglomodulo}` : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pin de carga"
                value={varianteSeleccionada?.arreglopin ? `$${varianteSeleccionada.arreglopin}` : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Batería"
                value={varianteSeleccionada?.arreglobateria ? `$${varianteSeleccionada.arreglobateria}` : ''}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            {/*{varianteSeleccionada?.colormodulo && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Color del módulo"
                  value={varianteSeleccionada.colormodulo}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            )}*
            {varianteSeleccionada?.tipo && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tipo"
                  value={varianteSeleccionada.tipo}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            )}
            {varianteSeleccionada?.marco !== undefined && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Marco"
                  value={varianteSeleccionada.marco ? 'Sí' : 'No'}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            )}*/}
            {varianteSeleccionada?.version && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Versión"
                  value={varianteSeleccionada.version}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            )}
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