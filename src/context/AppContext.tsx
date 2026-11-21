import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  AppUser,
  PlantationRequest,
  VolunteerApplication,
  MaintenanceItem,
  ScheduleDetails,
  ActivityReport,
  NurturingUpdate,
  AppNotificationItem,
  AdminInboxItem,
} from '@/types';

interface AppContextType {
  currentRole: UserRole;
  currentUser: AppUser;
  requests: PlantationRequest[];
  volunteers: VolunteerApplication[];
  maintenanceItems: MaintenanceItem[];
  notifications: AppNotificationItem[];
  adminInbox: AdminInboxItem[];
  
  // Role & Auth Actions
  switchRole: (role: UserRole) => void;
  loginAs: (role: UserRole, email?: string) => void;
  logout: () => void;
  
  // Request Lifecycle Actions
  createRequest: (data: Partial<PlantationRequest>) => PlantationRequest;
  updateCitizenRequest: (id: string, data: Partial<PlantationRequest>) => void;
  verifyRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  requestClarification: (id: string, notes: string) => void;
  adminTakeoverRequest: (id: string) => void;
  republishRequest: (id: string) => void;
  volunteerAcceptRequest: (id: string) => void;
  volunteerScheduleRequest: (id: string, schedule: ScheduleDetails) => void;
  adminApproveSchedule: (id: string) => void;
  volunteerUploadActivity: (id: string, activity: ActivityReport) => void;
  addNurturingUpdate: (
    id: string,
    update: {
      photos: string[];
      notes: string;
      actionsTaken?: string[];
      date?: string;
      volunteerName?: string;
      volunteerId?: string;
    }
  ) => void;
  
  // Notifications Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  markAdminInboxAsRead: (id: string) => void;
  markAllAdminInboxAsRead: () => void;
  
  // Volunteer Management Actions
  submitVolunteerApplication: (app: Partial<VolunteerApplication>) => VolunteerApplication;
  approveVolunteer: (id: string) => void;
  saveVolunteerAdminNote: (id: string, note: string) => void;
  blockVolunteer: (id: string, reason: string) => void;
  unblockVolunteer: (id: string) => void;
  
  // Maintenance Actions
  addMaintenanceLog: (id: string, note: string) => void;
  waterTree: (id: string) => void;
}

const DEFAULT_USERS: Record<UserRole, AppUser> = {
  citizen: {
    id: 'user-citizen-1',
    name: 'Kartik Vichare',
    email: 'kartik.vichare@gmail.com',
    phone: '+91 98201 34567',
    city: 'Dadar West, Mumbai',
    role: 'citizen',
    isVerified: true,
    requestsCount: 4,
    verifiedRequestsCount: 3,
    treesCount: 14,
  },
  volunteer: {
    id: 'user-vol-1',
    name: 'Vaibhav Shirke',
    email: 'vaibhav.shirke@aanandvan.in',
    phone: '+91 98204 88776',
    city: 'Dadar, Mumbai',
    role: 'volunteer',
    isVerified: true,
    requestsCount: 2,
    verifiedRequestsCount: 8,
    treesCount: 28,
  },
  admin: {
    id: 'user-admin-1',
    name: 'Aanandvan Admin',
    email: 'admin@aanandvan.in',
    phone: '+91 99999 00000',
    city: 'Mumbai',
    role: 'admin',
    isVerified: true,
  },
};

