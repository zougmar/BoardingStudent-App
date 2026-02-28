// React primitives for creating and consuming context + hooks
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
// Shared TypeScript interfaces for the app's data models
import { Student, Company, Appointment, Message, Resource } from '../types';
import { useAuth } from './AuthContext';

// Shape of the global app context that components can consume via useApp()
interface AppContextType {
  student: Student | null;
  companies: Company[];
  appointments: Appointment[];
  messages: Message[];
  resources: Resource[];
  updateStudent: (student: Partial<Student>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateCompanyStatus: (companyId: string, status: Company['matchStatus']) => void;
  uploadCV: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const STORAGE_PREFIX = 'boardingStudent_';

function buildSeedStudent(userId: string, email: string, firstName: string, lastName: string): Student {
  return {
    id: userId,
    firstName,
    lastName,
    email,
    avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80',
    academicBackground: {
      degree: 'Bachelor',
      field: 'Computer Science',
      university: 'University Example',
    },
    skills: ['React', 'TypeScript', 'Node.js'],
    interests: ['Web Development', 'AI'],
    profileCompletion: 65,
    journeyStatus: 'matching',
  };
}

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'TechCorp', industry: 'Technology', location: 'Paris, France', matchScore: 92, matchStatus: 'matched', description: 'Leading tech company specializing in web applications', requirements: ['React', 'TypeScript', '3+ years experience'] },
  { id: '2', name: 'InnovateLab', industry: 'Software', location: 'Lyon, France', matchScore: 85, matchStatus: 'pending', description: 'Innovative software solutions for businesses', requirements: ['JavaScript', 'Node.js', 'Team collaboration'] },
  { id: '3', name: 'DataFlow', industry: 'Data Analytics', location: 'Marseille, France', matchScore: 78, matchStatus: 'pending', description: 'Data analytics and business intelligence', requirements: ['Python', 'SQL', 'Data visualization'] },
];

const MOCK_RESOURCES: Resource[] = [
  { id: '1', title: 'Finding Housing in France', category: 'housing', description: 'Complete guide to finding student accommodation', content: 'Guide content here...', updatedAt: new Date() },
  { id: '2', title: 'French Language Basics', category: 'language', description: 'Essential French phrases for daily life', content: 'Language content here...', updatedAt: new Date() },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);

  useEffect(() => {
    if (!user) {
      setStudent(null);
      setAppointments([]);
      setMessages([]);
      return;
    }
    const key = `${STORAGE_PREFIX}${user.id}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as Student;
        if (parsed.id && parsed.email) {
          setStudent(parsed);
        } else {
          setStudent(buildSeedStudent(user.id, user.email, user.firstName, user.lastName));
        }
      } else {
        setStudent(buildSeedStudent(user.id, user.email, user.firstName, user.lastName));
      }
    } catch {
      setStudent(buildSeedStudent(user.id, user.email, user.firstName, user.lastName));
    }
    setAppointments([
      { id: '1', advisorName: 'Sarah Johnson', advisorEmail: 'sarah.johnson@boarding.com', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), duration: 30, type: 'consultation', status: 'scheduled' },
    ]);
    setMessages([
      { id: '1', senderId: 'advisor-1', senderName: 'Sarah Johnson', recipientId: user.id, recipientName: `${user.firstName} ${user.lastName}`, content: 'Hello! I noticed your profile is 65% complete. Would you like to schedule a call to discuss your career goals?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), read: true },
    ]);
    setCompanies(MOCK_COMPANIES);
    setResources(MOCK_RESOURCES);
  }, [user]);

  const updateStudent = useCallback((updates: Partial<Student>) => {
    if (student) {
      const updated = { ...student, ...updates };
      let completion = 0;
      if (updated.firstName && updated.lastName) completion += 10;
      if (updated.email) completion += 10;
      if (updated.academicBackground?.degree && updated.academicBackground?.field) completion += 20;
      if (updated.academicBackground?.university) completion += 10;
      if ((updated.skills?.length ?? 0) > 0) completion += 15;
      if ((updated.interests?.length ?? 0) > 0) completion += 10;
      if (updated.cvUrl) completion += 25;
      updated.profileCompletion = Math.min(100, completion);
      setStudent(updated);
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${student.id}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  }, [student]);

  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointment, id: Date.now().toString() };
    setAppointments(prev => [...prev, newAppointment]);
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = { ...message, id: Date.now().toString(), timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const updateCompanyStatus = useCallback((companyId: string, status: Company['matchStatus']) => {
    setCompanies(prev => prev.map(c => (c.id === companyId ? { ...c, matchStatus: status } : c)));
  }, []);

  const uploadCV = useCallback(async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const cvUrl = URL.createObjectURL(file);
    if (student) {
      updateStudent({ cvUrl });
    }
  }, [student, updateStudent]);

  return (
    <AppContext.Provider
      value={{
        student,
        companies,
        appointments,
        messages,
        resources,
        updateStudent,
        addAppointment,
        addMessage,
        updateCompanyStatus,
        uploadCV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
