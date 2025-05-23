'use client';

import Link from 'next/link';
import { FAQSection } from '@/components/faq-section';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { useRef } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { HeroGrid } from '@/components/hero-grid';

// Optimized animation variants with reduced complexity for better performance
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6, // Reduced duration for better performance
      ease: "easeOut"
    }
  }
};

const fadeInStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Reduced stagger time
      delayChildren: 0.2 // Reduced delay
    }
  }
};

// Simplified floating animation with minimal transform
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -4, 0], // Reduced movement distance
    transition: {
      duration: 4, // Slower animation requires less CPU
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut"
    }
  }
};

// Reusable section background component to reduce duplicate code
const SectionBackground = ({ opacity = 0.8 }: { opacity?: number }) => (
  <>
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ opacity }}>
      <HeroGrid />
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/5 to-background/20 z-0"></div>
  </>
);

export default function LandingPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Transform values used for scroll effects
  useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  return (
    <div ref={ref} className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-white dark:bg-[#030014] z-0" />
      <div className="fixed inset-0 bg-grid-neutral-800/[0.03] dark:bg-grid-white/[0.02] bg-[length:50px_50px] z-0" style={{ backgroundImage: "url('/grid.svg')" }} />
      <div className="absolute top-0 z-0 h-full w-full bg-white dark:bg-black"></div>
      {/* Radial gradient */}
      {/* Fixed background glow elements instead of animated for better performance */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/10 dark:bg-blue-500/10 blur-[80px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full bg-purple-500/10 dark:bg-purple-500/10 blur-[80px] opacity-20" />
      </div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />
        
        {/* Hero Section with Grid Background */}
        <section className="relative py-18 md:py-28 overflow-hidden">
          {/* Using reusable background component */}
          <SectionBackground opacity={1} />
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeInStagger}
                className="w-full md:w-1/2 space-y-8"
              >
                <motion.div variants={fadeIn} className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700/30">AI-Powered Code Review</span>
                  <span className="px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-700/30">New Features</span>
                </motion.div>
                
                <motion.h1 
                  variants={fadeIn}
                  className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
                >
                  Ship Better Code <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Faster</span>
                </motion.h1>
                
                <motion.p 
                  variants={fadeIn}
                  className="text-lg md:text-xl text-slate-700 dark:text-zinc-300 max-w-xl"
                >
                  Automate code reviews with AI. Get actionable feedback on quality, security, and performance issues to streamline your development workflow and reduce technical debt.  
                </motion.p>
                
                <motion.div variants={fadeIn} className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center text-sm text-slate-600 dark:text-zinc-400">✓ Security Scanning</span>
                  <span className="inline-flex items-center text-sm text-slate-600 dark:text-zinc-400">✓ Performance Analysis</span>
                  <span className="inline-flex items-center text-sm text-slate-600 dark:text-zinc-400">✓ Best Practices</span>
                  <span className="inline-flex items-center text-sm text-slate-600 dark:text-zinc-400">✓ Code Suggestions</span>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/code" 
                    className="group relative overflow-hidden rounded-lg px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-600 dark:to-blue-500 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20"
                  >
                    <span className="relative z-10">Get Started</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-600 dark:to-blue-400 group-hover:opacity-0 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-blue-500 dark:to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                  
                  <Link 
                    href="/codereview" 
                    className="group relative overflow-hidden rounded-lg px-6 py-3 bg-transparent border border-slate-400 dark:border-zinc-700 text-foreground font-medium transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <span>Try Code Review</span>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial="initial"
                animate="animate"
                variants={floatingAnimation}
                className="w-full md:w-1/2 p-4"
                style={{ willChange: 'transform' }} // Optimize for animation performance
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white/80 dark:bg-[#0A101F]/80 backdrop-blur-sm rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800/80 shadow-2xl shadow-blue-500/5"
                >
                  <div className="bg-slate-100 dark:bg-[#0A101F] px-4 py-2 border-b border-slate-200 dark:border-zinc-800/80 flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-2 text-xs text-slate-600 dark:text-zinc-400 font-mono">code-review.ts</div>
                  </div>
                  <div className="p-4 font-mono text-sm text-slate-800 dark:text-zinc-300 overflow-x-auto">
                    <motion.pre 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="text-xs md:text-sm"
                    >
                      <code>
                        <span className="text-blue-600 dark:text-blue-400">function</span> <span className="text-green-600 dark:text-green-400">reviewCode</span>() &#123;<br/>
                        &nbsp;&nbsp;<span className="text-purple-600 dark:text-purple-400">const</span> aiAgent = <span className="text-blue-600 dark:text-blue-400">new</span> <span className="text-green-600 dark:text-green-400">CodeReviewAgent</span>();<br/>
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">const</span> feedback = aiAgent.<span className="text-green-600 dark:text-green-400">analyze</span>(codebase);<br/>
                        &nbsp;&nbsp;<span className="text-purple-600 dark:text-purple-400">return</span> feedback;<br/>
                        &#125;<br/><br/>
                        <span className="text-slate-500 dark:text-zinc-500">{/* AI Feedback */}</span><br/>
                        <span className="text-slate-500 dark:text-zinc-500">{/* Security issue detected: Potential SQL injection on line 42 */}</span><br/>
                        <span className="text-slate-500 dark:text-zinc-500">{/* Performance improvement: Consider memoizing this function */}</span>
                      </code>
                    </motion.pre>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32 relative overflow-hidden border-t border-slate-200/10 dark:border-zinc-800/10">
          <SectionBackground opacity={0.9} />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }} // Reduced margin for better performance
              variants={fadeInStagger}
              className="text-center mb-16"
            >
              <motion.h2 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
              >
                How It Works
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="mt-4 text-lg text-slate-600 dark:text-zinc-300 max-w-2xl mx-auto"
              >
                Our AI-powered code review tool makes it easy to identify issues and improve your code quality.
              </motion.p>
              <motion.div
                variants={fadeIn}
                className="w-24 h-1 bg-white/20 mx-auto mt-6 rounded-full"
              />
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInStagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10"
            >
              {/* Card 1 */}
              <motion.div 
                variants={fadeIn} 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg flex items-center justify-center mb-2 relative shadow-inner border border-slate-200 dark:border-zinc-700">
                      <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 rounded-lg opacity-60" />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">1. Submit Your Code</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-zinc-300">
                      Either upload your files or connect to your GitHub repository to get started with the review process.
                    </p>
                  </CardContent>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-transparent" />
                </Card>
              </motion.div>
              
              {/* Card 2 */}
              <motion.div 
                variants={fadeIn} 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg flex items-center justify-center mb-2 relative shadow-inner border border-slate-200 dark:border-zinc-700">
                      <div className="absolute inset-0 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-lg opacity-60" />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">2. AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-zinc-300">
                      Our advanced AI model analyzes your code for bugs, security issues, performance bottlenecks, and style improvements.
                    </p>
                  </CardContent>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500/40 via-blue-500/40 to-transparent" />
                </Card>
              </motion.div>
              
              {/* Card 3 */}
              <motion.div 
                variants={fadeIn} 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-500/5 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg flex items-center justify-center mb-2 relative shadow-inner border border-slate-200 dark:border-zinc-700">
                      <div className="absolute inset-0 bg-green-600/10 dark:bg-green-600/20 rounded-lg opacity-60" />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">3. Get Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-zinc-300">
                      Receive detailed, actionable feedback with line-by-line comments to help you improve your code quality.
                    </p>
                  </CardContent>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500/40 via-emerald-500/40 to-transparent" />
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 relative overflow-hidden border-t border-slate-200/30 dark:border-zinc-800/30">
          <SectionBackground opacity={0.6} />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInStagger}
              className="text-center relative z-10"
            >
              <motion.h2 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white"
            >
              Ready to Ship Better Code?
            </motion.h2>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-slate-600 dark:text-white/70 max-w-2xl mx-auto mb-8"
            >
              Start using our AI-powered code review tool today and see the difference in your development process.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/code" 
                className="group relative overflow-hidden rounded-lg px-6 py-3 bg-black dark:bg-white/10 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
              >
                <span className="relative z-10">Get Started For Free</span>
                <span className="absolute inset-0 bg-black/80 dark:bg-white/5 group-hover:opacity-0 transition-opacity duration-300"></span>
                <span className="absolute inset-0 bg-black/90 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              
              <Link 
                href="/codereview" 
                className="group relative overflow-hidden rounded-lg px-6 py-3 bg-transparent border border-slate-300 dark:border-white/10 text-slate-700 dark:text-gray-300 font-medium transition-all duration-300 hover:border-black/50 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Schedule a Demo
              </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32 relative overflow-hidden border-t border-slate-200/10 dark:border-zinc-800/10">
          <SectionBackground opacity={0.5} />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }} // Reduced margin for better performance
              variants={fadeInStagger}
            >
              <FAQSection />
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 relative border-t border-slate-200/30 dark:border-white/5">
          {/* Custom footer background with darker gradient */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
            <HeroGrid />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-slate-100/80 to-slate-200 dark:from-background/80 dark:via-background/90 dark:to-[#030014] z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Review AI</h2>
                <p className="text-slate-600 dark:text-zinc-400 mt-2">Improving code quality with AI-powered reviews</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="/features" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                  <li><Link href="/docs" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                  <li><Link href="/blog" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link></li>
                  <li><Link href="/contact" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-600 dark:text-zinc-400 text-sm"> {new Date().getFullYear()} Code Review AI. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link href="/code" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Get Started
                </Link>
                <Link href="/codereview" className="text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Try Code Review
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
