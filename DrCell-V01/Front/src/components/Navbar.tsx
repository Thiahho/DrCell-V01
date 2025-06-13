import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  HomeIcon,
  CubeIcon,
  UsersIcon,
  ClipboardIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ShoppingCartIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth-store';

interface User {
  email: string;
  rol?: 'ADMIN' | 'USER';
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Barra informativa */}
      <div className="w-full bg-[#17436b] text-white py-2 text-center text-sm">
        Lunes a Viernes de 09:00 a 19:00. <span className="font-bold">Cotizacion sin cargo.</span>
      </div>
      
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-[#17436b]">
              DrCell
            </Link>

            {/* Menú principal */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link to="/tienda" className="text-gray-700 hover:text-[#17436b]">
                Tienda
              </Link>
              <Link to="/sobre-nosotros" className="text-gray-700 hover:text-[#17436b]">
                Sobre nosotros
              </Link>
              <Link to="/mayoristas" className="text-gray-700 hover:text-[#17436b]">
                Mayoristas
              </Link>
              <Link to="/soporte" className="text-[#17436b] border-b-2 border-[#17436b] font-semibold">
                Soporte
              </Link>
            </div>

            {/* Acciones a la derecha */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-[#17436b]">
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </button>
              <button className="text-gray-700 hover:text-[#17436b]">
                <ShoppingCartIcon className="h-6 w-6" />
              </button>

              {user ? (
                <>
                  <Button
                    variant="outline"
                    className="border-[#17436b] text-[#17436b]"
                    onClick={() => navigate('/cuenta')}
                  >
                    <UserCircleIcon className="mr-2 h-5 w-5" />
                    {user.email}
                  </Button>
                  
                  {user.rol === 'ADMIN' && (
                    <Button
                      className="bg-[#17436b] text-white hover:bg-[#0d2b4a]"
                      onClick={() => navigate('/admin')}
                    >
                      <ClipboardIcon className="mr-2 h-5 w-5" />
                      Admin
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-[#17436b] text-white hover:bg-[#0d2b4a]"
                  onClick={() => navigate('/login')}
                >
                  <UserCircleIcon className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 