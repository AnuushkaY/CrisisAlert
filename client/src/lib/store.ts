import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'citizen' | 'authority';
export type Status = 'open' | 'in-progress' | 'resolved';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string; // Denormalized for simplicity
  description: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  status: Status;
  createdAt: string;
}

interface AppState {
  user: User | null;
  reports: Report[];
  login: (email: string, role: Role, password: string) => void;
  logout: () => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  updateReportStatus: (id: string, status: Status, resolvedImageUrl?: string) => void;
  deleteReport: (id: string) => void;
}

const MOCK_REPORTS: Report[] = [
  // ... (keep existing)
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      reports: MOCK_REPORTS,
      login: (email, role, password) => {
        // Mock validation - any password > 3 chars
        if (password.length < 4) throw new Error("Password too short");
        set({
          user: {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role,
            name: email.split('@')[0],
          },
        });
      },
      logout: () => set({ user: null }),
      addReport: (data) =>
        set((state) => ({
          reports: [
            {
              ...data,
              id: Math.random().toString(36).substr(2, 9),
              status: 'open',
              createdAt: new Date().toISOString(),
            },
            ...state.reports,
          ],
        })),
      updateReportStatus: (id, status, resolvedImageUrl) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, status, imageUrl: resolvedImageUrl || r.imageUrl } : r
          ),
        })),
      deleteReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'ecowatch-storage',
    }
  )
);
