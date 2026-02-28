import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'boardingAuth';
const USERS_STORAGE_KEY = 'boardingUsers';

// Seed users for demo (passwords are plain for demo only)
const SEED_USERS: Array<{ id: string; email: string; password: string; firstName: string; lastName: string }> = [
  { id: 'seed-1', email: 'student@boarding.com', password: 'demo123', firstName: 'Demo', lastName: 'Student' },
  { id: 'seed-2', email: 'o.zouglah03@gmail.com', password: 'demo123', firstName: 'Omar', lastName: 'Zouglah' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

function getStoredAuth(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as User;
    return data?.id && data?.email ? data : null;
  } catch {
    return null;
  }
}

function getRegisteredUsers(): Array<{ id: string; email: string; password: string; firstName: string; lastName: string }> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: Array<{ id: string; email: string; password: string; firstName: string; lastName: string }>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredAuth());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const pwd = password.trim();

    const seed = SEED_USERS.find(u => u.email.toLowerCase() === normalizedEmail);
    if (seed && seed.password === pwd) {
      const u: User = { id: seed.id, email: seed.email, firstName: seed.firstName, lastName: seed.lastName };
      setUser(u);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
      return { success: true };
    }

    const registered = getRegisteredUsers();
    const found = registered.find(u => u.email.toLowerCase() === normalizedEmail);
    if (found && found.password === pwd) {
      const u: User = { id: found.id, email: found.email, firstName: found.firstName, lastName: found.lastName };
      setUser(u);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const pwd = password.trim();
    const first = firstName.trim();
    const last = lastName.trim();

    if (!first || !last) return { success: false, error: 'First and last name are required' };
    if (!pwd || pwd.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const exists = SEED_USERS.some(u => u.email.toLowerCase() === normalizedEmail);
    if (exists) return { success: false, error: 'An account with this email already exists' };

    const registered = getRegisteredUsers();
    if (registered.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser = {
      id: `reg-${Date.now()}`,
      email: normalizedEmail,
      password: pwd,
      firstName: first,
      lastName: last,
    };
    registered.push(newUser);
    saveRegisteredUsers(registered);

    const u: User = { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName };
    setUser(u);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
