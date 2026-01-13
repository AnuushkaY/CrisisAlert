import { type User, type InsertUser, type Incident, type InsertIncident, type Resource, type InsertResource, type ResourceAllocation, type InsertResourceAllocation, type Alert, type InsertAlert, type Notification, type InsertNotification, type Analytics } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;

  // Incidents
  getIncidents(): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: string, incident: Partial<InsertIncident>): Promise<Incident | undefined>;
  deleteIncident(id: string): Promise<boolean>;

  // Resources
  getResources(): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;

  // Resource Allocations
  getResourceAllocations(): Promise<ResourceAllocation[]>;
  createResourceAllocation(allocation: InsertResourceAllocation): Promise<ResourceAllocation>;
  updateResourceAllocation(id: string, allocation: Partial<InsertResourceAllocation>): Promise<ResourceAllocation | undefined>;

  // Alerts
  getAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, alert: Partial<InsertAlert>): Promise<Alert | undefined>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<boolean>;

  // Analytics
  getAnalytics(type?: string, period?: string): Promise<Analytics[]>;
  createAnalyticsEntry(entry: Omit<Analytics, 'id' | 'createdAt'>): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private incidents: Map<string, Incident>;
  private resources: Map<string, Resource>;
  private resourceAllocations: Map<string, ResourceAllocation>;
  private alerts: Map<string, Alert>;
  private notifications: Map<string, Notification>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.users = new Map();
    this.incidents = new Map();
    this.resources = new Map();
    this.resourceAllocations = new Map();
    this.alerts = new Map();
    this.notifications = new Map();
    this.analytics = new Map();

    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock users
    const mockUsers: User[] = [
      {
        id: "1",
        username: "citizen1",
        password: "password",
        email: "citizen@example.com",
        role: "citizen",
        name: "John Citizen",
        organization: null,
        phone: "555-0101",
        createdAt: new Date(),
      },
      {
        id: "2",
        username: "coordinator1",
        password: "password",
        email: "coordinator@example.com",
        role: "coordinator",
        name: "Sarah Coordinator",
        organization: "City Emergency Services",
        phone: "555-0102",
        createdAt: new Date(),
      },
      {
        id: "3",
        username: "agency1",
        password: "password",
        email: "agency@example.com",
        role: "agency",
        name: "Mike Agency",
        organization: "Fire Department",
        phone: "555-0103",
        createdAt: new Date(),
      },
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));

    // Mock incidents
    const mockIncidents: Incident[] = [
      {
        id: "1",
        title: "Building Fire",
        description: "Commercial building fire on Main Street",
        category: "fire",
        severity: "high",
        priority: "critical",
        status: "in-progress",
        location: { lat: 40.7128, lng: -74.0060, address: "123 Main St" },
        reportedBy: "1",
        assignedTo: "3",
        images: ["https://example.com/fire1.jpg"],
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(),
        resolvedAt: null,
      },
      {
        id: "2",
        title: "Flood Warning",
        description: "Heavy flooding in residential area",
        category: "flood",
        severity: "medium",
        priority: "high",
        status: "reported",
        location: { lat: 40.7589, lng: -73.9851, address: "456 River Rd" },
        reportedBy: "1",
        assignedTo: null,
        images: [],
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(),
        resolvedAt: null,
      },
    ];

    mockIncidents.forEach(incident => this.incidents.set(incident.id, incident));

    // Mock resources
    const mockResources: Resource[] = [
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
        description: "Heavy duty fire truck with water tank",
        createdAt: new Date(),
        updatedAt: new Date(),
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
        description: "Paramedic team with ambulance",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockResources.forEach(resource => this.resources.set(resource.id, resource));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || 'citizen',
      organization: insertUser.organization ?? null,
      phone: insertUser.phone ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = randomUUID();
    const incident: Incident = {
      ...insertIncident,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null,
      status: insertIncident.status || 'reported',
      priority: insertIncident.priority || 'medium',
      assignedTo: insertIncident.assignedTo ?? null,
      images: insertIncident.images ?? null
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: string, updates: Partial<InsertIncident>): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    const updatedIncident = {
      ...incident,
      ...updates,
      updatedAt: new Date(),
      resolvedAt: updates.status === 'resolved' ? new Date() : incident.resolvedAt
    };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async deleteIncident(id: string): Promise<boolean> {
    return this.incidents.delete(id);
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertResource.status || 'available',
      description: insertResource.description ?? null,
      location: insertResource.location ?? null
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, updates: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    const updatedResource = { ...resource, ...updates, updatedAt: new Date() };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.resources.delete(id);
  }

  // Resource Allocations
  async getResourceAllocations(): Promise<ResourceAllocation[]> {
    return Array.from(this.resourceAllocations.values());
  }

  async createResourceAllocation(insertAllocation: InsertResourceAllocation): Promise<ResourceAllocation> {
    const id = randomUUID();
    const allocation: ResourceAllocation = {
      ...insertAllocation,
      id,
      allocatedAt: new Date(),
      returnedAt: null,
      status: insertAllocation.status || 'allocated'
    };
    this.resourceAllocations.set(id, allocation);
    return allocation;
  }

  async updateResourceAllocation(id: string, updates: Partial<InsertResourceAllocation>): Promise<ResourceAllocation | undefined> {
    const allocation = this.resourceAllocations.get(id);
    if (!allocation) return undefined;
    const updatedAllocation = { ...allocation, ...updates };
    this.resourceAllocations.set(id, updatedAllocation);
    return updatedAllocation;
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values());
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
      location: insertAlert.location ?? null,
      incidentId: insertAlert.incidentId ?? null,
      expiresAt: insertAlert.expiresAt ?? null,
      targetUsers: insertAlert.targetUsers ?? null
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async updateAlert(id: string, updates: Partial<InsertAlert>): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    const updatedAlert = { ...alert, ...updates };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: new Date(),
      data: insertNotification.data ?? null,
      read: insertNotification.read ?? false
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    this.notifications.set(id, { ...notification, read: true });
    return true;
  }

  // Analytics
  async getAnalytics(type?: string, period?: string): Promise<Analytics[]> {
    let analytics = Array.from(this.analytics.values());
    if (type) analytics = analytics.filter(a => a.type === type);
    if (period) analytics = analytics.filter(a => a.period === period);
    return analytics;
  }

  async createAnalyticsEntry(entry: Omit<Analytics, 'id' | 'createdAt'>): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = {
      ...entry,
      id,
      createdAt: new Date()
    };
    this.analytics.set(id, analytics);
    return analytics;
  }
}

export const storage = new MemStorage();
