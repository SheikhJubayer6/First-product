
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1',
    name: 'Sheikh Jubayer',
    email: 'jubayerskh@gmail.com',
    role: 'Root',
    avatar: 'https://picsum.photos/seed/jubayer/100/100',
    permissions: ['*'] // All permissions
  },
  {
    id: 'u2',
    name: 'Anis Rahman',
    email: 'anis@example.com',
    role: 'Admin',
    avatar: 'https://picsum.photos/seed/anis/100/100',
    permissions: ['manage_products', 'manage_orders', 'manage_customers', 'manage_promotions']
  },
  {
    id: 'u3',
    name: 'Zakir Staff',
    email: 'zakir@staff.com',
    role: 'Employee',
    avatar: 'https://picsum.photos/seed/zakir/100/100',
    permissions: ['view_dashboard', 'manage_orders', 'view_products']
  },
  {
    id: 'u4',
    name: 'Pharma Supplier',
    email: 'supplier@pharma.com',
    role: 'Supplier',
    avatar: 'https://picsum.photos/seed/supplier/100/100',
    permissions: ['manage_own_products', 'view_stock']
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, pass: string) => {
    // For demo, any user in MOCK_USERS can login with "Jubayer6" or their specific pass
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser && pass === 'Jubayer6') {
      setUser(foundUser);
      localStorage.setItem('adminUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
