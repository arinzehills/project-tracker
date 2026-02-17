"use client";

import Projects from "@/modules/projects/Projects";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function ProjectsPage() {
  const sidebarLinks = [
    {
      name: "Create Project",
      url: "#",
      icon: "mdi:plus-circle",
    },
    { name: "Dashboard", url: "/projects", icon: "mdi:view-dashboard" },
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <Projects />
    </DashboardLayout>
  );
}
