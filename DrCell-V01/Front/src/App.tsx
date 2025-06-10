import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RepairQuote from './pages/RepairQuote';
import Footer from './components/Footer';
import Dashboard from './pages/admin/Dashboard';
import Pedidos from './pages/admin/Pedidos';
import Productos from './pages/admin/Productos';
import Usuarios from './pages/admin/Usuarios';
import Perfil from './pages/admin/Perfil';
import LayoutAdmin from './components/layout/LayoutAdmin';
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {!isAdminRoute && <Navbar />}
        <Routes>
          {/* Rutas públicas con App-content */}
          <Route
            path="/"
            element={
              <main className="App-content">
                <Home />
              </main>
            }
          />
          <Route
            path="/cotizacion"
            element={
              <main className="App-content">
                <RepairQuote />
              </main>
            }
          />
          {/* Rutas admin con layout propio */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="productos" element={<Productos />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      </div>
    </ThemeProvider>
  );

}

export default App; 