import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import axios from 'axios';

interface Phone {
  marca: string;
  modelo: string;
}

interface RepairQuote {
  marca: string;
  modelo: string;
  arreglomodulo?: number;
  arreglobateria?: number;
  arreglopin?: number;
}

const RepairQuote: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [quote, setQuote] = useState<RepairQuote | null>(null);

  useEffect(() => {
    // Fetch brands
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:5015/celulares/marcas');
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    // Fetch models when brand changes
    if (selectedBrand) {
      const fetchModels = async () => {
        try {
          const response = await axios.get(`http://localhost:5015/celulares/modelos/${selectedBrand}`);
          setModels(response.data);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      };
      fetchModels();
    }
  }, [selectedBrand]);

  useEffect(() => {
    // Fetch quote when both brand and model are selected
    if (selectedBrand && selectedModel) {
      const fetchQuote = async () => {
        try {
          const response = await axios.get(`http://localhost:5015/celulares/info/${selectedBrand}/${selectedModel}`);
          setQuote(response.data[0]);
        } catch (error) {
          console.error('Error fetching quote:', error);
        }
      };
      fetchQuote();
    }
  }, [selectedBrand, selectedModel]);

  const handleBrandChange = (event: SelectChangeEvent) => {
    setSelectedBrand(event.target.value);
    setSelectedModel('');
    setQuote(null);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Cotización de Reparación
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Marca</InputLabel>
              <Select
                value={selectedBrand}
                label="Marca"
                onChange={handleBrandChange}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Modelo</InputLabel>
              <Select
                value={selectedModel}
                label="Modelo"
                onChange={handleModelChange}
                disabled={!selectedBrand}
              >
                {models.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {quote && (
          <Paper sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cotización para {quote.marca} {quote.modelo}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {quote.arreglomodulo && (
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Reparación de Módulo: ${quote.arreglomodulo}
                  </Typography>
                </Grid>
              )}
              {quote.arreglobateria && (
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Cambio de Batería: ${quote.arreglobateria}
                  </Typography>
                </Grid>
              )}
              {quote.arreglopin && (
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Reparación de Pin: ${quote.arreglopin}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default RepairQuote; 