'use client';

import { ReviewClient } from "@/components/review-client";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/client-only';
import { useUser } from '@clerk/nextjs';

interface FileData {
  name: string;
  path: string;
  content?: string;
  type: 'file' | 'dir';
}

// Function to get files from local storage instead of API
const getAllFiles = () => {
  try {
    const filesData = localStorage.getItem('fetchedFiles');
    if (!filesData) {
      console.warn("No files data found in localStorage");
      return { files: [] };
    }
    
    const files = JSON.parse(filesData);
    if (!Array.isArray(files)) {
      console.error("Invalid files data format in localStorage");
      return { files: [] };
    }
    
    return { files: files.map((file: FileData) => file.path) };
  } catch (error) {
    console.error("Error getting files from local storage:", error);
    return { files: [] };
  }
};

// Function to get selected file content from local storage
function getSelectedFile(filePath: string) {
  try {
    if (!filePath) {
      return { error: "File path is required" };
    }

    // Get the content of the file from local storage
    const filesData = localStorage.getItem('fetchedFiles');
    if (!filesData) {
      return { error: "No repository data found. Please go back and fetch the repository again." };
    }
    
    const files = JSON.parse(filesData);
    if (!Array.isArray(files)) {
      return { error: "Invalid repository data format. Please go back and fetch the repository again." };
    }
    
    const file = files.find((f: FileData) => f.path === filePath);
    if (!file) {
      return { error: `File "${filePath}" not found in repository data` };
    }
    
    if (!file.content) {
      return { error: `File "${filePath}" has no content` };
    }
    
    return { content: file.content };
  } catch (error) {
    console.error("Error fetching file content from local storage:", error);
    return { error: "Failed to fetch file content. Please try refreshing the page." };
  }
}

// This component safely uses the useSearchParams hook
function CodeReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const path = searchParams.get('path') || '';
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ content?: string; error?: string }>({});
  const [repoInfo, setRepoInfo] = useState<{owner: string, repo: string} | null>(null);
  const { isLoaded, isSignedIn } = useUser();
  
  // Client-side authentication check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not authenticated, redirecting to sign-up page');
      router.replace('/sign-up?redirect_url=' + encodeURIComponent(window.location.href));
    }
  }, [isLoaded, isSignedIn, router]);
  
  useEffect(() => {
    function fetchData() {
      try {
        // Check if we have repository data in local storage
        const repoOwner = localStorage.getItem('repoOwner');
        const repoName = localStorage.getItem('repoName');
        
        if (repoOwner && repoName) {
          setRepoInfo({ owner: repoOwner, repo: repoName });
        }
        
        // Always get fresh data from localStorage
        const data = getAllFiles();
        setFiles(data?.files || []);
        
        if (path) {
          const fileData = getSelectedFile(path);
          setSelectedFile(fileData);
        }
      } catch (error) {
        console.error("Error loading repository data:", error);
        // Reset states if there's an error
        setFiles([]);
        setSelectedFile({ error: "Failed to load repository data. Please try refreshing the page." });
      }
    }
    
    // Call fetchData when component mounts or path changes
    fetchData();
    
    // Add window event listener for storage changes
    const handleStorageChange = () => fetchData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [path]);
  
  const handleBackToRepo = () => {
    router.push('/code');
  };
  
  // Function removed as it's not being used

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Navbar />
      
      {(!files.length && !repoInfo) ? (
        <div className='p-8 flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-bold mb-4'>No Repository Data</h2>
          <p className='text-muted-foreground mb-6'>Please fetch a repository first to view its code</p>
          <Button 
            onClick={handleBackToRepo}
            variant="outline"
          >
            Back to Repository Fetcher
          </Button>
        </div>
      ) : (
        <div className='page-container p-4'>
          <ReviewClient
            files={files}
            selectedFile={selectedFile}
            file={path}
            repoInfo={repoInfo}
          />
        </div>
      )}
    </div>
  );
}

// Main page component that wraps the content in Suspense
export default function CodeReviewPage() {
  return (
    <ClientOnly>
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <CodeReviewContent />
      </Suspense>
    </ClientOnly>
  );
}
