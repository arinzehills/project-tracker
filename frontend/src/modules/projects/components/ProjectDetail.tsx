"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../types/project";
import { usePatch } from "@/core/hooks/usePatch";
import UpdateStateListComponent from "./UpdateStateListComponent";
import { getDaysRemaining } from "../utils/getDaysRemaining";
import { formatDateRange, formatMetadataDate } from "../utils/dateFormatter";
import Button from "@/components/Button";
import ConfirmModal from "@/components/AnimatedModal/ConfirmModal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!project) return;
    onDelete(project._id);
    setIsDeleteModalOpen(false);
    onClose();
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

                  {/* Project Duration */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                      Project Duration
                    </p>
                    <div
                      className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 mb-4 w-[200px]"
                      style={{ width: 300 }}
                    >
                      <Icon
                        icon="mdi:calendar"
                        className="text-lg text-gray-600"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDateRange(project.startDate, project.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Time Remaining Card */}
                  <div
                    className="rounded-xl p-2 rounded-lg flex items-center justify-between"
                    style={{
                      background: "linear-gradient(to right, #e9d5ff, #f3e8ff)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                        <Icon
                          icon="mdi:clock-outline"
                          className="text-xl text-black"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-medium">
                          Time Remaining
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-gray-900">
                        {getDaysRemaining(project)}
                      </p>
                      <Icon
                        icon="mdi:information-outline"
                        className="text-xl text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-4 border-t border-gray-200 space-y-3 mb-8 mt-8 flex gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Created
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatMetadataDate(project.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium ">
                        Last Updated
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatMetadataDate(project.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200 mt-10">
                    <Button
                      buttonColor="bg-white"
                      textColor="text-black"
                      borderClass="border border-black-200"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleDeleteClick}
                      width="12"
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                    >
                      <Icon icon="mdi:delete" className="text-lg" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {project && (
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
      )}
    </AnimatePresence>
  );
};

export default ProjectDetail;
