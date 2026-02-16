// components/ErrorIcon.tsx - Error icon component
import React from 'react';
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
import notFoundAnimation from "../../../../public/lottie/404animation.json";
import { ErrorType, ErrorConfig, SizeConfig } from '../types';

interface ErrorIconProps {
  type: ErrorType;
  config: ErrorConfig;
  sizeConfig: SizeConfig;
  customIcon?: string;
}

const ErrorIcon: React.FC<ErrorIconProps> = ({
  type,
  config,
  sizeConfig,
  customIcon
}) => {
  const displayIcon = customIcon || config.icon;

  if (type === "not-found") {
    return (
      <Lottie
        animationData={notFoundAnimation}
        loop={true}
        className="mx-auto w-40 mb-4"
      />
    );
  }

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