const INITIAL_REQUESTS: PlantationRequest[] = [
  {
    id: 'REQ-2024-0105',
    title: 'Dadar Flower Market Walkway Greening',
    description:
      'Bare concrete pedestrian walkway outside Dadar Flower Market on Senapati Bapat Marg. Heavy morning commuter footfall and no tree cover. Space available for 4-5 native shade trees with protective metal guards.',
    location: 'Senapati Bapat Marg, Dadar West',
    manualAddress: 'Opposite Dadar Western Station, Senapati Bapat Marg, Dadar West, Mumbai 400028',
    landmark: 'Near Flower Market Foot Overbridge',
    coordinates: '19.0182° N, 72.8422° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'pending',
    createdAt: 'Today, 10:30 AM',
    distanceKm: 0.5,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-1',
    citizenName: 'Kartik Vichare',
    citizenEmail: 'kartik.vichare@gmail.com',
    citizenPhone: '+91 98201 34567',
    nurturingUpdates: [],
  },
  {
    id: 'REQ-2024-0042',
    title: 'Shivaji Park Perimeter Greening',
    description:
      'Unshaded walking patch along the outer boundary wall of Shivaji Park. Red soil base with optimal sunlight, ideal for native shade trees like Neem or Peepal.',
    location: 'Shivaji Park, Dadar West',
    manualAddress: 'Near Gate 3, Shivaji Park Outer Ring, Dadar West, Mumbai 400028',
    landmark: 'Opposite Samarth Vyayam Mandir',
    coordinates: '19.0269° N, 72.8375° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'assigned',
    createdAt: '24 Oct 2026',
    distanceKm: 0.6,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-1',
    citizenName: 'Kartik Vichare',
    citizenEmail: 'kartik.vichare@gmail.com',
    citizenPhone: '+91 98201 34567',
    assignedVolunteerId: 'user-vol-1',
    assignedVolunteerName: 'Vaibhav Shirke',
    assignedVolunteerLevel: 'Level 4 • 25+ Plantations',
    nurturingUpdates: [],
  },
  {
    id: 'REQ-8794',
    title: 'Dadar TT Circle Underpass Green Belt',
    description:
      'Underpass median space near Dadar TT circle needing pollution-absorbing indigenous green shrubs and canopy trees.',
    location: 'Dadar TT Circle, Dadar East',
    manualAddress: 'Flyover Underpass Median, Dadar TT Circle, Mumbai 400014',
    landmark: 'Near Khodadad Circle Fountain',
    coordinates: '19.0182° N, 72.8436° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'verified',
    createdAt: '20 Oct 2026',
    distanceKm: 1.1,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-2',
    citizenName: 'Tanvi Sawant',
    citizenEmail: 'tanvi.sawant@gmail.com',
    nurturingUpdates: [],
  },
  {
    id: 'REQ-8652',
    title: 'Five Gardens Green Canopy',
    description:
      'Open circular patch inside Garden No. 3 requiring flowering Karanj saplings to restore damaged storm tree cover.',
    location: 'Five Gardens, Matunga East',
    manualAddress: 'Garden 3, Mancherji Joshi Road, Five Gardens, Matunga East 400019',
    landmark: 'Adjacent to Parsi Colony Library',
    coordinates: '19.0210° N, 72.8530° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'in_progress',
    createdAt: '15 Oct 2026',
    distanceKm: 1.4,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-3',
    citizenName: 'Aniket Deshmukh',
    assignedVolunteerId: 'user-vol-1',
    assignedVolunteerName: 'Vaibhav Shirke',
    nurturingUpdates: [],
  },
  {
    id: 'REQ-8430',
    title: 'Prabhadevi Beachside Buffer',
    description:
      'Community coastal walkway greening with salt-tolerant Indian Almond and native coconut saplings.',
    location: 'Kirti College Road, Prabhadevi',
    manualAddress: 'Seaward Lane, Near Kirti College Gate 2, Prabhadevi 400025',
    landmark: 'Behind Beachside Sports Complex',
    coordinates: '19.0195° N, 72.8280° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'completed',
    createdAt: '28 Sep 2026',
    citizenId: 'user-citizen-1',
    citizenName: 'Kartik Vichare',
    assignedVolunteerId: 'user-vol-1',
    assignedVolunteerName: 'Vaibhav Shirke',
    assignedVolunteerLevel: 'Level 4 • 25+ Plantations',
    activityReport: {
      photos: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      ],
      saplingsPlanted: 6,
      species: 'Badam & Karanj',
      date: '02 Oct 2026',
      notes: '6 native saplings securely planted with organic mulch and bamboo protective guards.',
    },
    nurturingUpdates: [
      {
        id: 'nurt-1',
        date: '08 Oct 2026',
        photos: [
          'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
        ],
        notes: 'Deep 15L root watering completed. Soil moisture checked and weeded surrounding circular trench.',
        volunteerName: 'Vaibhav Shirke',
        volunteerId: 'user-vol-1',
        actionsTaken: ['Watered (15L)', 'Weeded Trench', 'Mulched'],
      },
      {
        id: 'nurt-2',
        date: '18 Oct 2026',
        photos: [
          'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
        ],
        notes: 'Protective bamboo cage tightened after heavy sea breeze. New green shoots emerging healthy!',
        volunteerName: 'Vaibhav Shirke',
        volunteerId: 'user-vol-1',
        actionsTaken: ['Guard Reinforced', 'Foliage Check', 'Organic Compost Added'],
      },
    ],
  },
  {
    id: 'REQ-8211',
    title: 'Hindu Colony 6th Lane Sidewalk',
    description:
      'Bare concrete pavement cutout needing a wide-canopy tree to cool residential walkway.',
    location: '6th Lane, Hindu Colony, Dadar East',
    manualAddress: 'Outside Shanti Sadan, 6th Lane, Hindu Colony, Dadar East 400014',
    landmark: 'Near King George School Play Area',
    coordinates: '19.0205° N, 72.8485° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'needs_info',
    createdAt: '15 Sep 2026',
    citizenId: 'user-citizen-1',
    citizenName: 'Kartik Vichare',
    adminClarificationNotes:
      'Please upload a clearer landmark photo showing pavement width so our volunteer team can confirm utility pipe clearance.',
  },
  {
    id: 'REQ-2024-0063',
    title: 'Mahim Nature Park Boundary Restoration',
    description:
      'Boundary walkway plantation drive. Ideal space for flowering Gulmohar and Bakul trees.',
    location: 'Sion-Bandra Link Road, Mahim',
    manualAddress: 'Maharashtra Nature Park Perimeter, Mahim East 400017',
    landmark: 'Opposite Dharavi Bus Depot',
    coordinates: '19.0430° N, 72.8590° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'verified',
    createdAt: '18 Oct 2026',
    distanceKm: 2.1,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-4',
    citizenName: 'Prakash More',
  },
  {
    id: 'REQ-2024-0088',
    title: 'Chaityabhoomi Coastal Promenade',
    description:
      'Coastal pathway needing windbreak vegetation along the rocky sea wall.',
    location: 'Ranade Road, Dadar West',
    manualAddress: 'Chaityabhoomi Seafront Promenade, Dadar West 400028',
    landmark: 'Near Dr. Babasaheb Ambedkar Smarak',
    coordinates: '19.0245° N, 72.8330° E',
    areaPhotos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    ],
    landmarkPhotos: [],
    status: 'verified',
    createdAt: '22 Oct 2026',
    distanceKm: 0.9,
    duplicateRisk: 'None detected',
    citizenId: 'user-citizen-5',
    citizenName: 'Priya Kulkarni',
  },
];

