/**
 * Format a single date
 */
export const formatDate = (
  date: string | Date,
  options: {
    month?: "short" | "long" | "2-digit" | "numeric";
    year?: "numeric" | "2-digit";
    day?: "numeric" | "2-digit";
  } = { month: "short", day: "numeric", year: "numeric" }
): string => {
  return new Date(date).toLocaleDateString("en-US", options);
};

/**
 * Format date with time
 */
export const formatDateTime = (
  date: string | Date,
  options: {
    month?: "short" | "long" | "2-digit" | "numeric";
    year?: "numeric" | "2-digit";
    day?: "numeric" | "2-digit";
    hour?: "numeric" | "2-digit";
    minute?: "numeric" | "2-digit";
    hour12?: boolean;
  } = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }
): string => {
  return new Date(date).toLocaleDateString("en-US", options as Intl.DateTimeFormatOptions);
};

/**
 * Format date range (start - end) with time
 */
export const formatDateRange = (
  startDate: string | Date,
  endDate?: string | Date
): string => {
  const start = formatDateTime(startDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  if (!endDate) return start;
  const end = formatDateTime(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${start} - ${end}`;
};

/**
 * Format date for metadata (created, updated)
 */
export const formatMetadataDate = (date: string | Date): string => {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date for full display
 */
export const formatFullDate = (date: string | Date): string => {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
