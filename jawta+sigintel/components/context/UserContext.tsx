
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define types for our context
interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  isDefaultUsername: boolean;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  username: 'Anonymous',
  setUsername: () => {},
  isDefaultUsername: true,
});

// Create provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with value from localStorage if available, otherwise use 'Anonymous'
  const [username, setUsername] = useState<string>(() => {
    // Try to get the username from localStorage when the component mounts
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem('jawta-username');
      return savedUsername || 'Anonymous';
    }
    return 'Anonymous';
  });

  const [isDefaultUsername, setIsDefaultUsername] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jawta-username') === null;
    }
    return true;
  });
  
  // Update localStorage when username changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jawta-username', username);
      setIsDefaultUsername(username === 'Anonymous');
    }
  }, [username]);
  
  // Update username function that will be exposed through context
  const updateUsername = (name: string) => {
    if (name && name.trim() !== '') {
      setUsername(name.trim());
    }
  };
  
  // Value object that will be provided to consumers
  const value = {
    username,
    setUsername: updateUsername,
    isDefaultUsername,
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy access to the UserContext
export const useUser = () => useContext(UserContext);
