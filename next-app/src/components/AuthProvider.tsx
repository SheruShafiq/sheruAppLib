'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/definitions';
import { fetchUserById } from '@/lib/api';

interface AuthContextType {
  isLoggedIn: boolean;
  userData: User | undefined;
  setIsLoggedIn: (value: boolean) => void;
  setUserData: (user: User) => void;
  setUserID: (id: string) => void;
  refreshUserData: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | undefined>();
  const [userID, setUserID] = useState<string | undefined>();

  const refreshUserData = (id: string) => {
    if (!id) return;
    
    fetchUserById(
      id,
      (user) => {
        setUserData(user);
        setIsLoggedIn(true);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  };

  useEffect(() => {
    // Check for user ID in cookies on initial load
    const userIdFromCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userID='))
      ?.split('=')[1];
    
    if (userIdFromCookie) {
      setUserID(userIdFromCookie);
      refreshUserData(userIdFromCookie);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      refreshUserData(userID);
    }
  }, [userID]);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        userData, 
        setIsLoggedIn, 
        setUserData, 
        setUserID,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
