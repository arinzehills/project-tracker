"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Project } from "../types/project";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import ErrorState from "@/components/States/ErrorState";
import EmptyState from "@/components/States/EmptyState";

interface ProjectListGroupedProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onDelete: (projectId: string) => Promise<void>;
}

const ProjectListGrouped = ({
  projects,
  loading,
  error,
  onRefetch,
  onDelete,
}: ProjectListGroupedProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    active: true,
    on_hold: true,
    completed: true,
  });

  // Group projects by status
  const groupedProjects = {
    active: projects.filter((p) => p.status === "active"),
    on_hold: projects.filter((p) => p.status === "on_hold"),
    completed: projects.filter((p) => p.status === "completed"),
  };

  const statusConfig = {
    active: {
      label: "In Progress",
      icon: "mdi:play-circle",
      color: "text-blue-600",
      badgeColor: "bg-blue-100 text-blue-800",
      borderColor: "border-l-4 border-blue-600",
    },
    on_hold: {
      label: "On Hold",
      icon: "mdi:pause-circle",
      color: "text-yellow-600",
      badgeColor: "bg-yellow-100 text-yellow-800",
      borderColor: "border-l-4 border-yellow-600",
    },
    completed: {
      label: "Completed",
      icon: "mdi:check-circle",
      color: "text-green-600",
      badgeColor: "bg-green-100 text-green-800",
      borderColor: "border-l-4 border-green-600",
    },
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  if (error) {
    return <ErrorState message={error} onRetry={onRefetch} />;
  }

  if (loading) {
    // Using placeholder, you can replace with your shimmer loader if needed
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-16 bg-gray-200"></div>
            <div className="space-y-3 p-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalProjects = projects.length;

  if (totalProjects === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="space-y-6">
        {(Object.keys(groupedProjects) as Array<keyof typeof groupedProjects>).map(
          (statusKey) => {
            const projectsInSection = groupedProjects[statusKey];
            const config = statusConfig[statusKey];
            const isExpanded = expandedSections[statusKey];

            return (
              <div key={statusKey} className="rounded-lg overflow-hidden border border-gray-200">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(statusKey)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between border-b border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      icon={config.icon}
                      className={`text-xl ${config.color}`}
                    />
                    <div className="text-left">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {config.label}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {projectsInSection.length}{" "}
                        {projectsInSection.length === 1 ? "project" : "projects"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${config.badgeColor}`}
                    >
                      {projectsInSection.length}
                    </span>
                    <Icon
                      icon={
                        isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"
                      }
                      className="text-xl text-gray-400"
                    />
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && projectsInSection.length > 0 && (
                  <div className="divide-y divide-gray-200 bg-white">
                    {projectsInSection.map((project) => (
                      <div
                        key={project._id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${config.borderColor}`}
                      >
                        <ProjectCard
                          project={project}
                          onView={handleViewProject}
                          onDelete={onDelete}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty Section */}
                {isExpanded && projectsInSection.length === 0 && (
                  <div className="px-6 py-8 text-center bg-white">
                    <p className="text-sm text-gray-500">
                      No projects in this section
                    </p>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>

      {/* Project Detail Side Panel */}
      <ProjectDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={selectedProject}
        onDelete={onDelete}
      />
    </>
  );
};

export default ProjectListGrouped;
