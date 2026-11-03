import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  AppUser,
  PlantationRequest,
  VolunteerApplication,
  MaintenanceItem,
  ScheduleDetails,
  ActivityReport,
} from '@/types';

interface AppContextType {
  currentRole: UserRole;
  currentUser: AppUser;
  requests: PlantationRequest[];
  volunteers: VolunteerApplication[];
  maintenanceItems: MaintenanceItem[];
  
  // Role & Auth Actions
  switchRole: (role: UserRole) => void;
  loginAs: (role: UserRole, email?: string) => void;
  logout: () => void;
  
  // Request Lifecycle Actions
  createRequest: (data: Partial<PlantationRequest>) => PlantationRequest;
  verifyRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  volunteerAcceptRequest: (id: string) => void;
  volunteerScheduleRequest: (id: string, schedule: ScheduleDetails) => void;
  adminApproveSchedule: (id: string) => void;
  volunteerUploadActivity: (id: string, activity: ActivityReport) => void;
  
  // Volunteer Management Actions
  approveVolunteer: (id: string) => void;
  rejectVolunteer: (id: string) => void;
  saveVolunteerAdminNote: (id: string, note: string) => void;
  
  // Maintenance Actions
  addMaintenanceLog: (id: string, note: string) => void;
  waterTree: (id: string) => void;
}

const DEFAULT_USERS: Record<UserRole, AppUser> = {
  citizen: {
    id: 'user-citizen-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    role: 'citizen',
    isVerified: true,
    requestsCount: 12,
    verifiedRequestsCount: 8,
    treesCount: 24,
  },
  volunteer: {
    id: 'user-vol-1',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 98123 45678',
    city: 'Gurugram',
    role: 'volunteer',
    isVerified: true,
    requestsCount: 3,
    verifiedRequestsCount: 7,
    treesCount: 23,
  },
  admin: {
    id: 'user-admin-1',
    name: 'Aanandvan Admin',
    email: 'admin@aanandvan.in',
    phone: '+91 99999 00000',
    city: 'New Delhi',
    role: 'admin',
    isVerified: true,
  },
};

const INITIAL_REQUESTS: PlantationRequest[] = [
  {
    id: 'REQ-2024-0042',
    title: 'Oak Valley Reforestation',
    description:
      'This area requires immediate reforestation due to recent erosion. The soil is predominantly loam, suitable for White Oak. Please ensure to follow the grid planting method discussed during the briefing. Accessibility is good for small transport vehicles via the northern service road.',
    location: 'Greenwood North District, Area 4B',
    manualAddress:
      'Greenwood North District, Area 4B. Access via the service road near the old water tower, Sector 12, Los Angeles, CA.',
    landmark: 'Near the Old Water Tower',
    coordinates: '34.0522° N, 118.2437° W',
    areaPhotos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'assigned',
    createdAt: 'Oct 24, 2023',
    distanceKm: 1.2,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-1',
    citizenName: 'Rahul Sharma',
    citizenEmail: 'rahul.sharma@example.com',
    citizenPhone: '+91 98765 43210',
    assignedVolunteerId: 'user-vol-1',
    assignedVolunteerName: 'Amit Kumar',
    assignedVolunteerLevel: 'Level 4 • 25+ Plantations',
  },
  {
    id: 'REQ-8794',
    title: 'Mangrove Restoration',
    description:
      'Tidal zone wetland planting to fortify natural shoreline defense and promote marine ecosystem recovery.',
    location: 'East Creek Shoreline',
    manualAddress: 'Plot 18, East Creek Shoreline, Coastal Zone 3',
    landmark: 'Near Fisherman Jetty #4',
    coordinates: '18.9220° N, 72.8347° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'verified',
    createdAt: 'Oct 20, 2023',
    distanceKm: 2.5,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-2',
    citizenName: 'Sarah Miller',
    citizenEmail: 'sarah.m@example.com',
  },
  {
    id: 'REQ-8652',
    title: 'Cedar Buffer Zone',
    description:
      'Community buffer zone between residential avenue and bypass road for noise pollution mitigation.',
    location: 'Highland Community Center',
    manualAddress: 'Highland Community Center Grounds, Sector 21',
    landmark: 'Opposite Community Library',
    coordinates: '28.4595° N, 77.0266° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'in_progress',
    createdAt: 'Oct 15, 2023',
    distanceKm: 0.8,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-3',
    citizenName: 'Anil Kapoor',
    assignedVolunteerId: 'user-vol-1',
    assignedVolunteerName: 'Amit Kumar',
  },
  {
    id: 'REQ-8430',
    title: 'Urban Fruit Orchard',
    description:
      'Neighborhood orchard with native guava, pomegranate, and amla trees for community harvest.',
    location: 'Northside Commons',
    manualAddress: 'Northside Commons Open Grounds, Gate 2',
    landmark: 'Behind Public Solar Array',
    coordinates: '28.5355° N, 77.3910° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'completed',
    createdAt: 'Sep 28, 2023',
    citizenId: 'user-citizen-1',
    citizenName: 'Rahul Sharma',
    assignedVolunteerId: 'user-vol-2',
    assignedVolunteerName: 'James Wilson',
    assignedVolunteerLevel: 'Level 4 • 25+ Plantations',
  },
  {
    id: 'REQ-8211',
    title: 'Pine Hill Nursery Perimeter',
    description:
      'Perimeter green belt planting along Pine Hill Ridge to prevent dust accumulation.',
    location: 'Pine Hill Ridge',
    manualAddress: 'Ridge Road, North Ridge Enclave',
    landmark: 'Near Water Reservoir Tank 3',
    coordinates: '28.6139° N, 77.2090° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'pending',
    createdAt: 'Sep 15, 2023',
    citizenId: 'user-citizen-1',
    citizenName: 'Rahul Sharma',
  },
  {
    id: 'REQ-2024-0045',
    title: 'Greenwood Apartments, Noida Sector 76',
    description:
      'Community requested plantation drive. Space for 40 fruit trees along the north perimeter wall. Local soil tested fertile.',
    location: 'Greenwood Apartments, Sector 76',
    manualAddress: 'Block C, Row 12, Greenwood Apartments, Noida Sector 76',
    landmark: 'North Perimeter Gate',
    coordinates: '28.5678° N, 77.3821° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'pending',
    createdAt: '15 Jan 2025',
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-4',
    citizenName: 'Priya Desai',
  },
  {
    id: 'REQ-2024-0063',
    title: 'Heritage Public School',
    description:
      'School beautification drive. Planting 10 flowering cherry trees along the north walkway. Great for student participation.',
    location: 'Main Gate, North Campus, Heritage',
    manualAddress: 'Heritage Public School Campus, Sector 15',
    landmark: 'Opposite Administrative Wing',
    coordinates: '28.4800° N, 77.0800° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'verified',
    createdAt: '18 Jan 2025',
    distanceKm: 0.8,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-5',
    citizenName: 'Sunil Mathur',
  },
  {
    id: 'REQ-2024-0088',
    title: 'Riverbank Restoration',
    description:
      'Help prevent soil erosion by planting native riverbank vegetation. Tough terrain, sturdy footwear recommended.',
    location: 'Old Ferry Wharf, East Bank',
    manualAddress: 'Old Ferry Terminal Road, Riverfront East',
    landmark: 'Old Ferry Pier',
    coordinates: '28.6400° N, 77.2500° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'verified',
    createdAt: '20 Jan 2025',
    distanceKm: 4.1,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-6',
    citizenName: 'Vikram Batra',
  },
];

