"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  phone_number : string;
  first_name : string;
  middle_name?: string;
  last_name : string;
  gender?:  string;
  is_subscribe?: boolean;
  member_id?: string
  // subscription?: {
  //   _id?: string;
  // }
}


export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, token: string, rolePermission?: any) => void;
  logout: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);      // stores user info
  const [token, setToken] = useState<string | null>(null);  // stores auth token
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if(storedToken){
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // Login function (can be called after successful login)
  const login = (userData: User, token: string, rolePermission?:any) => {
    // console.log(rolePermission, "<=== on instance")
    // never persist credentials, even if a response still carries them
    const { password: _password, otp: _otp, ...safeUser } = (userData ?? {}) as User & { password?: unknown; otp?: unknown };
    localStorage.setItem("user_info", JSON.stringify(safeUser));
    if (token) {
      localStorage.setItem("auth_token", token);
    }
    localStorage.setItem("permission", JSON.stringify(rolePermission ?? []));
    setUser(safeUser as User);
    setToken(token || null);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user_info");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("permission");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



