import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Company, Appointment, Message, Resource } from '../types';

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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockStudent: Student = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
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

    setStudent(mockStudent);
    setCompanies(mockCompanies);
    setAppointments(mockAppointments);
    setMessages(mockMessages);
    setResources(mockResources);
  }, []);

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
    }
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const updateCompanyStatus = (companyId: string, status: Company['matchStatus']) => {
    setCompanies(companies.map(c => 
      c.id === companyId ? { ...c, matchStatus: status } : c
    ));
  };

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
