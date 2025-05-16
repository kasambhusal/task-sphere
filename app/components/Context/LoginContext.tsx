"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define types
interface LoginContextType {
  isLoggedIn: boolean;
  LogIn: () => void;
  LogOut: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

interface LoginProviderProps {
  children: ReactNode;
}

// Create the provider component
export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const LogIn = () => {
    setIsLoggedIn(true);
  };
  const LogOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, LogIn, LogOut }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to use the login context
export const useLoginContext = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
};
