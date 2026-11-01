/**
 * API Service — Base HTTP Client
 *
 * Centralizes all HTTP requests with:
 *  - Base URL configuration
 *  - Auth token injection
 *  - Standard error handling
 *  - Request/response typing
 *
 * Usage:
 *   const data = await api.get<User>('/users/me');
 *   const result = await api.post<LoginResponse>('/auth/login', { email, password });
 */

import { ApiResponse } from '@/types';

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';
const TIMEOUT_MS = 15_000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns auth headers. Swap out the token source as needed. */
const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  // Authorization: `Bearer ${getToken()}`,
});

/** Handles response parsing and throws typed errors */
const handleResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
  const json = await res.json();
  if (!res.ok) {
    throw {
      message: json.message ?? 'An unexpected error occurred',
      statusCode: res.status,
      errors: json.errors,
    };
  }
  return json as ApiResponse<T>;
};

// ─── HTTP Methods ─────────────────────────────────────────────────────────────

const get = async <T>(path: string): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: getHeaders(),
      signal: controller.signal,
    });
    return handleResponse<T>(res);
  } finally {
    clearTimeout(timer);
  }
};

const post = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return handleResponse<T>(res);
  } finally {
    clearTimeout(timer);
  }
};

const put = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return handleResponse<T>(res);
  } finally {
    clearTimeout(timer);
  }
};

const del = async <T>(path: string): Promise<ApiResponse<T>> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
      signal: controller.signal,
    });
    return handleResponse<T>(res);
  } finally {
    clearTimeout(timer);
  }
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const api = { get, post, put, delete: del };
