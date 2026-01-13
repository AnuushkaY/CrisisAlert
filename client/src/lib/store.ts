import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Status = 'open' | 'in-progress' | 'resolved'; // Keep for backward compatibility

// Role types
export type Role = 'citizen' | 'coordinator' | 'agency';

// Incident types
export type IncidentCategory = 'fire' | 'flood' | 'medical' | 'police' | 'utility' | 'environmental' | 'other';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'acknowledged' | 'in-progress' | 'resolved';

// Resource types
export type ResourceType = 'personnel' | 'vehicle' | 'equipment' | 'supply' | 'supplies';
export type ResourceStatus = 'available' | 'deployed' | 'maintenance' | 'unavailable';

// Alert types
export type AlertType = 'emergency' | 'warning' | 'information' | 'update';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  name: string;
  organization?: string;
  phone?: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status: IncidentStatus;
  location: { lat: number; lng: number; address?: string };
  reportedBy: string;
  assignedTo?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  category: string;
  quantity: number;
  available: number;
  location?: { lat: number; lng: number };
  status: ResourceStatus;
  organization: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  incidentId: string;
  quantity: number;
  allocatedBy: string;
  allocatedAt: string;
  returnedAt?: string;
  status: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: AlertType;
  priority: AlertPriority;
  targetUsers?: string[];
  incidentId?: string;
  location?: { lat: number; lng: number };
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface Analytics {
  id: string;
  type: string;
  data: any;
  period: string;
  createdAt: string;
}

interface AppState {
  user: User | null;
  incidents: Incident[];
  resources: Resource[];
  alerts: Alert[];
  notifications: Notification[];
  analytics: Analytics[];

  // Auth
  login: (email: string, role: Role, password: string) => void;
  logout: () => void;

  // Incidents
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'resolvedAt'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  // Resources
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;

  // Resource Allocations
  allocateResource: (allocation: Omit<ResourceAllocation, 'id' | 'allocatedAt'>) => void;
  returnResource: (id: string) => void;

  // Alerts
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;

  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;

  // Analytics
  addAnalyticsEntry: (entry: Omit<Analytics, 'id' | 'createdAt'>) => void;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "1",
    title: "Building Fire on Main Street",
    description: "Commercial building fire reported. Multiple floors affected. Firefighters on scene.",
    category: "fire",
    severity: "high",
    priority: "critical",
    status: "in-progress",
    location: { lat: 40.7128, lng: -74.0060, address: "123 Main Street" },
    reportedBy: "1",
    assignedTo: "3",
    images: ["https://example.com/fire1.jpg"],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Flood Warning - River District",
    description: "Heavy rainfall causing flooding in low-lying areas. Residents advised to evacuate.",
    category: "flood",
    severity: "medium",
    priority: "high",
    status: "reported",
    location: { lat: 40.7589, lng: -73.9851, address: "456 River Road" },
    reportedBy: "1",
    images: [],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "Fire Truck #1",
    type: "vehicle",
    category: "firefighting",
    quantity: 1,
    available: 1,
    location: { lat: 40.7128, lng: -74.0060 },
    status: "available",
    organization: "Fire Department",
    description: "Heavy duty fire truck with 5000 gallon water tank",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Medical Team Alpha",
    type: "personnel",
    category: "medical",
    quantity: 5,
    available: 5,
    location: { lat: 40.7589, lng: -73.9851 },
    status: "available",
    organization: "Emergency Medical Services",
    description: "Paramedic team with ambulance and life support equipment",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    title: "Emergency: Building Fire",
    message: "Active fire at 123 Main Street. Evacuate area within 500m radius.",
    type: "emergency",
    priority: "high",
    targetUsers: ["citizen"],
    incidentId: "1",
    location: { lat: 40.7128, lng: -74.0060 },
    createdBy: "3",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      incidents: MOCK_INCIDENTS,
      resources: MOCK_RESOURCES,
      alerts: MOCK_ALERTS,
      notifications: [],
      analytics: [],

      login: (email, role, password) => {
        // Mock validation - any password > 3 chars
        if (password.length < 4) throw new Error("Password too short");

        // Mock user data based on role
        const mockUsers = {
          citizen: { id: "1", username: "citizen1", email, role, name: "John Citizen", organization: undefined, createdAt: new Date().toISOString() },
          coordinator: { id: "2", username: "coordinator1", email, role, name: "Sarah Coordinator", organization: "City Emergency Services", createdAt: new Date().toISOString() },
          agency: { id: "3", username: "agency1", email, role, name: "Mike Agency", organization: "Fire Department", createdAt: new Date().toISOString() },
        };

        set({ user: mockUsers[role] });
      },

      logout: () => set({ user: null }),

      // Incidents
      addIncident: (data) =>
        set((state) => ({
          incidents: [
            {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.incidents,
          ],
        })),

      updateIncident: (id, updates) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id
              ? { ...incident, ...updates, updatedAt: new Date().toISOString() }
              : incident
          ),
        })),

      deleteIncident: (id) =>
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.id !== id),
        })),

      // Resources
      addResource: (data) =>
        set((state) => ({
          resources: [
            {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.resources,
          ],
        })),

      updateResource: (id, updates) =>
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === id
              ? { ...resource, ...updates, updatedAt: new Date().toISOString() }
              : resource
          ),
        })),

      deleteResource: (id) =>
        set((state) => ({
          resources: state.resources.filter((resource) => resource.id !== id),
        })),

      // Resource Allocations
      allocateResource: (data) =>
        set((state) => {
          // Update resource availability
          const updatedResources = state.resources.map((resource) =>
            resource.id === data.resourceId
              ? { ...resource, available: resource.available - data.quantity, status: 'deployed' as ResourceStatus }
              : resource
          );

          return {
            resources: updatedResources,
            // In a real app, you'd store allocations separately
          };
        }),

      returnResource: (allocationId) =>
        set((state) => {
          // Mock return - in real app, find allocation and update resource
          return state;
        }),

      // Alerts
      addAlert: (data) =>
        set((state) => ({
          alerts: [
            {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            },
            ...state.alerts,
          ],
        })),

      updateAlert: (id, updates) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        })),

      // Notifications
      addNotification: (data) =>
        set((state) => ({
          notifications: [
            {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),

      // Analytics
      addAnalyticsEntry: (data) =>
        set((state) => ({
          analytics: [
            {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            },
            ...state.analytics,
          ],
        })),
    }),
    {
      name: 'crisis-response-storage',
    }
  )
);
