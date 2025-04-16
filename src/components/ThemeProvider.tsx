
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { isDarkMode } = useStore();
  
  // Effect to set dark mode class
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);
  
  return <>{children}</>;
};
