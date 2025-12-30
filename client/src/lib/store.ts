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
  login: (email: string, role: Role) => void;
  logout: () => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  updateReportStatus: (id: string, status: Status) => void;
  deleteReport: (id: string) => void;
}

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'John Doe',
    description: 'Overflowing dumpster behind the market.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80',
    location: { lat: 51.505, lng: -0.09 },
    status: 'open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Jane Smith',
    description: 'Construction debris left on sidewalk.',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    location: { lat: 51.51, lng: -0.1 },
    status: 'in-progress',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    userId: 'user-1',
    userName: 'John Doe',
    description: 'Plastic waste accumulation in the park corner.',
    imageUrl: 'https://images.unsplash.com/photo-1611288870280-4a39556b3c22?w=800&q=80',
    location: { lat: 51.515, lng: -0.09 },
    status: 'resolved',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      reports: MOCK_REPORTS,
      login: (email, role) => {
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
      updateReportStatus: (id, status) =>
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === id ? { ...r, status } : r
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
