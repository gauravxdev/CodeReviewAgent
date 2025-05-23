import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Basic code review fallback implementation
function generateBasicReview(filename: string, code: string): string {
  // Determine language from file extension
  const fileExtension = filename.split('.').pop()?.toLowerCase() || '';
  const language = getLanguageFromExtension(fileExtension);
  
  // Count lines of code
  const lineCount = code.split('\n').length;
  
  // Extract potential issues
  const lineReferences: string[] = [];
  const lines = code.split('\n');
  
  const maxLines = Math.min(20, lines.length);
  for (let i = 0; i < maxLines; i++) {
    const line = i + 1;
    const codeLine = lines[i].trim();
    
    if (codeLine.includes('TODO') || codeLine.includes('FIXME')) {
      lineReferences.push(`### Line ${line}: TODO/FIXME\nThis line contains a TODO or FIXME comment that should be addressed.`);
    } else if (codeLine.includes('console.log') && ['javascript', 'typescript'].includes(language)) {
      lineReferences.push(`### Line ${line}: Debugging code\nConsider removing console.log statements in production code.`);
    } else if (codeLine.length > 80) {
      lineReferences.push(`### Line ${line}: Code length\nThis line exceeds the recommended line length of 80 characters. Consider breaking it into multiple lines for better readability.`);
    }
  }

  return `# Code Review for ${filename}\n\n## Overview\nThis file contains ${lineCount} lines of ${language} code. Here's a general review.\n\n## Line-Specific Feedback\n\n${lineReferences.length > 0 ? lineReferences.join('\n\n') : 'No specific issues found in the analyzed lines.'}\n\n## General Recommendations\n\n1. **Code Organization**: \n   - Ensure your code is properly modularized with clear separation of concerns\n   - Consider breaking down large functions into smaller, reusable components\n\n2. **Error Handling**:\n   - Make sure all potential error conditions are properly handled\n   - Avoid using generic catch blocks without specific error handling\n\n3. **Documentation**:\n   - Add comprehensive comments for complex logic\n   - Include JSDoc or similar documentation for functions and classes\n\n4. **Performance Considerations**:\n   - Watch for potential performance bottlenecks, especially in loops or recursive functions\n   - Consider caching results of expensive operations\n\n5. **Security**:\n   - Validate all user inputs\n   - Use appropriate data sanitization techniques\n   - Avoid exposing sensitive information in logs or error messages`;
}

// Simple in-memory cache to avoid redundant API calls
const reviewCache = new Map();

export async function POST(request: Request) {
  try {
    const { filename, code } = await request.json();

    if (!filename || !code) {
      return NextResponse.json(
        { error: "Filename and code are required" },
        { status: 400 }
      );
    }

    // Generate a cache key based on file content
    const cacheKey = `${filename}_${Buffer.from(code).toString('base64').substring(0, 50)}`;

    // Check if we have a cached review
    if (reviewCache.has(cacheKey)) {
      console.log('Returning cached review for', filename);
      return NextResponse.json({ review: reviewCache.get(cacheKey) });
    }

    // Initialize Google Generative AI
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Configure safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Determine the programming language from the file extension
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    const language = getLanguageFromExtension(fileExtension);

    // Create the prompt
    const prompt = `
    You are an expert code reviewer with deep knowledge of software development best practices, design patterns, and security concerns. I'll provide you with code that needs to be reviewed.

    Here is a file named '${filename}' written in ${language}:

    \`\`\`${language}
    ${code}
    \`\`\`

    Please perform a thorough code review addressing the following:

    1. **Code Quality:** Identify any issues with code organization, readability, or maintainability.
    2. **Potential Bugs:** Find logic errors, edge cases, or potential runtime issues.
    3. **Performance Concerns:** Identify any inefficient code or performance bottlenecks.
    4. **Security Vulnerabilities:** Highlight any security issues or vulnerabilities.
    5. **Best Practices:** Suggest improvements based on industry best practices for ${language}.
    6. **Specific Recommendations:** Provide actionable suggestions for improvement.

    Format your response in Markdown with clear headings and code examples where appropriate.
    Be specific, detailed, and constructive in your feedback.
    `;

    // Try with different models in fallback sequence
    try {
      // Try models in order of preference
      const models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.0-pro-001'];
      let review = null;
      
      for (const modelName of models) {
        try {
          console.log(`Attempting review with ${modelName}`);
          const modelInstance = genAI.getGenerativeModel({ model: modelName });
          
          const result = await modelInstance.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            safetySettings,
            generationConfig: {
              temperature: 0.2,
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 4096,
            },
          });
          
          const response = result.response;
          review = response.text();
          console.log(`Successfully generated review with ${modelName}`);
          break; // Stop trying other models if this one worked
        } catch (modelError) {
          if (modelError instanceof Error) {
            console.log(`Error with ${modelName}: ${modelError.message}`);
          } else {
            console.log(`Unknown error with ${modelName}`);
          }
          // Continue to next model
        }
      }
      
      if (review) {
        // Cache the review
        reviewCache.set(cacheKey, review);
        return NextResponse.json({ review });
      } else {
        throw new Error("All models failed");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // If all API models fail, generate a basic review
      console.log("Generating fallback review");
      const fallbackReview = generateBasicReview(filename, code);
      return NextResponse.json({ 
        review: fallbackReview, 
        isFallback: true 
      });
    }
  } catch (error) {
    console.error("Error processing review request:", error);
    return NextResponse.json(
      { error: "Failed to process review request" },
      { status: 500 }
    );
  }
}

// Helper function to get language from file extension
function getLanguageFromExtension(extension?: string): string {
  if (!extension) return 'code';
  
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rb': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'rs': 'rust',
    'sh': 'bash',
    'md': 'markdown',
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
  };
  
  return extensionMap[extension] || 'code';
}
