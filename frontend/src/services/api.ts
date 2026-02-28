// API service layer - ready for future integration with real backend APIs
// Right now, the app uses mock data from AppContext instead of calling these

import { Student, Company, Appointment, Message, Resource } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getAuthToken(): string | null {
  try {
    return localStorage.getItem('boardingToken');
  } catch {
    return null;
  }
}

// Company dashboard: matched students (for company users)
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
  getMatchedStudents: async (): Promise<MatchedStudentItem[]> => {
    if (!API_BASE) return [];
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/api/company/matched-students`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to load matched students');
    return res.json();
  },

  updateMatchStatus: async (matchId: string, status: MatchedStudentItem['matchStatus']): Promise<void> => {
    if (!API_BASE) return;
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/api/company/matches/${matchId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
  },
};
export const studentAPI = {
  getProfile: async (): Promise<Student> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/students/me`);
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },

  updateProfile: async (_updates: Partial<Student>): Promise<Student> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/students/me`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates),
    // });
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },

  uploadCV: async (_file: File): Promise<string> => {
    // TODO: Replace with actual API call
    // const formData = new FormData();
    // formData.append('cv', file);
    // const response = await fetch(`${API_BASE_URL}/students/me/cv`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await response.json();
    // return data.cvUrl;
    throw new Error('Not implemented - use AppContext');
  },
};

// companies API: matching companies and updating match status
export const companiesAPI = {
  getMatches: async (): Promise<Company[]> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/companies/matches`);
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },

  updateMatchStatus: async (_companyId: string, _status: Company['matchStatus']): Promise<void> => {
    // TODO: Replace with actual API call
    // await fetch(`${API_BASE_URL}/companies/${companyId}/match-status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status }),
    // });
    throw new Error('Not implemented - use AppContext');
  },
};

// Appointments API: listing and creating appointments
export const appointmentsAPI = {
  getAppointments: async (): Promise<Appointment[]> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/appointments`);
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },

  createAppointment: async (_appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/appointments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(appointment),
    // });
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },
};

// Messages API: inbox and sending messages
export const messagesAPI = {
  getMessages: async (): Promise<Message[]> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/messages`);
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },

  sendMessage: async (_message: Omit<Message, 'id' | 'timestamp'>): Promise<Message> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/messages`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(message),
    // });
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },
};

// Resources API: informational content for housing, language, etc.
export const resourcesAPI = {
  getResources: async (): Promise<Resource[]> => {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/resources`);
    // return response.json();
    throw new Error('Not implemented - use AppContext');
  },
};
