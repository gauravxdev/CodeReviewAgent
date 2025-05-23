"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
  disableTransitionOnChange?: boolean; 
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps & Record<string, unknown>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      disableTransitionOnChange={disableTransitionOnChange}
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