const INITIAL_VOLUNTEERS: VolunteerApplication[] = [
  {
    id: 'vol-app-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    city: 'Powai, Mumbai',
    pincode: '400076',
    address: 'Flat 402, Green Meadows Apartment, Powai, Mumbai, Maharashtra',
    coordinates: '19.1176° N, 72.9060° E',
    appliedDate: 'Oct 24, 2023',
    status: 'pending',
    visionQuote:
      'My vision for Aanandvan is to transform our local urban spaces into thriving green corridors. I am committed to community-led reforestation that not only improves our air quality but also creates a lasting legacy of environmental stewardship for the next generation.',
    adminNotes: 'Candidate has prior experience leading weekend youth eco-drives in Powai.',
  },
  {
    id: 'vol-app-2',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@workmail.com',
    phone: '+91 77220 11990',
    city: 'New Delhi',
    pincode: '110001',
    address: '14 Barakhamba Road, Connaught Place, New Delhi',
    coordinates: '28.6304° N, 77.2177° E',
    appliedDate: '12 Jan 2025',
    status: 'pending',
    visionQuote:
      'I want to bring urban terrace gardens and street canopy restoration to central Delhi.',
  },
  {
    id: 'vol-app-3',
    name: 'Rohan Verma',
    email: 'rohan.v@example.com',
    phone: '+91 99887 76655',
    city: 'Gurugram',
    pincode: '122001',
    address: 'DLF Phase 2, Gurugram, Haryana',
    coordinates: '28.4595° N, 77.0266° E',
    appliedDate: '05 Jan 2024',
    status: 'verified',
    plantationsCount: 23,
    lastActive: '2d ago',
    visionQuote: 'Dedicated to community park greening and indigenous tree planting.',
  },
];

