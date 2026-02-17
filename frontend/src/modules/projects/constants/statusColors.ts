/**
 * Centralized status and priority color definitions
 * Used across all project components for consistent theming
 */

export const statusColors: Record<string, { bg: string; text: string }> = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
  on_hold: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
  },
};

export const priorityColors: Record<string, { bg: string; text: string }> = {
  high: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
  medium: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
  },
  low: {
    bg: 'bg-lime-100',
    text: 'text-lime-800',
  },
};
