"use client";

import { useState } from "react";
import { useProjects } from "@/core/hooks/useProjects";

import { useDelete } from "@/core/hooks/useDelete";
import { ProjectListShimmer } from "@/components/Loaders/ShimmerLoader";
import { Project } from "../types/project";

import ProjectDetail from "./ProjectDetail";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

const ProjectList = ({
  status,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
}: ProjectListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { projects, loading, error, refetch } = useProjects({
    status,
    search,
    sortBy,
    sortOrder,
  });
  const { deleteItem } = useDelete();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error loading projects
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return <ProjectListShimmer count={6} />;
  }

  if (projects.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No projects found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or create a new project to get started.
        </p>
      </div>
    );
  }

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteItem(`/projects/${projectId}`, {
        canToastSuccess: true,
        invalidate: "projects",
      });
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <>
      <div className="space-y-3 gap-3 flex flex-col">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onView={handleViewProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {/* Project Detail Side Panel */}
      <ProjectDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        project={selectedProject}
        onDelete={handleDeleteProject}
      />
    </>
  );
};

export default ProjectList;
