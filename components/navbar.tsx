'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { ClientOnly } from './client-only';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Github, LogOut } from 'lucide-react';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle mounted state for animations
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Function removed as it's not being used

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <ClientOnly>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-md"
      >
        <div className="flex h-12 items-center justify-between px-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <Link href="/" className="mr-4 flex items-center space-x-2 group">
              <motion.svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group-hover:text-blue-400 transition-colors duration-300"
              >
                {/* Simple, elegant lens/eye shape */}
                <ellipse 
                  cx="12" 
                  cy="12" 
                  rx="8" 
                  ry="6" 
                  className="stroke-blue-500 group-hover:stroke-blue-400 transition-colors duration-300" 
                  strokeWidth="2" 
                  fill="transparent"
                />
                {/* Iris */}
                <circle 
                  cx="12" 
                  cy="12" 
                  r="2.5" 
                  className="fill-blue-500 group-hover:fill-blue-400 transition-colors duration-300" 
                />
              </motion.svg>
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-sm font-bold text-foreground group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors duration-300"
              >
                Login Lens
              </motion.span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1"
              >
                Home
              </Link>
              <Link 
                href="/code" 
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1"
              >
                Repository
              </Link>
              <Link 
                href="/codereview" 
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1"
              >
                Code Review
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="https://github.com/gauravxdev/CodeReviewAgent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300 text-foreground"
              aria-label="GitHub Repository"
            >
              <Github size={16} />
            </a>
            <ThemeToggle />
            
            {/* Clerk Authentication */}
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none focus:ring-0"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <button className="text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 px-3 py-1.5 rounded-md">
                  Sign In
                </button>
              </Link>
            </SignedOut>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300 md:hidden"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mounted && isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/40 md:hidden"
            >
              <nav className="flex flex-col space-y-2 p-4 bg-background/95 backdrop-blur-md">
                <Link 
                  href="/" 
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1"
                >
                  Home
                </Link>
                <Link 
                  href="/code" 
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1"
                >
                  Repository
                </Link>
                <Link 
                  href="/codereview" 
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1"
                >
                  Code Review
                </Link>
                <a 
                  href="https://github.com/kulkarniankita/ai-agent-code-review" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1 flex items-center space-x-2"
                >
                  <Github size={12} />
                  <span>GitHub</span>
                </a>
                
                {/* Authentication in mobile menu */}
                <SignedOut>
                  <Link href="/sign-in">
                    <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 px-2 py-1 flex items-center space-x-2">
                      <LogOut size={12} />
                      <span>Sign In</span>
                    </button>
                  </Link>
                </SignedOut>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </ClientOnly>
  );
}
