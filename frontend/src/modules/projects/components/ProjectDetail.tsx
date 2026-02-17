"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../types/project";
import { usePatch } from "@/core/hooks/usePatch";
import UpdateStateListComponent from "./UpdateStateListComponent";

interface ProjectDetailProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onDelete: (projectId: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  isOpen,
  onClose,
  project,
  onDelete,
}) => {
  const [currentStatus, setCurrentStatus] = useState(
    project?.status || "active",
  );
  const [currentPriority, setCurrentPriority] = useState(
    project?.priority || "medium",
  );
  const { updateItem } = usePatch();

  // Update when project changes
  useEffect(() => {
    if (project) {
      setCurrentStatus(project.status);
      setCurrentPriority(project.priority);
    }
  }, [project]);

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

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!project?.endDate) return "N/A";
    const endDate = new Date(project.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return "Due today";
    return `${diffDays} days remaining`;
  };

  const handleDelete = () => {
    if (!project) return;
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete(project._id);
      onClose();
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project) return;
    try {
      await updateItem(
        `/projects/${project._id}`,
        {
          status: newStatus,
        },
        {
          canToastSuccess: true,
          invalidate: "projects",
        },
      );
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      setCurrentStatus(project.status);
    }
  };

  const handlePriorityUpdate = async (newPriority: string) => {
    if (!project) return;
    try {
      await updateItem(
        `/projects/${project._id}`,
        {
          priority: newPriority,
        },
        {
          canToastSuccess: true,
          invalidate: "projects",
        },
      );
      setCurrentPriority(newPriority);
    } catch (error) {
      console.error("Failed to update priority:", error);
      setCurrentPriority(project.priority);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {project && (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Project Details
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    aria-label="Close panel"
                  >
                    <Icon icon="mdi:close" className="text-2xl text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Project Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {project.clientName}
                    </p>
                  </div>

                  {/* Status and Priority Updaters */}
                  <div className=" flex items-center gap-12 mt-8 mb-8">
                    <UpdateStateListComponent
                      currentValue={currentStatus}
                      label="Status"
                      type="status"
                      options={[
                        {
                          label: "Active",
                          value: "active",
                          color: statusColors.active,
                        },
                        {
                          label: "On Hold",
                          value: "on_hold",
                          color: statusColors.on_hold,
                        },
                        {
                          label: "Completed",
                          value: "completed",
                          color: statusColors.completed,
                        },
                      ]}
                      onUpdate={handleStatusUpdate}
                    />

                    <UpdateStateListComponent
                      currentValue={currentPriority}
                      label="Priority"
                      type="priority"
                      options={[
                        {
                          label: "High",
                          value: "high",
                          color: priorityColors.high,
                        },
                        {
                          label: "Medium",
                          value: "medium",
                          color: priorityColors.medium,
                        },
                        {
                          label: "Low",
                          value: "low",
                          color: priorityColors.low,
                        },
                      ]}
                      onUpdate={handlePriorityUpdate}
                    />
                  </div>

                  {/* Dates */}
                  <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="mdi:calendar-start"
                        className="text-2xl text-purple-600"
                      />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          Start Date
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(project.startDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {project.endDate && (
                      <div className="flex items-center gap-3 pt-3 border-t border-purple-100">
                        <Icon
                          icon="mdi:calendar-end"
                          className="text-2xl text-pink-600"
                        />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            End Date
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(project.endDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time Remaining Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
                    <div className="flex items-start gap-4">
                      <Icon
                        icon="mdi:clock-outline"
                        className="text-3xl text-indigo-600 mt-1"
                      />
                      <div>
                        <p className="text-xs text-gray-600 font-medium uppercase">
                          Time Remaining
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          {getDaysRemaining()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Created
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(project.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:delete" className="text-lg" />
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetail;
