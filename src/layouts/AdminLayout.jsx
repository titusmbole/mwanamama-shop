import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Pass collapsed + setCollapsed correctly */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 bg-gray-100">
        {/* pass collapsed and setter to header */}
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Push content below fixed header + add dynamic left margin */}
        <main
          className="p-6"
          style={{
            marginTop: '64px',                             // push below header
            marginLeft: collapsed ? '80px' : '280px',       // align with sidebar
            transition: 'margin-left 0.3s ease'
          }}
        >
          <Outlet context={{ collapsed }} />  
          {/* Now any child page can use useOutletContext to get the collapsed value */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
