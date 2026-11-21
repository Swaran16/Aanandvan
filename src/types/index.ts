/**
 * Global TypeScript Types & Interfaces — Aanandvan Platform
 */

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

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ─── App Role & User ──────────────────────────────────────────────────────────
export type UserRole = 'citizen' | 'volunteer' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  role: UserRole;
  isVerified?: boolean;
  requestsCount?: number;
  verifiedRequestsCount?: number;
  treesCount?: number;
  isBlocked?: boolean;
  blockReason?: string;
}

export type PlantationStatus =
  | 'pending'
  | 'needs_info'
  | 'verified'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface ScheduleDetails {
  date: string;
  timeSlot: string; // e.g. "Morning (8:00 AM - 11:00 AM)"
  checklist?: string[];
  notes?: string;
  confirmedAt?: string;
  isApprovedByAdmin: boolean;
}

export interface ActivityReport {
  beforePhotos?: string[];
  afterPhotos?: string[];
  photos?: string[];
  saplingsPlanted: number;
  species?: string;
  date: string;
  notes: string;
  volunteerName?: string;
}

export interface NurturingUpdate {
  id: string;
  date: string;
  photos: string[];
  notes: string;
  volunteerName: string;
  volunteerId: string;
  actionsTaken?: string[];
}

export interface PlantationRequest {
  id: string; // e.g. "REQ-2024-0042"
  title: string;
  description: string;
  location: string;
  manualAddress: string;
  landmark: string;
  coordinates: string; // "19.0178° N, 72.8478° E"
  areaPhotos: string[];
  landmarkPhotos: string[];
  status: PlantationStatus;
  createdAt: string;
  distanceKm?: number;
  duplicateRisk?: 'None detected' | 'Potential match';

  // Citizen Details
  citizenId: string;
  citizenName: string;
  userId?: string;
  citizenEmail?: string;
  citizenPhone?: string;
  citizenAvatar?: string;

  // Volunteer Details
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  volunteerName?: string;
  assignedVolunteerAvatar?: string;
  assignedVolunteerPhone?: string;
  assignedVolunteerLevel?: string;
  assignedVolunteerPlantations?: number;

  // Scheduling, Plantation & Nurturing Thread
  schedule?: ScheduleDetails;
  activityReport?: ActivityReport;
  activityUpdate?: ActivityReport;
  nurturingUpdates?: NurturingUpdate[];
  adminClarificationNotes?: string;
  isTakenOverByAdmin?: boolean;
}

export type VolunteerStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface VolunteerApplication {
  id: string;
  volunteerCode: string; // e.g. "VOL-DAD-0104"
  name: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  address: string;
  coordinates: string;
  appliedDate: string;
  status: VolunteerStatus;
  avatar?: string;
  visionQuote: string;
  bio?: string;
  adminNotes?: string;
  plantationsCount?: number;
  lastActive?: string;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: string;
  acceptedDrivesCount?: number;
  completedDrivesCount?: number;
  ongoingDrivesCount?: number;
  lastActiveDate?: string;
}

export interface MaintenanceTimelineEvent {
  date: string;
  title: string;
  description: string;
  photo?: string;
}

export interface MaintenanceItem {
  id: string;
  treeName: string; // e.g. "Young White Oak #042"
  treeTag: string; // "#042"
  location: string;
  status: 'needs_water' | 'healthy' | 'pruning_needed';
  isUrgent: boolean;
  lastVisit: string;
  planterName: string;
  imageUrl: string;
  timeline: MaintenanceTimelineEvent[];
}

import type { IconName } from '@/components/common/Icon';

export interface PlatformMetrics {
  totalVolunteers: number;
  totalRequests: number;
  totalTreesPlanted: number;
  pendingVerifications: number;
  activeRequests: number;
  availableForVolunteers: number;
  maintenanceDue: number;
}

// ─── Notifications & Inbox ──────────────────────────────────────────────────
export interface AppNotificationItem {
  id: string;
  section: 'Today' | 'Earlier';
  title: string;
  body: string;
  time: string;
  icon: IconName;
  unread: boolean;
  requestId?: string;
}

export interface AdminInboxItem {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: IconName;
  unread: boolean;
  route: string;
  params?: Record<string, string>;
}
