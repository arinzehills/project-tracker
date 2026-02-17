"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Project } from "../types/project";
import { formatDate } from "../utils/dateFormatter";

interface ProjectGridCardProps {
  project: Project;
  onView: (project: Project) => void;
  onDelete: (projectId: string) => Promise<void>;
}

const ProjectGridCard: React.FC<ProjectGridCardProps> = ({
  project,
  onView,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusColors: Record<string, { bg: string; text: string }> = {
    active: { bg: "bg-green-100", text: "text-green-800" },
    on_hold: { bg: "bg-yellow-100", text: "text-yellow-800" },
    completed: { bg: "bg-blue-100", text: "text-blue-800" },
  };

  const priorityColors: Record<string, { bg: string; text: string }> = {
    high: { bg: "bg-red-100", text: "text-red-800" },
    medium: { bg: "bg-purple-100", text: "text-purple-800" },
    low: { bg: "bg-lime-100", text: "text-lime-800" },
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        await onDelete(project._id);
        setIsMenuOpen(false);
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const statusColor = statusColors[project.status] || statusColors.active;
  const priorityColor =
    priorityColors[project.priority] || priorityColors.medium;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col max-h-80"
      style={{ maxHeight: 150 }}
      onClick={() => {
        onView(project);
        setIsMenuOpen(false);
      }}
    >
      {/* Header: Name, Client, and Menu Button */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500 truncate">{project.clientName}</p>
        </div>

        {/* Menu Button - Top Right */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon icon="mdi:dots-vertical" className="text-lg text-gray-400" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border border-gray-200 z-10 min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(project);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2 border-b border-gray-200"
              >
                <Icon icon="mdi:eye" className="w-4 h-4" />
                View
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(e);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600 flex items-center gap-2"
              >
                <Icon icon="mdi:trash" className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex gap-2 mb-4">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${statusColor.bg} ${statusColor.text} capitalize`}
        >
          {project.status.replace("_", " ")}
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${priorityColor.bg} ${priorityColor.text} capitalize`}
        >
          {project.priority}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Dates - at the bottom */}
      <div className="flex items-center justify-between text-xs text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:calendar-start" className="w-3 h-3" />
          <span>Start: {formatDate(project.startDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="mdi:calendar-end" className="w-3 h-3" />
          <span>End: {formatDate(project.endDate!)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectGridCard;
