'use client';

import React, { useState } from 'react';
import DashboardSidebar, { SidebarLink } from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import AddProjectModal from '@/modules/projects/components/AddProjectModal';

interface DashboardLayoutProps {
  sidebarLinks: SidebarLink[];
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarLinks,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Update sidebar links to include onClick for "Create Project"
  const enhancedSidebarLinks = sidebarLinks.map(link => {
    if (link.name === 'Create Project') {
      return { ...link, onClick: () => setIsAddModalOpen(true) };
    }
    return link;
  });

  return (
    <div className="h-screen bg-gray-50 w-screen flex">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        sidebarLinks={enhancedSidebarLinks}
      />

      <div className="flex-1 flex flex-col">
        <DashboardHeader onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          // Optional: You can add additional success logic here
        }}
      />
    </div>
  );
};

export default DashboardLayout;
