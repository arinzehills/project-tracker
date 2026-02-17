"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Project } from "../types/project";
import ProjectGridCard from "./ProjectGridCard";
import ProjectDetail from "./ProjectDetail";
import ErrorState from "@/components/States/ErrorState";
import EmptyState from "@/components/States/EmptyState";

interface ProjectGridGroupedProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onRefetch: () => void;
  onDelete: (projectId: string) => Promise<void>;
}

const ProjectGridGrouped = ({
  projects,
  loading,
  error,
  onRefetch,
  onDelete,
}: ProjectGridGroupedProps) => {
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
    },
    on_hold: {
      label: "On Hold",
      icon: "mdi:pause-circle",
      color: "text-yellow-600",
      badgeColor: "bg-yellow-100 text-yellow-800",
    },
    completed: {
      label: "Completed",
      icon: "mdi:check-circle",
      color: "text-green-600",
      badgeColor: "bg-green-100 text-green-800",
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
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="h-48 bg-gray-100 rounded-lg animate-pulse"
                ></div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(Object.keys(groupedProjects) as Array<keyof typeof groupedProjects>).map(
          (statusKey) => {
            const projectsInSection = groupedProjects[statusKey];
            const config = statusConfig[statusKey];
            const isExpanded = expandedSections[statusKey];

            return (
              <div
                key={statusKey}
                className="rounded-lg border border-gray-200 overflow-hidden bg-white flex flex-col"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(statusKey)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <Icon
                      icon={config.icon}
                      className={`text-2xl ${config.color} flex-shrink-0`}
                    />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {config.label}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {projectsInSection.length}{" "}
                        {projectsInSection.length === 1 ? "project" : "projects"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
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

                {/* Section Content - Vertical Stack */}
                {isExpanded && projectsInSection.length > 0 && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {projectsInSection.map((project) => (
                      <ProjectGridCard
                        key={project._id}
                        project={project}
                        onView={handleViewProject}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}

                {/* Empty Section */}
                {isExpanded && projectsInSection.length === 0 && (
                  <div className="flex-1 flex items-center justify-center py-8 text-gray-500">
                    <p className="text-sm">No projects</p>
                  </div>
                )}

                {/* Collapsed State */}
                {!isExpanded && projectsInSection.length > 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-xs">Click to expand</p>
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

export default ProjectGridGrouped;
