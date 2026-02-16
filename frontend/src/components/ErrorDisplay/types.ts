// types.ts - ErrorDisplay type definitions
export type ErrorType =
  | "network"
  | "validation"
  | "payment"
  | "auth"
  | "not-found"
  | "server"
  | "generic";

export type ErrorSize = "sm" | "md" | "lg";
export type ErrorVariant = "card" | "inline" | "page";

export interface ErrorDisplayProps {
  /** The error message to display */
  message: string;

  /** Type of error - affects icon and styling */
  type?: ErrorType;

  /** Custom title - if not provided, will use default based on type */
  title?: string;

  /** Show retry button */
  showRetry?: boolean;

  /** Custom retry button text */
  retryText?: string;

  /** Retry button click handler */
  onRetry?: () => void;

  /** Show home/dashboard button */
  showHome?: boolean;

  /** Custom home button text */
  homeText?: string;

  /** Home button click handler */
  onHome?: () => void;

  /** Custom icon override */
  customIcon?: string;

  /** Size variant */
  size?: ErrorSize;

  /** Layout variant */
  variant?: ErrorVariant;

  /** Additional CSS classes */
  className?: string;

  /** Show error details in collapsed section */
  showDetails?: boolean;

  /** Technical error details */
  details?: string;
}

export interface ErrorConfig {
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface SizeConfig {
  icon: string;
  title: string;
  message: string;
  container: string;
  button: string;
}
