export type JourneyStatus = 'profile' | 'matching' | 'internship' | 'integration';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  academicBackground: string;
  skills: string;
  interests: string;
  profileCompletion: number;
  cvUrl?: string;
  journeyStatus: JourneyStatus;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  logo?: string;
  matchScore: number;
  description: string;
  requirements: string;
}

export interface CompanyMatch {
  id: string;
  studentId: string;
  companyId: string;
  matchStatus: 'pending' | 'matched' | 'rejected' | 'accepted';
}

export interface Appointment {
  id: string;
  studentId: string;
  advisorName: string;
  advisorEmail: string;
  date: string;
  duration: number;
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
  timestamp: string;
  read: number;
}

export interface Resource {
  id: string;
  title: string;
  category: 'housing' | 'language' | 'integration' | 'community';
  description: string;
  content: string;
  link?: string;
  updatedAt: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
