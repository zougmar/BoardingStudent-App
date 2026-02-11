// React primitives for creating and consuming context + hooks
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Shared TypeScript interfaces for the app's data models
import { Student, Company, Appointment, Message, Resource } from '../types';

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

// Create the context object without a default value (we enforce provider usage)
const AppContext = createContext<AppContextType | undefined>(undefined);

// Convenience hook for consuming the app context safely
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Top-level provider that stores mock data and exposes helpers
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Student object (profile, journey, etc.)
  const [student, setStudent] = useState<Student | null>(null);
  // List of matched companies
  const [companies, setCompanies] = useState<Company[]>([]);
  // Appointments between student and advisors
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Messages exchanged with advisors
  const [messages, setMessages] = useState<Message[]>([]);
  // Onboarding / integration resources
  const [resources, setResources] = useState<Resource[]>([]);

  // Initialize mock data once when the app loads (can later be replaced by API calls)
  useEffect(() => {
    // Base mock student used when nothing is stored locally
    const mockStudent: Student = {
      id: '1',
      firstName: 'omar',
      lastName: 'zouglah',
      email: 'o.zouglah03@gmail.com',
      // Sample avatar image for the mock student (can later come from API or upload)
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

    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TechCorp',
        industry: 'Technology',
        location: 'Paris, France',
        matchScore: 92,
        matchStatus: 'matched',
        description: 'Leading tech company specializing in web applications',
        requirements: ['React', 'TypeScript', '3+ years experience'],
      },
      {
        id: '2',
        name: 'InnovateLab',
        industry: 'Software',
        location: 'Lyon, France',
        matchScore: 85,
        matchStatus: 'pending',
        description: 'Innovative software solutions for businesses',
        requirements: ['JavaScript', 'Node.js', 'Team collaboration'],
      },
      {
        id: '3',
        name: 'DataFlow',
        industry: 'Data Analytics',
        location: 'Marseille, France',
        matchScore: 78,
        matchStatus: 'pending',
        description: 'Data analytics and business intelligence',
        requirements: ['Python', 'SQL', 'Data visualization'],
      },
    ];

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        advisorName: 'Sarah Johnson',
        advisorEmail: 'sarah.johnson@boarding.com',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        duration: 30,
        type: 'consultation',
        status: 'scheduled',
      },
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'advisor-1',
        senderName: 'Sarah Johnson',
        recipientId: '1',
        recipientName: 'John Doe',
        content: 'Hello! I noticed your profile is 65% complete. Would you like to schedule a call to discuss your career goals?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ];

    const mockResources: Resource[] = [
      {
        id: '1',
        title: 'Finding Housing in France',
        category: 'housing',
        description: 'Complete guide to finding student accommodation',
        content: 'Guide content here...',
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'French Language Basics',
        category: 'language',
        description: 'Essential French phrases for daily life',
        content: 'Language content here...',
        updatedAt: new Date(),
      },
    ];

    // Try to restore student profile from localStorage (so avatar and profile
    // changes persist across refreshes). If anything goes wrong, fall back to
    // the default mock student.
    try {
      const stored = localStorage.getItem('boardingStudent');
      if (stored) {
        const parsed = JSON.parse(stored) as Student;
        setStudent(parsed);
      } else {
        setStudent(mockStudent);
      }
    } catch {
      setStudent(mockStudent);
    }
    setCompanies(mockCompanies);
    setAppointments(mockAppointments);
    setMessages(mockMessages);
    setResources(mockResources);
  }, []);

  // Merge partial updates into the student object and recompute completion
  const updateStudent = (updates: Partial<Student>) => {
    if (student) {
      const updated = { ...student, ...updates };
      // Calculate profile completion
      let completion = 0;
      if (updated.firstName && updated.lastName) completion += 10;
      if (updated.email) completion += 10;
      if (updated.academicBackground.degree && updated.academicBackground.field) completion += 20;
      if (updated.academicBackground.university) completion += 10;
      if (updated.skills.length > 0) completion += 15;
      if (updated.interests.length > 0) completion += 10;
      if (updated.cvUrl) completion += 25;
      updated.profileCompletion = Math.min(100, completion);
      setStudent(updated);
      // Persist updated student to localStorage so data (including avatar) survives refresh
      try {
        localStorage.setItem('boardingStudent', JSON.stringify(updated));
      } catch {
        // Ignore storage errors (e.g., private mode or quota exceeded)
      }
    }
  };

  // Add a new appointment to the list, generating a simple id
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  // Add a new message to the conversation, attaching id and timestamp
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  // Update the match status for a single company by id
  const updateCompanyStatus = (companyId: string, status: Company['matchStatus']) => {
    setCompanies(companies.map(c => 
      c.id === companyId ? { ...c, matchStatus: status } : c
    ));
  };

  // Simulate CV upload and attach a temporary URL to the student
  const uploadCV = async (file: File) => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    const cvUrl = URL.createObjectURL(file);
    if (student) {
      updateStudent({ cvUrl });
    }
  };

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
