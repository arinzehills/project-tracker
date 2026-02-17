import React from "react";
import { Icon } from "@iconify/react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No projects found",
  message = "Try adjusting your filters or create a new project to get started.",
  icon = "mdi:folder-open",
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
      <Icon icon={icon} className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;
