import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from '@/pages/Home';
import Pedidos from '@/pages/admin/Pedidos';
import Productos from '@/pages/admin/Productos';
import Usuarios from '@/pages/admin/Usuarios';
import Perfil from '@/pages/admin/Perfil';
import ConsultaReparacionSection from './components/ConsultaReparacionSection';
import {Login} from '@/pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import LayoutAdmin from '@/components/layout/LayoutAdmin';
import DashboardAdmin from '@/components/admin/DasboardAdmin';
import PrivateRoute from '@/components/admin/PrivateRoute';
import { Toaster } from 'sonner';

const UserDashboard = () => <div>Panel de Usuario</div>;

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cotizacion" element={<ConsultaReparacionSection />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <LayoutAdmin />
              </PrivateRoute>
            }
          >
              <Route index element={<DashboardAdmin />} />
    <Route path="pedidos" element={<Pedidos />} />
    <Route path="productos" element={<Productos />} />
    <Route path="usuarios" element={<Usuarios />} />
    <Route path="perfil" element={<Perfil />} />
           <Route index element={<DashboardAdmin />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
} 