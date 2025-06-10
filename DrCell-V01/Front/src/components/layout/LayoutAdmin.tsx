import React from 'react';
import SidebarAdmin from '../admin/SidebarAdmin';
import Footer from '../Footer';
import Navbar from '../Navbar';
import { Outlet } from 'react-router-dom';

const LayoutAdmin: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gray-900">
    <Navbar />
    <div className="flex flex-1">
      <SidebarAdmin />
      <main className="flex-1 p-8 w-full">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

export default LayoutAdmin;