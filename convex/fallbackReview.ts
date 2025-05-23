// Fallback function to generate a basic review when the API is unavailable
export function generateBasicReview(prompt: string, code: string): string {
  // Determine language from code or prompt
  const language = detectLanguage(code, prompt);
  
  // Count lines of code
  const lineCount = code.split('\n').length;
  
  // Extract potential issues
  const lineReferences: string[] = [];
  const lines = code.split('\n');
  
  const maxLinesToAnalyze = Math.min(lines.length, 20); // Limit analysis to first 20 lines
  
  for (let i = 0; i < maxLinesToAnalyze; i++) {
    const line = i + 1;
    const codeLine = lines[i].trim();
    
    if (codeLine.includes('TODO') || codeLine.includes('FIXME')) {
      lineReferences.push(`### Line ${line}: TODO/FIXME\nThis line contains a TODO or FIXME comment that should be addressed.`);
    } else if (codeLine.includes('console.log') && (language === 'javascript' || language === 'typescript')) {
      lineReferences.push(`### Line ${line}: Debugging code\nConsider removing console.log statements in production code.`);
    } else if (codeLine.includes('var ') && (language === 'javascript' || language === 'typescript')) {
      lineReferences.push(`### Line ${line}: Variable declaration\nConsider using 'let' or 'const' instead of 'var' for better scoping.`);
    } else if (codeLine.includes('===') && codeLine.includes('null') && (language === 'javascript' || language === 'typescript')) {
      lineReferences.push(`### Line ${line}: Null check\nMake sure this null check is sufficient for your use case. Consider using optional chaining or nullish coalescing.`);
    } else if (codeLine.length > 80) {
      lineReferences.push(`### Line ${line}: Code length\nThis line exceeds the recommended line length of 80 characters. Consider breaking it into multiple lines for better readability.`);
    }
  }

  // Generate a basic code review with general best practices
  return `# Code Review

## Overview
This file contains ${lineCount} lines of ${language} code. Here's a general review.

## Line-Specific Feedback

${lineReferences.length > 0 ? lineReferences.join('\n\n') : 'No specific issues found in the first 20 lines.'}

## General Recommendations

1. **Code Organization**: 
   - Ensure your code is properly modularized with clear separation of concerns
   - Consider breaking down large functions into smaller, reusable components

2. **Error Handling**:
   - Make sure all potential error conditions are properly handled
   - Avoid using generic catch blocks without specific error handling

3. **Documentation**:
   - Add comprehensive comments for complex logic
   - Include JSDoc or similar documentation for functions and classes

4. **Performance Considerations**:
   - Watch for potential performance bottlenecks, especially in loops or recursive functions
   - Consider caching results of expensive operations

5. **Security**:
   - Validate all user inputs
   - Use appropriate data sanitization techniques
   - Avoid exposing sensitive information in logs or error messages`;
}

// Helper function to detect programming language from code or prompt
export function detectLanguage(code: string, prompt: string): string {
  // Default language
  let language = 'code';
  
  // Check common language patterns in the code
  if (code.includes('function') && (code.includes('const ') || code.includes('let ') || code.includes('var '))) {
    language = 'javascript';
    // Check for TypeScript specific syntax
    if (code.includes(': string') || code.includes(': number') || code.includes(': boolean') || code.includes('<') && code.includes('>')) {
      language = 'typescript';
    }
  } else if (code.includes('import React') || code.includes('from "react"') || code.includes('className=')) {
    language = 'jsx/tsx';
  } else if (code.includes('class ') && code.includes('extends ') && code.includes('public ')) {
    language = 'java';
  } else if (code.includes('def ') && code.includes(':') && !code.includes('{')) {
    language = 'python';
  } else if (code.includes('#include') && (code.includes('<iostream>') || code.includes('<stdio.h>'))) {
    language = 'c/c++';
  }
  
  // Also try to extract language info from the prompt
  const lowerPrompt = prompt.toLowerCase();
  const languageKeywords = [
    { keyword: 'javascript', lang: 'javascript' },
    { keyword: 'typescript', lang: 'typescript' },
    { keyword: 'python', lang: 'python' },
    { keyword: 'java', lang: 'java' },
    { keyword: 'c++', lang: 'c++' },
    { keyword: 'c#', lang: 'c#' },
    { keyword: 'go', lang: 'go' },
    { keyword: 'ruby', lang: 'ruby' },
    { keyword: 'php', lang: 'php' },
    { keyword: 'swift', lang: 'swift' },
    { keyword: 'kotlin', lang: 'kotlin' },
    { keyword: 'rust', lang: 'rust' }
  ];
  
  for (const { keyword, lang } of languageKeywords) {
    if (lowerPrompt.includes(keyword)) {
      language = lang;
      break;
    }
  }
  
  return language;
}
