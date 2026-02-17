'use client';

import React, { useState } from 'react';
import DashboardSidebar, { SidebarLink } from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  sidebarLinks: SidebarLink[];
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarLinks,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen bg-gray-50 w-screen flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        sidebarLinks={sidebarLinks}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
