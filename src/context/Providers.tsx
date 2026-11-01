import React, { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UsersProvider } from "./Users";
import { SettingContext } from "./SettingContext";

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <UsersProvider>{children}</UsersProvider>
    </AuthProvider>
  );
};

export default Providers;
