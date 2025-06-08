import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BuildIcon from '@mui/icons-material/Build';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ServiciosSection from '../components/ServiciosSection';
import ConsultaReparacionSection from '../components/ConsultaReparacionSection';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <ServiciosSection />
      <ConsultaReparacionSection />
  
    </>
  );
};

export default Home; 