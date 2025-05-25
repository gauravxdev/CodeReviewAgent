'use client';

import { useState, useEffect, useCallback } from 'react';
import { Octokit } from '@octokit/rest';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Navbar } from '@/components/navbar';
import { ClientOnly } from '@/components/client-only';
import { useUser } from '@clerk/nextjs';

interface FileData {
  name: string;
  path: string;
  content?: string;
  type: 'file' | 'dir';
}

const IGNORED_FILES = [
  'package.json',
  'package-lock.json',
  '.gitignore',
  '.eslintrc',
  'tsconfig.json',
  'next.config.js',
  'postcss.config.js',
  'tailwind.config.js',
  'node_modules',
  '.git',
  '.next',
];

const IGNORED_FOLDERS = [
  'images',
  'img',
  'assets',
  'media',
  'public',
  'static',
  'dist',
  'build',
];

const ALLOWED_EXTENSIONS = [
  // Code files
  '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.sass',
  '.json', '.md', '.txt', '.xml', '.yaml', '.yml',
  // Configuration
  '.env', '.env.example', '.env.local',
  // Other text files
  '.sh', '.bash'
];

export default function CodePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchedFiles, setFetchedFiles] = useState<FileData[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  // Client-side authentication check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not authenticated, redirecting to sign-up page');
      router.replace('/sign-up?redirect_url=' + encodeURIComponent(window.location.href));
    }
  }, [isLoaded, isSignedIn, router]);

  // Parse GitHub repository URL
  const parseGitHubUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname !== 'github.com') {
        throw new Error('Not a GitHub URL');
      }

      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length < 2) {
        throw new Error('Invalid GitHub repository URL');
      }

      return {
        owner: pathParts[0],
        repo: pathParts[1],
      };
    } catch {
      // Try a simple format like "owner/repo"
      const parts = url.split('/').filter(Boolean);
      if (parts.length === 2) {
        return {
          owner: parts[0],
          repo: parts[1],
        };
      }

      throw new Error('Invalid GitHub repository URL or format');
    }
  };

  // Add a log message
  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, [setLogs]);

  // Fetch repository files
  const fetchRepoFiles = async () => {
    setIsLoading(true);
    setError('');
    setFetchedFiles([]);
    setIsComplete(false);
    setLogs([]);

    try {
      // Validate and parse the GitHub URL
      const { owner, repo } = parseGitHubUrl(repoUrl);
      setRepoOwner(owner);
      setRepoName(repo);

      // Check if we have this repo cached in local storage
      const cacheKey = `repo_${owner}_${repo}`;
      const result = await fetchCachedRepo(owner, repo) || await fetchFreshRepo(owner, repo, cacheKey);
      
      return result;
    } catch (error) {
      setError((error as Error).message);
      addLog(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    fetchRepoFiles();
  };

  // Check if a file should be included based on name and extension
  const shouldIncludeFile = (fileName: string, fileSize: number = 0): boolean => {
    // Skip ignored files
    if (IGNORED_FILES.some(file => fileName.toLowerCase() === file.toLowerCase())) {
      return false;
    }
    
    // Check extension
    const extension = fileName.includes('.') 
      ? `.${fileName.split('.').pop()?.toLowerCase()}` 
      : '';
      
    // Skip files with unsupported extensions
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return false;
    }
    
    // Skip large files
    if (fileSize > 100000) { // 100KB
      return false;
    }
    
    return true;
  };
  
  // Check if a directory should be included
  const shouldIncludeDirectory = (dirName: string): boolean => {
    return !IGNORED_FOLDERS.some(folder => dirName.toLowerCase() === folder.toLowerCase());
  };
  
  // Helper function to update localStorage in one place
  const updateLocalStorage = useCallback((owner: string, repo: string, files: FileData[]) => {
    localStorage.setItem('repoOwner', owner);
    localStorage.setItem('repoName', repo);
    localStorage.setItem('fetchedFiles', JSON.stringify(files));
  }, []);
  
  // Fetch repo from cache
  const fetchCachedRepo = useCallback(async (owner: string, repo: string) => {
    const cacheKey = `repo_${owner}_${repo}`;
    try {
      const cachedEntry = localStorage.getItem(cacheKey);
      
      if (cachedEntry) {
        const { data, timestamp } = JSON.parse(cachedEntry);
        const cacheAge = Date.now() - timestamp;
        const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        
        if (cacheAge < CACHE_DURATION) {
          setFetchedFiles(data);
          setIsComplete(true);
          setLoadedFromCache(true);
          
          // Update related cache items in a single place
          updateLocalStorage(owner, repo, data);
          
          addLog(`Repository ${owner}/${repo} loaded from cache`);
          return true;
        } else {
          addLog('Cache expired, fetching fresh data');
          localStorage.removeItem(cacheKey);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return false;
    }
  }, [setFetchedFiles, setIsComplete, setLoadedFromCache, updateLocalStorage, addLog]);
  
  // When component mounts, check URL for repo params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const owner = params.get('owner');
    const repo = params.get('repo');
    
    if (owner && repo) {
      setRepoUrl(`${owner}/${repo}`);
      setRepoOwner(owner);
      setRepoName(repo);
      
      // Check if we have this repo cached
      const cacheKey = `repo_${owner}_${repo}`;
      if (localStorage.getItem(cacheKey)) {
        fetchCachedRepo(owner, repo);
      }
    }
  }, [fetchCachedRepo]);

  // Fetch fresh repo data and cache it
  const fetchFreshRepo = async (owner: string, repo: string, cacheKey: string) => {
    addLog(`Fetching repository: ${owner}/${repo}`);
    
    // Create Octokit instance with authentication
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';
    const octokit = new Octokit({
      auth: token
    });
    
    if (!token) {
      addLog('Warning: No GitHub token found. API rate limits will be restricted.');
    }
    
    // Recursive function to get all files
    const getFilesRecursively = async (path = ''): Promise<FileData[]> => {
      addLog(`Fetching files in path: ${path || 'root'}`);
      
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path,
        });

        // Handle single file response
        if (!Array.isArray(data)) {
          if (data.type === 'file') {
            try {
              if (!shouldIncludeFile(data.name, data.size)) {
                if (data.size > 100000) {
                  addLog(`Skipping large file (${Math.round(data.size/1024)}KB): ${data.path}`);
                } else {
                  addLog(`Skipping file with unsupported extension: ${data.path}`);
                }
                return [];
              }

              // Fetch and decode content
              const content = data.content ? atob(data.content) : '';
              
              const fileInfo: FileData = {
                name: data.name,
                path: data.path,
                content: content,
                type: 'file'
              };
              
              addLog(`Fetched file: ${data.path}`);
              return [fileInfo];
            } catch (error) {
              addLog(`Error fetching ${data.path}: ${(error as Error).message}`);
              return [];
            }
          }
          return [];
        }

        // Process directory items
        let allFiles: FileData[] = [];
        
        // Map items to simple objects first
        const items = data.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size
        }));
        
        // Filter items using helper functions
        const filteredItems = items.filter(item => {
          if (item.type === 'dir') {
            if (!shouldIncludeDirectory(item.name)) {
              addLog(`Skipping ignored directory: ${item.path}`);
              return false;
            }
            return true;
          }
          
          if (item.type === 'file') {
            if (!shouldIncludeFile(item.name)) {
              addLog(`Skipping ignored file: ${item.path}`);
              return false;
            }
            return true;
          }
          
          return false;
        });

        // First process directories
        for (const item of filteredItems.filter(item => item.type === 'dir')) {
          const nestedFiles = await getFilesRecursively(item.path);
          allFiles = [...allFiles, ...nestedFiles];
        }

        // Then process files
        for (const item of filteredItems.filter(item => item.type === 'file')) {
          try {
            const { data: fileData } = await octokit.repos.getContent({
              owner,
              repo,
              path: item.path,
            });

            if ('content' in fileData) {
              if (!shouldIncludeFile(item.name, item.size)) {
                if (item.size > 100000) {
                  addLog(`Skipping large file (${Math.round(item.size/1024)}KB): ${item.path}`);
                } else {
                  addLog(`Skipping file with unsupported extension: ${item.path}`);
                }
                continue;
              }

              const content = fileData.content ? atob(fileData.content) : '';
              
              const fileInfo: FileData = {
                name: item.name,
                path: item.path,
                content: content,
                type: 'file'
              };
              
              addLog(`Fetched file: ${item.path}`);
              allFiles.push(fileInfo);
            }
          } catch (error) {
            addLog(`Error fetching ${item.path}: ${(error as Error).message}`);
          }
        }

        return allFiles;
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
        addLog(`Error: ${(error as Error).message}`);
        return [];
      }
    };

    try {
      const files = await getFilesRecursively();
      setFetchedFiles(files);
      
      // Cache the fetched data with timestamp
      const cacheData = {
        data: files,
        timestamp: Date.now()
      };
      
      // Store in localStorage using helper function
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      updateLocalStorage(owner, repo, files);
      
      addLog(`Repository fetched and cached successfully. Total files: ${files.length}`);
      setIsComplete(true);
      return true;
    } catch (error) {
      setError(`Error fetching repository: ${(error as Error).message}`);
      setIsLoading(false);
      return false;
    }
  };
  
  // Handle review button click
  const handleReview = () => {
    // Use helper function to update localStorage
    updateLocalStorage(repoOwner, repoName, fetchedFiles);
    router.push('/codereview');
  };

  // Handle clear cache button click
  const handleClearCache = () => {
    const cacheKey = `repo_${repoOwner}_${repoName}`;
    // Remove the cached repository data
    localStorage.removeItem(cacheKey);
    // Reset state
    setLoadedFromCache(false);
    setIsComplete(false);
    setFetchedFiles([]);
    addLog(`Cache cleared for repository: ${repoOwner}/${repoName}`);
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="p-6">
        <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">GitHub Repository Code Fetcher</h1>
          <p className="text-muted-foreground">
            Enter a GitHub repository URL to fetch and review its code
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Repository Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo or username/repo"
                  className="w-full"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                variant="outline"
                className="md:w-auto"
              >
                {isLoading ? 'Fetching...' : 'Fetch Repository'}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="mb-6 border border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <div className="mr-2 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span>Fetching repository files...</span>
              </div>
              
              <ScrollArea className="h-40 w-full rounded-md border p-2">
                <div className="space-y-2">
                  {logs.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 text-sm text-foreground bg-muted rounded-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {isComplete && !loadedFromCache && (
          <Card className="mt-6 border border-border bg-card">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-foreground">Repository fetched successfully!</span>
              </div>
              <Button
                onClick={handleReview}
                variant="outline"
              >
                <span>Go to Code Review</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {isComplete && loadedFromCache && (
          <Card className="mt-6 border border-border bg-card">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-foreground">Repository loaded from cache</span>
                <Badge variant="outline" className="text-xs">{repoOwner}/{repoName}</Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleClearCache}
                  variant="outline"
                >
                  <span>Clear Cache</span>
                </Button>
                <Button
                  onClick={handleReview}
                  variant="outline"
                >
                  <span>Go to Code Review</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
      </div>
    </ClientOnly>
  );
}
