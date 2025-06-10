import React, { useState } from 'react';
import {
  HomeIcon,
  ClipboardIcon,
  UsersIcon,
  CubeIcon,
  UserCircleIcon,
  Bars3Icon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

const links = [
  { to: '/admin', label: 'Dashboard', icon: HomeIcon },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardIcon },
  { to: '/admin/productos', label: 'Productos', icon: CubeIcon },
  { to: '/admin/usuarios', label: 'Usuarios', icon: UsersIcon },
  { to: '/admin/perfil', label: 'Perfil', icon: UserCircleIcon },
];

const SidebarAdmin: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`h-[90vh] my-6 ml-6 w-64 bg-white shadow-2xl rounded-3xl flex flex-col transition-all duration-300 ${open ? '' : 'w-20'}`}>
      <div className="flex items-center justify-between h-20 border-b px-4">
        <div className="flex items-center gap-2">
          <img
            src="https://ui-avatars.com/api/?name=Admin"
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          {open && (
            <div>
              <div className="font-bold text-gray-800">Admin</div>
              <div className="text-xs text-gray-500">admin@demo.com</div>
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
          <a
            key={to}
            href={to}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-700 gap-3
              ${open ? 'justify-start' : 'justify-center'}
            `}
            style={{ textDecoration: 'none' }}
          >
            <Icon className="h-6 w-6 flex-shrink-0" style={{ width: 24, height: 24 }} />
            {open && <span>{label}</span>}
          </a>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <button
          className={`flex items-center w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 gap-3 font-medium transition-colors
            ${open ? 'justify-start' : 'justify-center'}
          `}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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