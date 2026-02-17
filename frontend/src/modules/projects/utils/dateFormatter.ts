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
 * Format date range (start - end)
 */
export const formatDateRange = (
  startDate: string | Date,
  endDate?: string | Date
): string => {
  const start = formatDate(startDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!endDate) return start;
  const end = formatDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
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
