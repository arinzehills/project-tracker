import React from "react";

// Define all possible status types
export type StatusType =
  // Transaction statuses
  | "successful"
  | "completed"
  | "pending"
  | "cancelled"
  | "reversed"
  | "failed"
  // User statuses
  | "active"
  | "banned"
  | "suspended"
  // Subscription statuses
  | "in-progress"
  | "complete"
  // General statuses
  | "approved"
  | "rejected"
  | "draft"
  | "published"
  // Project statuses
  | "on_hold";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  size = "md",
}) => {
  // Define status configurations
  const statusConfig: Record<
    StatusType,
    { bgColor: string; textColor: string; text: string }
  > = {
    // Transaction statuses
    successful: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      text: "Successful",
    },
    completed: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      text: "Completed",
    },
    pending: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      text: "Pending",
    },
    cancelled: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      text: "Cancelled",
    },
    reversed: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      text: "Reversed",
    },
    failed: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      text: "Failed",
    },

    // User statuses
    active: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      text: "Active",
    },
    banned: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      text: "Banned",
    },
    suspended: {
      bgColor: "bg-orange-100",
      textColor: "text-orange-700",
      text: "Suspended",
    },

    // Subscription statuses
    "in-progress": {
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      text: "In Progress",
    },
    complete: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      text: "Complete",
    },

    // General statuses
    approved: {
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      text: "Approved",
    },
    rejected: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      text: "Rejected",
    },
    draft: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      text: "Draft",
    },
    published: {
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      text: "Published",
    },

    // Project statuses
    on_hold: {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      text: "On Hold",
    },
  };

  // Size configurations
  const sizeConfig = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];

  if (!config) {
    console.warn(`StatusBadge: Unknown status "${status}"`);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ${className}`}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={`${config.bgColor} ${config.textColor} ${sizeClasses} flex items-center justify-center rounded-full font-medium ${className}`}
    >
      {config.text}
    </span>
  );
};

export default StatusBadge;
