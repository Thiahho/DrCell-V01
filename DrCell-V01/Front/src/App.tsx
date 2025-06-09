import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RepairQuote from './pages/RepairQuote';
import Footer from './components/Footer';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Navbar />
        <main className="App-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cotizacion" element={<RepairQuote />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 