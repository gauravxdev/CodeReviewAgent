"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { VisualEffects } from "@/components/visual-effects";
import { ClientOnly } from "@/components/client-only";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <ClientOnly>
          <VisualEffects />
        </ClientOnly>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Toaster richColors position="top-right" theme="system" />
      </AuthProvider>
    </ThemeProvider>
  );
}
