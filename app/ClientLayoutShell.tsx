"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { VisualEffects } from "@/components/visual-effects";
import { ClientOnly } from "@/components/client-only";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ClientOnly>
        <VisualEffects />
      </ClientOnly>
      <ConvexClientProvider>{children}</ConvexClientProvider>
      <Toaster richColors position="top-right" theme="system" />
    </ThemeProvider>
  );
}
