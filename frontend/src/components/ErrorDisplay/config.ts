// config.ts - ErrorDisplay configuration objects
import { ErrorType, ErrorConfig, SizeConfig, ErrorSize, ErrorVariant } from './types';

// Error type configurations
export const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
  network: {
    title: "Connection Error",
    icon: "fluent:cloud-error-48-filled",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  validation: {
    title: "Validation Error",
    icon: "mdi:alert-circle-outline",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  payment: {
    title: "Payment Error",
    icon: "mdi:credit-card-remove",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  auth: {
    title: "Authentication Error",
    icon: "mdi:account-lock",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  "not-found": {
    title: "Not Found",
    icon: "mdi:file-question-outline",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  server: {
    title: "Server Error",
    icon: "fluent:cloud-error-48-filled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  generic: {
    title: "Error",
    icon: "mdi:alert-circle",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

// Size configurations
export const SIZE_CONFIGS: Record<ErrorSize, SizeConfig> = {
  sm: {
    icon: "h-8 w-8",
    title: "text-lg",
    message: "text-sm",
    container: "p-4",
    button: "text-sm px-3 py-2",
  },
  md: {
    icon: "h-12 w-12",
    title: "text-xl",
    message: "text-base",
    container: "p-6",
    button: "px-4 py-2",
  },
  lg: {
    icon: "h-16 w-16",
    title: "text-2xl",
    message: "text-lg",
    container: "p-8",
    button: "px-6 py-3",
  },
};

// Utility functions
export const getErrorConfig = (errorType: ErrorType): ErrorConfig => {
  return ERROR_CONFIGS[errorType];
};

export const getSizeConfig = (size: ErrorSize): SizeConfig => {
  return SIZE_CONFIGS[size];
};

export const getVariantStyles = (
  variant: ErrorVariant,
  config: ErrorConfig,
  sizeConfig: SizeConfig
): string => {
  switch (variant) {
    case "inline":
      return `${config.bgColor} ${config.borderColor} border rounded-md ${sizeConfig.container}`;
    case "page":
      return "min-h-[50vh] flex items-center justify-center";
    case "card":
    default:
      return `${config.bgColor} ${config.borderColor} border rounded-lg shadow-sm ${sizeConfig.container}`;
  }
};
