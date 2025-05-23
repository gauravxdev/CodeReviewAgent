'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20
    }
  }
};

export function FAQSection() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="w-full max-w-3xl mx-auto px-4 py-12"
    >
      <motion.h2 
        variants={item}
        className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white"
      >
        Frequently Asked Questions
      </motion.h2>
      
      <Accordion type="single" collapsible className="w-full space-y-4 cursor-pointer">
        <motion.div variants={item}>
          <AccordionItem value="item-1" className="border border-slate-200 dark:border-zinc-800 rounded-lg px-4 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300">
            <AccordionTrigger className="py-4 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">How does the AI code review work?</AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-zinc-300 animate-in fade-in-10 duration-300 cursor-pointer">
              Our AI model has been trained on millions of code examples and best practices. When you submit
              your code, it analyzes patterns, potential bugs, security vulnerabilities, and performance issues, then
              provides actionable feedback and suggestions for improvement.
            </AccordionContent>
          </AccordionItem>
        </motion.div>

        <motion.div variants={item}>
          <AccordionItem value="item-2" className="border border-slate-200 dark:border-zinc-800 rounded-lg px-4 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300">
            <AccordionTrigger className="py-4 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Which programming languages do you support?</AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-zinc-300 animate-in fade-in-10 duration-300">
              We support all major programming languages including JavaScript, TypeScript, Python, Java, C#, Ruby,
              Go, PHP, and many more. Our AI system is constantly learning and expanding its language capabilities.
            </AccordionContent>
          </AccordionItem>
        </motion.div>

        <motion.div variants={item}>
          <AccordionItem value="item-3" className="border border-slate-200 dark:border-zinc-800 rounded-lg px-4 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300">
            <AccordionTrigger className="py-4 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Is my code secure and private?</AccordionTrigger>
            <AccordionContent className="text-slate-700 dark:text-zinc-300 animate-in fade-in-10 duration-300">
              Absolutely. Your code is encrypted in transit and at rest. We do not store your code after analysis is
              complete, and we never share your code with third parties. Your intellectual property remains 100%
              yours.
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      </Accordion>
    </motion.div>
  );
}