const INITIAL_VOLUNTEERS: VolunteerApplication[] = [
  {
    id: 'vol-app-1',
    volunteerCode: 'VOL-DAD-0104',
    name: 'Vaibhav Shirke',
    email: 'vaibhav.shirke@aanandvan.in',
    phone: '+91 98204 88776',
    city: 'Dadar, Mumbai',
    pincode: '400028',
    address: 'Flat 12, Sahakar Niwas, Gokhale Road, Dadar West, Mumbai',
    coordinates: '19.0234° N, 72.8390° E',
    appliedDate: '24 Oct 2025',
    status: 'verified',
    visionQuote:
      'Committed to restoring Mumbai native canopy corridors in Shivaji Park and Prabhadevi.',
    bio: 'Botanical researcher and community green volunteer with 4+ years urban planting experience across Dadar and Matunga.',
    adminNotes: 'Senior volunteer. Qualified to lead tree plantation and sapling training.',
    plantationsCount: 28,
    acceptedDrivesCount: 18,
    completedDrivesCount: 16,
    ongoingDrivesCount: 2,
    lastActiveDate: 'Today',
    lastActive: 'Today',
  },
  {
    id: 'vol-app-2',
    volunteerCode: 'VOL-MAT-0219',
    name: 'Tanvi Sawant',
    email: 'tanvi.sawant@workmail.com',
    phone: '+91 98209 11990',
    city: 'Matunga East, Mumbai',
    pincode: '400019',
    address: '14 Bhaudaji Road, Matunga East, Mumbai',
    coordinates: '19.0280° N, 72.8550° E',
    appliedDate: '12 Jan 2026',
    status: 'verified',
    visionQuote: 'Passionate about native biodiversity and planting indigenous flowering trees.',
    bio: 'Avid terrace gardener and environmental activist keen on adopting public sidewalks in Matunga.',
    plantationsCount: 8,
    acceptedDrivesCount: 9,
    completedDrivesCount: 8,
    ongoingDrivesCount: 1,
    lastActiveDate: '2 days ago',
    lastActive: '2d ago',
  },
  {
    id: 'vol-app-3',
    volunteerCode: 'VOL-PRB-0342',
    name: 'Rohit Gaikwad',
    email: 'rohit.g@example.com',
    phone: '+91 99887 76655',
    city: 'Prabhadevi, Mumbai',
    pincode: '400025',
    address: 'Sayani Road, Near Siddhivinayak Temple, Prabhadevi',
    coordinates: '19.0160° N, 72.8290° E',
    appliedDate: '05 Jan 2026',
    status: 'verified',
    plantationsCount: 0,
    acceptedDrivesCount: 0,
    completedDrivesCount: 0,
    ongoingDrivesCount: 0,
    lastActiveDate: 'Inactive (No drives accepted)',
    lastActive: '30d ago',
    visionQuote: 'College student eager to join weekend community plantation drives.',
    bio: 'Student at Ruia College interested in weekend urban forestry.',
  },
  {
    id: 'vol-app-4',
    volunteerCode: 'VOL-WAD-0408',
    name: 'Swapnil More',
    email: 'swapnil.m@example.com',
    phone: '+91 98711 22334',
    city: 'Wadala, Mumbai',
    pincode: '400031',
    address: 'Bhakti Park, Wadala East, Mumbai',
    coordinates: '19.0270° N, 72.8680° E',
    appliedDate: '15 Feb 2026',
    status: 'suspended',
    isBlocked: true,
    blockReason: 'Accepted 3 drives and remained completely unresponsive for 21 days without scheduling.',
    blockedAt: '10 Nov 2026',
    plantationsCount: 1,
    acceptedDrivesCount: 3,
    completedDrivesCount: 0,
    ongoingDrivesCount: 3,
    lastActiveDate: '21 days ago',
    lastActive: '21d ago',
    visionQuote: 'Urban greening advocate.',
    bio: 'Independent volunteer.',
  },
  {
    id: 'vol-app-5',
    volunteerCode: 'VOL-DAD-0105',
    name: 'Amol Jadhav',
    email: 'amol.jadhav@outlook.com',
    phone: '+91 98334 55667',
    city: 'Dadar West, Mumbai',
    pincode: '400028',
    address: '22 Ranade Road, Opp. Shivaji Park, Dadar West, Mumbai',
    coordinates: '19.0260° N, 72.8385° E',
    appliedDate: 'Yesterday',
    status: 'pending',
    visionQuote: 'Eager to plant and nurture indigenous trees along Dadar streets and school perimeters.',
    bio: 'Local Dadar resident and botany enthusiast. Available on weekend mornings for soil preparation, sapling planting, and alternate-day watering drives.',
    plantationsCount: 0,
    acceptedDrivesCount: 0,
    completedDrivesCount: 0,
    ongoingDrivesCount: 0,
    lastActiveDate: 'Awaiting Verification',
    lastActive: '1d ago',
  },
];