const INITIAL_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'maint-1',
    treeName: 'Young White Oak #042',
    treeTag: '#042',
    location: 'Lincoln Park, Sector C',
    status: 'needs_water',
    isUrgent: true,
    lastVisit: 'Oct 12, 2023',
    planterName: 'Sarah Mitchell',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    timeline: [
      {
        date: 'Oct 12, 2023',
        title: 'Initial Plantation',
        description: 'Sapling planted with compost and primary protective mesh.',
      },
      {
        date: 'Oct 20, 2023',
        title: 'First Routine Water Log',
        description: 'Moisture level optimal, mulch checked.',
      },
    ],
  },
  {
    id: 'maint-2',
    treeName: 'Red Maple #109',
    treeTag: '#109',
    location: 'Heritage Square',
    status: 'healthy',
    isUrgent: false,
    lastVisit: 'Nov 02, 2023',
    planterName: 'Mark J. Peterson',
    imageUrl:
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
    timeline: [
      {
        date: 'Nov 02, 2023',
        title: 'Canopy Inspection',
        description: 'Strong foliage development, no pest activity detected.',
      },
    ],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentUser, setCurrentUser] = useState<AppUser>(DEFAULT_USERS.citizen);
  const [requests, setRequests] = useState<PlantationRequest[]>(INITIAL_REQUESTS);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(INITIAL_VOLUNTEERS);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(INITIAL_MAINTENANCE);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(DEFAULT_USERS[role]);
  };

  const loginAs = (role: UserRole, email?: string) => {
    setCurrentRole(role);
    const user = { ...DEFAULT_USERS[role] };
    if (email) user.email = email;
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentRole('citizen');
    setCurrentUser(DEFAULT_USERS.citizen);
  };

  // ─── Citizen Creates Request ─────────────────────────────────────────────
  const createRequest = (data: Partial<PlantationRequest>): PlantationRequest => {
    const newReqId = `REQ-2024-${String(requests.length + 43).padStart(4, '0')}`;
    const newReq: PlantationRequest = {
      id: newReqId,
      title: data.title || 'Community Plantation Drive',
      description: data.description || '',
      location: data.location || 'Local Green Belt',
      manualAddress: data.manualAddress || data.location || '',
      landmark: data.landmark || 'Near Main Entrance',
      coordinates: data.coordinates || '28.6139° N, 77.2090° E',
      areaPhotos: data.areaPhotos?.length
        ? data.areaPhotos
        : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'],
      landmarkPhotos: data.landmarkPhotos || [],
      status: 'pending',
      createdAt: 'Just now',
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      citizenPhone: currentUser.phone,
      duplicateRisk: 'None detected',
    };

    setRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  // ─── Admin Verifies Request ──────────────────────────────────────────────
  const verifyRequest = (id: string) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'verified' } : req))
    );
  };

  // ─── Admin Rejects Request ───────────────────────────────────────────────
  const rejectRequest = (id: string) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'rejected' } : req))
    );
  };

  // ─── Volunteer Accepts Request ───────────────────────────────────────────
  const volunteerAcceptRequest = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'assigned',
              assignedVolunteerId: currentUser.id,
              assignedVolunteerName: currentUser.name,
              assignedVolunteerLevel: 'Verified Volunteer',
            }
          : req
      )
    );
  };

  // ─── Volunteer Schedules Request ─────────────────────────────────────────
  const volunteerScheduleRequest = (id: string, schedule: ScheduleDetails) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'scheduled',
              schedule: { ...schedule, isApprovedByAdmin: false },
            }
          : req
      )
    );
  };

  // ─── Admin Confirms Scheduled Drive ──────────────────────────────────────
  const adminApproveSchedule = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'in_progress',
              schedule: req.schedule ? { ...req.schedule, isApprovedByAdmin: true } : undefined,
            }
          : req
      )
    );
  };

  // ─── Volunteer Completes Plantation ──────────────────────────────────────
  const volunteerUploadActivity = (id: string, activity: ActivityReport) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'completed',
              activityReport: activity,
            }
          : req
      )
    );
  };

  // ─── Admin Volunteer Management ──────────────────────────────────────────
  const approveVolunteer = (id: string) => {
    setVolunteers(prev =>
      prev.map(vol => (vol.id === id ? { ...vol, status: 'verified' } : vol))
    );
  };

  const rejectVolunteer = (id: string) => {
    setVolunteers(prev =>
      prev.map(vol => (vol.id === id ? { ...vol, status: 'rejected' } : vol))
    );
  };

  const saveVolunteerAdminNote = (id: string, note: string) => {
    setVolunteers(prev =>
      prev.map(vol => (vol.id === id ? { ...vol, adminNotes: note } : vol))
    );
  };

  // ─── Maintenance Actions ─────────────────────────────────────────────────
  const addMaintenanceLog = (id: string, note: string) => {
    setMaintenanceItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              timeline: [
                { date: 'Today', title: 'Volunteer Visit', description: note },
                ...item.timeline,
              ],
            }
          : item
      )
    );
  };

  const waterTree = (id: string) => {
    setMaintenanceItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'healthy',
              isUrgent: false,
              lastVisit: 'Today',
              timeline: [
                {
                  date: 'Today',
                  title: 'Deep Hydration & Mulch',
                  description: 'Tree watered with 15L water. Soil hydration restored.',
                },
                ...item.timeline,
              ],
            }
          : item
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        requests,
        volunteers,
        maintenanceItems,
        switchRole,
        loginAs,
        logout,
        createRequest,
        verifyRequest,
        rejectRequest,
        volunteerAcceptRequest,
        volunteerScheduleRequest,
        adminApproveSchedule,
        volunteerUploadActivity,
        approveVolunteer,
        rejectVolunteer,
        saveVolunteerAdminNote,
        addMaintenanceLog,
        waterTree,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

