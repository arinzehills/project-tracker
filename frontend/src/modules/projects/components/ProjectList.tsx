"use client";

import { useState, useRef, useEffect } from "react";
import { useProjects } from "@/core/hooks/useProjects";
import { refreshRegistry } from "@/core/hooks/useRefreshRegistry";
import { useDelete } from "@/core/hooks/useDelete";
import { ProjectListShimmer } from "@/components/Loaders/ShimmerLoader";
import { Project } from "../types/project";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProjectDetail from "./ProjectDetail";
import ConfirmModal from "@/components/AnimatedModal/ConfirmModal";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";

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

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard = ({ project, onView, onDelete }: ProjectCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(project._id);
    setIsDeleteModalOpen(false);
  };

  const handleView = () => {
    onView(project);
    setIsMenuOpen(false);
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all p-4 cursor-pointer"
      onClick={() => onView(project)}
    >
      {/* Header - Title and Badges */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500">{project.clientName}</p>
        </div>
        <div className="flex gap-2 items-start">
          <div className="flex gap-2">
            <StatusBadge
              status={project.status}
              size="md"
            />
            <PriorityBadge
              priority={project.priority}
              size="md"
            />
          </div>

          {/* More Options Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700"
              aria-label="More options"
            >
              <Icon icon="mdi:dots-vertical" className="text-xl" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center gap-2 first:rounded-t-lg"
                >
                  <Icon icon="mdi:eye" className="text-lg" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 last:rounded-b-lg"
                >
                  <Icon icon="mdi:delete" className="text-lg" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <Icon icon="fluent:calendar-12-filled" className="text-lg" />
        <div>
          <p className="text-gray-500 text-xs mb-1">Start Date</p>
          <p className="text-gray-900 font-medium">
            {new Date(project.startDate).toLocaleDateString()}
          </p>
        </div>
        {project.endDate && (
          <div>
            <p className="text-gray-500 text-xs mb-1">End Date</p>
            <p className="text-gray-900 font-medium">
              {new Date(project.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        openModal={isDeleteModalOpen}
        setOpenModal={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        type="delete"
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProjectList;