const INITIAL_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 'maint-1',
    treeName: 'Shivaji Park Neem Tree #042',
    treeTag: '#042',
    location: 'Shivaji Park Outer Ring, Dadar West',
    status: 'needs_water',
    isUrgent: true,
    lastVisit: '10 Nov 2026',
    planterName: 'Vaibhav Shirke',
    imageUrl:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    timeline: [
      {
        date: '10 Nov 2026',
        title: 'Initial Plantation Completed',
        description: 'Native Neem sapling grounded with vermicompost and protective guard.',
      },
    ],
  },
  {
    id: 'maint-2',
    treeName: 'Prabhadevi Karanj Canopy #109',
    treeTag: '#109',
    location: 'Kirti College Road, Prabhadevi',
    status: 'healthy',
    isUrgent: false,
    lastVisit: '18 Oct 2026',
    planterName: 'Vaibhav Shirke',
    imageUrl:
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
    timeline: [
      {
        date: '02 Oct 2026',
        title: 'Initial Plantation Completed',
        description: '6 saplings planted with organic mulch.',
      },
      {
        date: '18 Oct 2026',
        title: 'Nurturing & Bamboo Cage Check',
        description: 'Protective bamboo cage tightened; healthy new leaf shoots developing.',
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: AppNotificationItem[] = [
  {
    id: 'n-1',
    section: 'Today',
    title: 'Volunteer Assigned to Your Request',
    body: 'Vaibhav Shirke has accepted your Shivaji Park perimeter request and is preparing the sapling.',
    time: '2 hours ago',
    icon: 'profile',
    unread: true,
    requestId: 'REQ-2024-0042',
  },
  {
    id: 'n-2',
    section: 'Today',
    title: 'Clarification Needed for Request',
    body: 'Admin asked for clearer landmark details for Hindu Colony 6th Lane Sidewalk. Tap to edit.',
    time: '4 hours ago',
    icon: 'info',
    unread: true,
    requestId: 'REQ-8211',
  },
  {
    id: 'n-3',
    section: 'Earlier',
    title: 'Tree Nurturing Update Added! 🌱',
    body: 'Vaibhav Shirke watered and added mulch to Prabhadevi Beachside Buffer. Tap to view new photos.',
    time: '18 Oct',
    icon: 'plant',
    unread: false,
    requestId: 'REQ-8430',
  },
];

const INITIAL_ADMIN_INBOX: AdminInboxItem[] = [
  {
    id: 'inb-1',
    title: 'New Plantation Spot Reported',
    body: 'Kartik Vichare submitted Dadar Flower Market Walkway Greening awaiting review.',
    time: 'Today, 10:30 AM',
    icon: 'plant',
    unread: true,
    route: '/pages/admin-review-request',
    params: { id: 'REQ-2024-0105' },
  },
  {
    id: 'inb-2',
    title: 'New Volunteer Application',
    body: 'Amol Jadhav applied to volunteer from Dadar West, Mumbai. Awaiting verification.',
    time: 'Yesterday',
    icon: 'profile',
    unread: true,
    route: '/pages/volunteer-details',
    params: { id: 'vol-app-5' },
  },
  {
    id: 'inb-3',
    title: 'Drive Unaccepted Alert',
    body: 'Chaityabhoomi Coastal Promenade has been verified for 3+ days without volunteer acceptance.',
    time: '1 day ago',
    icon: 'alert',
    unread: true,
    route: '/(admin)/requests',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [currentUser, setCurrentUser] = useState<AppUser>(DEFAULT_USERS.citizen);
  const [requests, setRequests] = useState<PlantationRequest[]>(INITIAL_REQUESTS);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(INITIAL_VOLUNTEERS);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(INITIAL_MAINTENANCE);
  const [notifications, setNotifications] = useState<AppNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [adminInbox, setAdminInbox] = useState<AdminInboxItem[]>(INITIAL_ADMIN_INBOX);

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

  // ─── Citizen Creates Request (Spotting Empty Space) ────────────────────────
  const createRequest = (data: Partial<PlantationRequest>): PlantationRequest => {
    const newReqId = `REQ-2024-${String(requests.length + 43).padStart(4, '0')}`;
    const newReq: PlantationRequest = {
      id: newReqId,
      title: data.title || 'Community Tree Plantation Spot',
      description: data.description || '',
      location: data.location || 'Dadar, Mumbai',
      manualAddress: data.manualAddress || data.location || 'Dadar, Mumbai',
      landmark: data.landmark || 'Near main sidewalk',
      coordinates: data.coordinates || '19.0200° N, 72.8400° E',
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
      nurturingUpdates: [],
    };

    setRequests(prev => [newReq, ...prev]);

    // Notify Admin Inbox of newly created request
    const adminItem: AdminInboxItem = {
      id: `inb-${Date.now()}`,
      title: 'New Plantation Spot Reported',
      body: `${currentUser.name} reported a tree planting spot at ${newReq.location}.`,
      time: 'Just now',
      icon: 'plant',
      unread: true,
      route: '/pages/admin-review-request',
      params: { id: newReq.id },
    };
    setAdminInbox(prev => [adminItem, ...prev]);

    // Add confirmation notification for Citizen
    const citizenItem: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Request Submitted',
      body: `Your spot "${newReq.title}" has been submitted for admin verification.`,
      time: 'Just now',
      icon: 'plant',
      unread: true,
      requestId: newReq.id,
    };
    setNotifications(prev => [citizenItem, ...prev]);

    return newReq;
  };

  // ─── Citizen Edits Request after Clarification ─────────────────────────────
  const updateCitizenRequest = (id: string, data: Partial<PlantationRequest>) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              ...data,
              status: 'pending', // Re-submits to admin review
              adminClarificationNotes: undefined, // Clear old clarification note
            }
          : req
      )
    );

    // Notify Admin that request was updated
    const adminItem: AdminInboxItem = {
      id: `inb-${Date.now()}`,
      title: 'Request Updated by Citizen',
      body: `Clarification updated for #${id}. Ready for re-verification.`,
      time: 'Just now',
      icon: 'document',
      unread: true,
      route: '/pages/admin-review-request',
      params: { id },
    };
    setAdminInbox(prev => [adminItem, ...prev]);
  };

  // ─── Admin Verifies Request ──────────────────────────────────────────────
  const verifyRequest = (id: string) => {
    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'verified', adminClarificationNotes: undefined } : req))
    );

    // Notify Citizen that their request was verified and posted
    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Request Verified',
      body: `Your plantation request for "${title}" has been verified and posted to Dadar volunteers!`,
      time: 'Just now',
      icon: 'check',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);
  };

  // ─── Admin Requests Clarification (Ask More Info) ─────────────────────────
  const requestClarification = (id: string, notes: string) => {
    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'needs_info',
              adminClarificationNotes: notes,
            }
          : req
      )
    );

    // Notify Citizen with the admin's note
    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Clarification Needed for Request',
      body: `Admin note: "${notes}". Tap to review and update your request.`,
      time: 'Just now',
      icon: 'info',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);
  };

  // ─── Admin Rejects Request ───────────────────────────────────────────────
  const rejectRequest = (id: string) => {
    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: 'rejected' } : req))
    );

    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Request Not Approved',
      body: `Unfortunately, the proposed site "${title}" could not be approved due to underground utility or space constraints.`,
      time: 'Just now',
      icon: 'close',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);
  };

  // ─── Admin Takes Over Unaccepted Drive ────────────────────────────────────
  const adminTakeoverRequest = (id: string) => {
    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'assigned',
              isTakenOverByAdmin: true,
              assignedVolunteerId: 'admin-team',
              assignedVolunteerName: 'Aanandvan Direct Mobile Squad',
              assignedVolunteerLevel: 'Aanandvan Core Team',
            }
          : req
      )
    );

    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Drive Taken Over by Aanandvan Team',
      body: `Aanandvan central team has taken direct responsibility for "${title}" to expedite planting.`,
      time: 'Just now',
      icon: 'shield',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);
  };

  // ─── Re-publish Request (e.g. after volunteer blocked) ────────────────────
  const republishRequest = (id: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'verified',
              assignedVolunteerId: undefined,
              assignedVolunteerName: undefined,
              assignedVolunteerAvatar: undefined,
              schedule: undefined,
            }
          : req
      )
    );
  };

  // ─── Volunteer Accepts Request ───────────────────────────────────────────
  const volunteerAcceptRequest = (id: string) => {
    // If volunteer is blocked, block them from accepting!
    const isVolunteerBlocked = volunteers.find(v => v.email === currentUser.email)?.isBlocked;
    if (isVolunteerBlocked) return;

    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

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

    // Update volunteer stats
    setVolunteers(prev =>
      prev.map(v =>
        v.id === currentUser.id
          ? {
              ...v,
              acceptedDrivesCount: (v.acceptedDrivesCount || 0) + 1,
              ongoingDrivesCount: (v.ongoingDrivesCount || 0) + 1,
              lastActiveDate: 'Today',
            }
          : v
      )
    );

    // Notify Citizen that volunteer accepted
    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Volunteer Assigned',
      body: `${currentUser.name} has accepted "${title}" and will schedule planting soon!`,
      time: 'Just now',
      icon: 'profile',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);

    // Alert Admin
    const adminItem: AdminInboxItem = {
      id: `inb-${Date.now()}`,
      title: 'Drive Accepted by Volunteer',
      body: `${currentUser.name} accepted request #${id} (${title}).`,
      time: 'Just now',
      icon: 'profile',
      unread: true,
      route: '/pages/request-details',
      params: { id },
    };
    setAdminInbox(prev => [adminItem, ...prev]);
  };

  // ─── Volunteer Schedules Request ─────────────────────────────────────────
  const volunteerScheduleRequest = (id: string, schedule: ScheduleDetails) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'scheduled',
              schedule: { ...schedule, isApprovedByAdmin: true },
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

  // ─── Phase 1: Volunteer Uploads Initial Plantation Activity ──────────────
  const volunteerUploadActivity = (id: string, activity: ActivityReport) => {
    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

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

    // Update volunteer stats
    setVolunteers(prev =>
      prev.map(v =>
        v.id === currentUser.id
          ? {
              ...v,
              completedDrivesCount: (v.completedDrivesCount || 0) + 1,
              ongoingDrivesCount: Math.max(0, (v.ongoingDrivesCount || 1) - 1),
              plantationsCount: (v.plantationsCount || 0) + activity.saplingsPlanted,
              lastActiveDate: 'Today',
            }
          : v
      )
    );

    // 1. Notify Citizen with initial plantation alert
    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Tree Planted! 🎉',
      body: `${currentUser.name} planted native saplings at "${title}". Tap to view photos & follow nurturing updates!`,
      time: 'Just now',
      icon: 'plant',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);

    // 2. Notify Admin
    const adminItem: AdminInboxItem = {
      id: `inb-${Date.now()}`,
      title: 'Plantation Drive Completed',
      body: `${currentUser.name} planted ${activity.saplingsPlanted} saplings for #${id}.`,
      time: 'Just now',
      icon: 'check',
      unread: true,
      route: '/pages/request-details',
      params: { id },
    };
    setAdminInbox(prev => [adminItem, ...prev]);

    // 3. Create Maintenance Item for watering reminders
    const newMaint: MaintenanceItem = {
      id: `maint-${Date.now()}`,
      treeName: `${title} Tree`,
      treeTag: `#${id.replace(/[^0-9]/g, '').slice(-3) || '042'}`,
      location: target?.location || 'Plantation Site',
      status: 'healthy',
      isUrgent: false,
      lastVisit: activity.date || 'Today',
      planterName: currentUser.name,
      imageUrl:
        activity.photos?.[0] ||
        activity.afterPhotos?.[0] ||
        target?.areaPhotos[0] ||
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
      timeline: [
        {
          date: activity.date || 'Today',
          title: 'Initial Plantation Completed',
          description: `${activity.saplingsPlanted} native sapling(s) grounded with vermicompost and protective guard.`,
        },
      ],
    };
    setMaintenanceItems(prev => [newMaint, ...prev]);

    // Update current user count
    setCurrentUser(prev => ({
      ...prev,
      treesCount: (prev.treesCount || 0) + activity.saplingsPlanted,
    }));
  };

  // ─── Phase 2: Ongoing Nurturing Updates (Watering, Weeding, Guard Check) ─
  const addNurturingUpdate = (
    id: string,
    update: {
      photos: string[];
      notes: string;
      actionsTaken?: string[];
      date?: string;
      volunteerName?: string;
      volunteerId?: string;
    }
  ) => {
    const target = requests.find(r => r.id === id);
    const title = target?.title || 'Plantation Drive';

    const newNurturing: NurturingUpdate = {
      id: `nurt-${Date.now()}`,
      date: update.date || 'Today',
      photos: update.photos,
      notes: update.notes,
      volunteerName: update.volunteerName || currentUser.name || 'Vaibhav Shirke',
      volunteerId: update.volunteerId || currentUser.id || 'VOL-DAD-0104',
      actionsTaken: update.actionsTaken || ['Watered', 'Health Inspected'],
    };

    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              nurturingUpdates: [newNurturing, ...(req.nurturingUpdates || [])],
            }
          : req
      )
    );

    // Update volunteer last active
    setVolunteers(prev =>
      prev.map(v => (v.id === currentUser.id ? { ...v, lastActiveDate: 'Today' } : v))
    );

    // Notify Citizen that tree received nurturing care
    const citizenNotif: AppNotificationItem = {
      id: `n-${Date.now()}`,
      section: 'Today',
      title: 'Tree Nurturing Update Added 🌱',
      body: `${currentUser.name} checked and watered your tree at "${title}". Tap to view new photo!`,
      time: 'Just now',
      icon: 'plant',
      unread: true,
      requestId: id,
    };
    setNotifications(prev => [citizenNotif, ...prev]);

    // Update maintenance item
    setMaintenanceItems(prev =>
      prev.map(item =>
        item.location === target?.location || item.treeName.includes(title)
          ? {
              ...item,
              status: 'healthy',
              isUrgent: false,
              lastVisit: 'Today',
              timeline: [
                {
                  date: 'Today',
                  title: 'Routine Nurturing & Care',
                  description: update.notes,
                  photo: update.photos[0],
                },
                ...item.timeline,
              ],
            }
          : item
      )
    );
  };

  // ─── Block & Unblock Volunteer ─────────────────────────────────────────────
  const blockVolunteer = (volunteerId: string, reason: string) => {
    setVolunteers(prev =>
      prev.map(v =>
        v.id === volunteerId
          ? {
              ...v,
              isBlocked: true,
              blockReason: reason,
              blockedAt: 'Today',
              status: 'suspended',
            }
          : v
      )
    );

    // Automatically re-publish any ongoing requests assigned to this blocked volunteer
    setRequests(prev =>
      prev.map(r =>
        r.assignedVolunteerId === volunteerId && (r.status === 'assigned' || r.status === 'scheduled')
          ? {
              ...r,
              status: 'verified',
              assignedVolunteerId: undefined,
              assignedVolunteerName: undefined,
              schedule: undefined,
            }
          : r
      )
    );
  };

  const unblockVolunteer = (volunteerId: string) => {
    setVolunteers(prev =>
      prev.map(v =>
        v.id === volunteerId
          ? {
              ...v,
              isBlocked: false,
              blockReason: undefined,
              blockedAt: undefined,
              status: 'verified',
            }
          : v
      )
    );
  };

  // ─── Notification Actions ────────────────────────────────────────────────
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAdminInboxAsRead = (id: string) => {
    setAdminInbox(prev =>
      prev.map(i => (i.id === id ? { ...i, unread: false } : i))
    );
  };

  const markAllAdminInboxAsRead = () => {
    setAdminInbox(prev => prev.map(i => ({ ...i, unread: false })));
  };

  // ─── Volunteer Application Submission ─────────────────────────────────────
  const submitVolunteerApplication = (data: Partial<VolunteerApplication>): VolunteerApplication => {
    const codeNum = String(volunteers.length + 105).padStart(4, '0');
    const newApp: VolunteerApplication = {
      id: `vol-app-${Date.now()}`,
      volunteerCode: `VOL-DAD-${codeNum}`,
      name: data.name || 'New Volunteer',
      email: data.email || 'volunteer@aanandvan.in',
      phone: data.phone || '+91 98200 11223',
      city: data.city || 'Dadar, Mumbai',
      pincode: data.pincode || '400028',
      address: data.address || 'Dadar West, Mumbai',
      coordinates: data.coordinates || '19.0200° N, 72.8400° E',
      appliedDate: 'Today',
      status: 'pending',
      visionQuote: data.visionQuote || data.bio || 'Passionate about Mumbai urban forestry.',
      bio: data.bio || data.visionQuote || 'Passionate about Mumbai urban forestry.',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      plantationsCount: 0,
      acceptedDrivesCount: 0,
      completedDrivesCount: 0,
      ongoingDrivesCount: 0,
      lastActiveDate: 'Just applied',
      lastActive: 'Just applied',
    };

    setVolunteers(prev => [newApp, ...prev]);

    setAdminInbox(prev => [
      {
        id: `inb-${Date.now()}`,
        title: 'New Volunteer Application',
        body: `${newApp.name} applied to volunteer from ${newApp.city}. Tap to review and verify.`,
        time: 'Just now',
        icon: 'profile',
        unread: true,
        route: '/pages/volunteer-details',
        params: { id: newApp.id },
      },
      ...prev,
    ]);

    return newApp;
  };

  const approveVolunteer = (id: string) => {
    setVolunteers(prev =>
      prev.map(vol => (vol.id === id ? { ...vol, status: 'verified' } : vol))
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
                { date: 'Today', title: 'Volunteer Care Visit', description: note },
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
        notifications,
        adminInbox,
        switchRole,
        loginAs,
        logout,
        createRequest,
        updateCitizenRequest,
        verifyRequest,
        rejectRequest,
        requestClarification,
        adminTakeoverRequest,
        republishRequest,
        volunteerAcceptRequest,
        volunteerScheduleRequest,
        adminApproveSchedule,
        volunteerUploadActivity,
        addNurturingUpdate,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        markAdminInboxAsRead,
        markAllAdminInboxAsRead,
        submitVolunteerApplication,
        approveVolunteer,
        saveVolunteerAdminNote,
        blockVolunteer,
        unblockVolunteer,
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
