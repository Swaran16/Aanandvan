/**
 * Common utility functions used across the app.
 * Pure functions — no side effects, no dependencies on React.
 */

// ─── String Utilities ────────────────────────────────────────────────────────

/** Capitalizes the first letter of a string */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/** Truncates a string with ellipsis if it exceeds maxLength */
export const truncate = (str: string, maxLength: number): string =>
  str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;

/** Returns initials from a full name (e.g., "John Doe" → "JD") */
export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

// ─── Number Utilities ────────────────────────────────────────────────────────

/** Clamps a number between min and max values */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Formats a number as a compact string (e.g., 1500 → "1.5K") */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

// ─── Date Utilities ──────────────────────────────────────────────────────────

/** Returns a human-readable relative time string (e.g., "2 hours ago") */
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/** Formats a date string to a readable format (e.g., "Nov 1, 2026") */
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// ─── Validation Utilities ─────────────────────────────────────────────────────

/** Validates an email address format */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Validates a password (min 8 chars, at least one uppercase, one number) */
export const isValidPassword = (password: string): boolean =>
  password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

/** Validates a phone number (basic international format) */
export const isValidPhone = (phone: string): boolean =>
  /^\+?[\d\s\-()]{7,15}$/.test(phone);

// ─── Misc Utilities ───────────────────────────────────────────────────────────

/** Delays execution for a given number of milliseconds */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Generates a simple unique ID string */
export const generateId = (): string =>
  Math.random().toString(36).substring(2, 11);
