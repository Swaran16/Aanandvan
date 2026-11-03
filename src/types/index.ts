/**
 * Global TypeScript Types & Interfaces — Aanandvan Platform
 */

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
}

export type PlantationStatus =
  | 'pending'
  | 'verified'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface ScheduleDetails {
  date: string;
  timeSlot: string; // e.g. "Morning (8:00 AM - 11:00 AM)"
  checklist: string[];
  notes?: string;
  confirmedAt?: string;
  isApprovedByAdmin: boolean;
}

export interface ActivityReport {
  beforePhotos: string[];
  afterPhotos: string[];
  saplingsPlanted: number;
  date: string;
  notes: string;
}

export interface PlantationRequest {
  id: string; // e.g. "REQ-2024-0042"
  title: string;
  description: string;
  location: string;
  manualAddress: string;
  landmark: string;
  coordinates: string; // "34.0522° N, 118.2437° W"
  areaPhotos: string[];
  landmarkPhotos: string[];
  status: PlantationStatus;
  createdAt: string;
  distanceKm?: number;
  duplicateRisk?: 'None detected' | 'Potential match';
  
  // Citizen Details
  citizenId: string;
  citizenName: string;
  citizenEmail?: string;
  citizenPhone?: string;
  citizenAvatar?: string;
  
  // Volunteer Details
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedVolunteerAvatar?: string;
  assignedVolunteerPhone?: string;
  assignedVolunteerLevel?: string;
  assignedVolunteerPlantations?: number;
  
  // Scheduling & Completion
  schedule?: ScheduleDetails;
  activityReport?: ActivityReport;
}

export type VolunteerStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface VolunteerApplication {
  id: string;
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
  adminNotes?: string;
  plantationsCount?: number;
  lastActive?: string;
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

export interface PlatformMetrics {
  totalVolunteers: number;
  totalRequests: number;
  totalTreesPlanted: number;
  pendingVerifications: number;
  activeRequests: number;
  availableForVolunteers: number;
  maintenanceDue: number;
}
