import React from 'react';
import {
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  CubeIcon,
  UserCircleIcon,
  Bars3Icon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', icon: HomeIcon },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardIcon },
  { to: '/admin/productos', label: 'Productos', icon: CubeIcon },
  { to: '/admin/usuarios', label: 'Usuarios', icon: UsersIcon },
  { to: '/admin/perfil', label: 'Perfil', icon: UserCircleIcon },
];

interface SidebarAdminProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ open, setOpen }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  return (
    <aside className={`h-[90vh] my-6 ml-6 ${open ? 'w-64' : 'w-20'} bg-white shadow-2xl rounded-3xl flex flex-col transition-all duration-300`}>
      <div className="flex items-center justify-between h-20 border-b px-4">
        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${usuario.email || 'Admin'}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          {open && (
            <div>
              <div className="font-bold text-gray-800">{usuario.rol || 'Admin'}</div>
              <div className="text-xs text-gray-500">{usuario.email || 'admin@demo.com'}</div>
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <nav className="flex flex-col flex-1 py-6 px-2 space-y-2" style={{ flexDirection: 'column', display: 'flex' }}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 gap-3
              ${open ? 'justify-start' : 'justify-center'}
              ${isActive ? 'bg-blue-100 text-blue-700' : ''}`
            }
            style={{ textDecoration: 'none' }}
          >
            <Icon className="h-6 w-6 flex-shrink-0" style={{ width: 24, height: 24 }} />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <button
          className={`flex items-center w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 gap-3 font-medium transition-colors
            ${open ? 'justify-start' : 'justify-center'}
          `}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
          }}
        >
           <ArrowLeftStartOnRectangleIcon className="h-6 w-6 flex-shrink-0" style={{ width: 24, height: 24 }} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;