// ErrorDisplay.tsx - Clean, modularized error display component
import React from "react";
import { ErrorDisplayProps } from "./types";
import { getErrorConfig, getSizeConfig, getVariantStyles } from "./config";
import ErrorIcon from "./components/ErrorIcon";
import ErrorDetails from "./components/ErrorDetails";
import Button from "@components/Button";
import { Icon } from "@iconify/react/dist/iconify.js";

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  type = "generic",
  title,
  showRetry = false,
  retryText = "Try Again",
  onRetry,
  showHome = false,
  homeText = "Go Home",
  onHome,
  customIcon,
  size = "md",
  variant = "card",
  className = "",
  showDetails = false,
  details,
}) => {
  // Get configurations
  const config = getErrorConfig(type);
  const sizeConfig = getSizeConfig(size);
  const displayTitle = title || config.title;

  // Build container classes
  const variantStyles = getVariantStyles(variant, config, sizeConfig);
  const containerClasses = `${variantStyles} ${className}`;

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Error Icon */}
        <ErrorIcon
          type={type}
          config={config}
          sizeConfig={sizeConfig}
          customIcon={customIcon}
        />

        {/* Error Title */}
        <h3 className={`${sizeConfig.title} font-semibold text-gray-900 mb-2`}>
          {displayTitle}
        </h3>

        {/* Error Message */}
        <p className={`${sizeConfig.message} text-gray-600 mb-4`}>{message}</p>

        {/* Error Details (Collapsible) */}
        <ErrorDetails details={details || ""} showDetails={showDetails} />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              height="10"
              buttonColor="bg-blue-600 hover:bg-blue-700 text-white"
              prefixIcon={<Icon icon="mdi:refresh" className="h-4 w-4" />}
            >
              {retryText}
            </Button>
          )}

          {showHome && onHome && (
            <Button
              onClick={onHome}
              height="10"
              suffixIcon={
                <Icon icon="iconamoon:arrow-top-right-1" className="h-4 w-4" />
              }
            >
              {homeText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
