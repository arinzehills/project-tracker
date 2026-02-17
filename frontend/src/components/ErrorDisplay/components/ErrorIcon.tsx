// components/ErrorIcon.tsx - Error icon component
import React from 'react';
import { Icon } from "@iconify/react";
import { ErrorType, ErrorConfig, SizeConfig } from '../types';

interface ErrorIconProps {
  type: ErrorType;
  config: ErrorConfig;
  sizeConfig: SizeConfig;
  customIcon?: string;
}

const ErrorIcon: React.FC<ErrorIconProps> = ({
  config,
  sizeConfig,
  customIcon
}) => {
  const displayIcon = customIcon || config.icon;

  return (
    <div className="flex justify-center mb-4">
      <Icon
        icon={displayIcon}
        className={`${sizeConfig.icon} ${config.color}`}
      />
    </div>
  );
};

export default ErrorIcon;
