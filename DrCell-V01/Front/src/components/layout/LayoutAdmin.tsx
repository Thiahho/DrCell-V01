import React, { useState } from 'react';
import SidebarAdmin from '../admin/SidebarAdmin';
import Navbar from '../Navbar';
import { Outlet } from 'react-router-dom';

const LayoutAdmin: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <SidebarAdmin open={sidebarOpen} setOpen={setSidebarOpen} />
        <main
          className={`flex-1 p-8 w-full transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;