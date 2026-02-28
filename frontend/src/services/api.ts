// API service layer – app runs standalone with demo data.
// Replace with real API calls when connecting to a backend.

import { Student, Company, Appointment, Message, Resource } from '../types';

// Company dashboard: type for matched students (used by CompanyDashboardPage)
export interface MatchedStudentItem {
  matchId: string;
  matchStatus: 'pending' | 'matched' | 'rejected' | 'accepted';
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    academicBackground: { degree?: string; field?: string; university?: string; graduationYear?: number };
    skills: string[];
    interests: string[];
    profileCompletion: number;
    cvUrl?: string;
    journeyStatus: string;
  };
}

export const companyDashboardAPI = {
  getMatchedStudents: async (): Promise<MatchedStudentItem[]> => [],
  updateMatchStatus: async (_matchId: string, _status: MatchedStudentItem['matchStatus']): Promise<void> => {},
};

export const studentAPI = {
  getProfile: async (): Promise<Student> => {
    throw new Error('Not implemented – use AppContext');
  },
  updateProfile: async (_updates: Partial<Student>): Promise<Student> => {
    throw new Error('Not implemented – use AppContext');
  },
  uploadCV: async (_file: File): Promise<string> => {
    throw new Error('Not implemented – use AppContext');
  },
};

export const companiesAPI = {
  getMatches: async (): Promise<Company[]> => {
    throw new Error('Not implemented – use AppContext');
  },
  updateMatchStatus: async (_companyId: string, _status: Company['matchStatus']): Promise<void> => {},
};

export const appointmentsAPI = {
  getAppointments: async (): Promise<Appointment[]> => {
    throw new Error('Not implemented – use AppContext');
  },
  createAppointment: async (_appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    throw new Error('Not implemented – use AppContext');
  },
};

export const messagesAPI = {
  getMessages: async (): Promise<Message[]> => {
    throw new Error('Not implemented – use AppContext');
  },
  sendMessage: async (_message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    throw new Error('Not implemented – use AppContext');
  },
};

export const resourcesAPI = {
  getResources: async (): Promise<Resource[]> => {
    throw new Error('Not implemented – use AppContext');
  },
};
