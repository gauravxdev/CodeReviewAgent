import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { VisualEffects } from "@/components/visual-effects";
import { ClientOnly } from "@/components/client-only";

// Skip font modules entirely to avoid Turbopack errors

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
    <html lang='en' suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientOnly>
            <VisualEffects />
          </ClientOnly>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster richColors position="top-right" theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
