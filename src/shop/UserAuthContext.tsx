
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AuthProviderType = 'google' | 'facebook' | 'email' | 'phone' | 'guest';

export interface UserAccount {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  provider: AuthProviderType;
  isGuest: boolean;
}

interface UserAuthContextType {
  user: UserAccount | null;
  login: (provider: AuthProviderType, info?: Partial<UserAccount>) => void;
  logout: () => void;
  updateProfile: (info: Partial<UserAccount>) => void;
  isLoading: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('shop_user');
    return saved ? JSON.parse(saved) : {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      name: 'Guest User',
      provider: 'guest',
      isGuest: true
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('shop_user', JSON.stringify(user));
  }, [user]);

  const login = (provider: AuthProviderType, info?: Partial<UserAccount>) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newUser: UserAccount = {
        id: info?.id || 'u-' + Math.random().toString(36).substr(2, 9),
        name: info?.name || 'Authorized User',
        email: info?.email,
        phone: info?.phone,
        avatar: info?.avatar || `https://ui-avatars.com/api/?name=${info?.name || 'User'}&background=random`,
        provider,
        isGuest: false
      };
      setUser(newUser);
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    const guestUser: UserAccount = {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      name: 'Guest User',
      provider: 'guest',
      isGuest: true
    };
    setUser(guestUser);
  };

  const updateProfile = (info: Partial<UserAccount>) => {
    setUser(prev => prev ? { ...prev, ...info } : null);
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
