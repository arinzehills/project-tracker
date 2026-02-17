import React from "react";

export type PriorityType = "high" | "medium" | "low";

interface PriorityBadgeProps {
  priority: PriorityType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = "",
  size = "md",
}) => {
  // Define priority configurations
  const priorityConfig: Record<
    PriorityType,
    { bgColor: string; textColor: string; text: string }
  > = {
    high: {
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      text: "High Priority",
    },
    medium: {
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      text: "Medium Priority",
    },
    low: {
      bgColor: "bg-lime-100",
      textColor: "text-lime-700",
      text: "Low Priority",
    },
  };

  // Size configurations
  const sizeConfig = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const config = priorityConfig[priority];
  const sizeClasses = sizeConfig[size];

  if (!config) {
    console.warn(`PriorityBadge: Unknown priority "${priority}"`);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ${className}`}
      >
        {priority}
      </span>
    );
  }

  return (
    <span
      className={`${config.bgColor} ${config.textColor} ${sizeClasses} flex items-center justify-center  rounded-full font-medium ${className}`}
    >
      {config.text}
    </span>
  );
};

export default PriorityBadge;
