import React, { useEffect, useRef, useState } from "react";

import ConfirmModal from "@/components/AnimatedModal/ConfirmModal";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Project } from "../types/project";

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
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900">
              {project.name}
            </h3>
            <p className="text-xs text-gray-500">{project.clientName}</p>
          </div>
          {/* Meta info */}
          <div
            className="flex items-center text-xs text-gray-500 mb-3 ml-3"
            style={{ marginLeft: "20px", gap: 9 }}
          >
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
        </div>
        <div className="flex gap-2 items-start">
          <div className="flex gap-2">
            <StatusBadge status={project.status} size="md" />
            <PriorityBadge priority={project.priority} size="md" />
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

export default ProjectCard;
