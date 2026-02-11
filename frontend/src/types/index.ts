// Core student profile information used across the app
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  // Optional URL to the student's profile image / avatar
  avatarUrl?: string;
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

// All possible statuses for the student's journey progress
export type JourneyStatus = 'profile' | 'matching' | 'internship' | 'integration';

// Company used in the matching view
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

// Appointment between student and advisor
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

// Message exchanged between student and advisor
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

// Static resource entry (guides, links, etc.)
export interface Resource {
  id: string;
  title: string;
  category: 'housing' | 'language' | 'integration' | 'community';
  description: string;
  content: string;
  link?: string;
  updatedAt: Date;
}
