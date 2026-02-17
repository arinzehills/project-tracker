"use client";

import Projects from "@/modules/projects/Projects";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const sidebarLinks = [
  { name: "Create Project", url: "/projects/create", icon: "mdi:plus-circle" },
  { name: "Dashboard", url: "/projects", icon: "mdi:view-dashboard" },
];

export default function ProjectsPage() {
  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      <Projects />
    </DashboardLayout>
  );
}
