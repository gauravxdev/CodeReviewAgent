import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { VisualEffects } from "@/components/visual-effects";
import { ClientOnly } from "@/components/client-only";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "AI Code Review Agent",
  description: "AI-powered code review assistant for your projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <html lang="en" suppressHydrationWarning>
          <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
            <ClientOnly>
              <VisualEffects />
            </ClientOnly>
            <ConvexClientProvider>{children}</ConvexClientProvider>
            <Toaster richColors position="top-right" theme="system" />
          </body>
        </html>
      </AuthProvider>
    </ThemeProvider>
  );
}