export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  academicBackground: {
    degree: string;
    field: string;
    university: string;
    graduationYear?: number;
  };
  skills: string[];
  interests: string[];
  profileCompletion: number;
  cvUrl?: string;
  journeyStatus: JourneyStatus;
}

export type JourneyStatus = 'profile' | 'matching' | 'internship' | 'integration';

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  logo?: string;
  matchScore: number;
  matchStatus: 'pending' | 'matched' | 'rejected' | 'accepted';
  description: string;
  requirements: string[];
}

export interface Appointment {
  id: string;
  advisorName: string;
  advisorEmail: string;
  date: Date;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'support';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: 'housing' | 'language' | 'integration' | 'community';
  description: string;
  content: string;
  link?: string;
  updatedAt: Date;
}
