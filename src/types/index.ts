/**
 * Global TypeScript Types & Interfaces
 * Shared types used across the entire application.
 */

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  '(tabs)': undefined;
  '+not-found': undefined;
};

// ─── API ─────────────────────────────────────────────────────────────────────

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

/** Generic paginated response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

/** API error structure */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Common UI ───────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type InputVariant = 'default' | 'filled' | 'underline';
export type InputSize = 'sm' | 'md' | 'lg';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'label'
  | 'overline';

// ─── Theme ───────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';
