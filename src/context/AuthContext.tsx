"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem("dummyUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("dummyUser");
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    // Dummy login, any email/pass works
    const dummyUser = { email };
    localStorage.setItem("dummyUser", JSON.stringify(dummyUser));
    setUser(dummyUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("dummyUser");
    setUser(null);
  };

  // Show a loading screen while checking auth state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-4 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
