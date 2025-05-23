"use client";


import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CodeReview } from "./code-review";
import { FileContent } from "./file-content";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ArrowLeft } from "lucide-react";

export function ReviewClient({
  files,
  selectedFile,
  file: currentFile,
  repoInfo,
}: {
  files: string[];
  selectedFile: { content?: string; error?: string };
  file: string;
  repoInfo: { owner: string; repo: string; } | null;
}) {
  const router = useRouter();
  const [review, setReview] = useState<string>("");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [lineComments, setLineComments] = useState<Record<number, string>>({});
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Reset review state when file changes
    setReview("");
    setHighlightedLines([]);
    setLineComments({});
    setSelectedLine(null);
    setShowDialog(false);
  }, [currentFile]);

  useEffect(() => {
    if (review) {
      const lines = new Set<number>();
      const comments: Record<number, string> = {};

      // Patterns to match line numbers in the review
      const lineNumberPatterns = [
        /Line\s+(\d+)-(\d+):/g, // Matches "Line 1-5:"
        /Line\s+(\d+):/g, // Matches "Line 1:"
        /^\s*(\d+)\.\s+/gm, // Matches "1. " at start of line
        /^\s*(\d+)\)\s+/gm, // Matches "1) " at start of line
        /^\s*(\d+)\s+/gm, // Matches "1 " at start of line
        /line\s+(\d+)/gi, // Matches "line 1" (case insensitive)
        /lines?\s+(\d+)(?:\s*-\s*(\d+))?/gi, // Matches "line 1" or "lines 1-5"
      ];

      for (const pattern of lineNumberPatterns) {
        let match;
        while ((match = pattern.exec(review)) !== null) {
          if (match[1] && match[2]) {
            // Handle line ranges (e.g., "lines 1-5")
            const startLine = parseInt(match[1]);
            const endLine = parseInt(match[2]);
            if (!isNaN(startLine) && !isNaN(endLine)) {
              for (let i = startLine; i <= endLine; i++) {
                lines.add(i);
                // Extract the comment text after the line number
                const commentStart = match.index + match[0].length;
                const nextSectionMatch = review
                  .slice(commentStart)
                  .match(
                    /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                  );
                if (nextSectionMatch) {
                  comments[i] = nextSectionMatch[0].trim();
                }
              }
            }
          } else if (match[1]) {
            // Handle single line (e.g., "line 1")
            const lineNumber = parseInt(match[1]);
            if (!isNaN(lineNumber)) {
              lines.add(lineNumber);
              const commentStart = match.index + match[0].length;
              const nextSectionMatch = review
                .slice(commentStart)
                .match(
                  /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                );
              if (nextSectionMatch) {
                comments[lineNumber] = nextSectionMatch[0].trim();
              }
            }
          }
        }
      }

      setHighlightedLines(Array.from(lines).sort((a, b) => a - b));
      setLineComments(comments);
    }
  }, [review]);

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedLine(null);
  };


  return (
    <div className="bg-background text-foreground">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Code Review</h1>
          <span className="text-sm text-muted-foreground">{files.length} files available for analysis</span>
          
          {repoInfo && (
            <div className='px-2 py-1 bg-muted rounded-md inline-flex items-center'>
              <span className='text-xs font-medium'>Repository: {repoInfo.owner}/{repoInfo.repo}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/code" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Repository</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-60px)]">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full bg-card border-r border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-medium text-foreground mb-2">📁 Project Files</h2>
              <p className="text-xs text-muted-foreground">Select a file to review for code analysis.</p>
            </div>
            <ScrollArea className="h-[calc(100vh-130px)]">
              <div className="p-2">
                {files.length === 0 ? (
                  <p className="text-muted-foreground text-sm p-2">Loading files...</p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file}
                      onClick={() => {
                        // Programmatically navigate with query params
                        router.push(`/codereview?path=${encodeURIComponent(file)}`);
                      }}
                      className={cn(
                        "block px-3 py-2 rounded text-sm transition-colors my-1 cursor-pointer",
                        file === currentFile 
                          ? "dark:bg-white/10 bg-zinc-800/10 text-foreground border-l-2 border-primary" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono truncate">{file}</span>
                        {file === currentFile && (
                          <Badge className="text-xs font-normal dark:bg-white dark:text-black bg-black text-white">Active</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-border after:bg-border" />
        
        <ResizablePanel defaultSize={50} minSize={30}>
          <FileContent
            selectedFile={currentFile}
            fileContent={selectedFile.content || ""}
            highlightedLines={highlightedLines}
            lineComments={lineComments}
            onLineClick={handleLineClick}
            setReview={setReview}
            showDialog={showDialog}
            selectedLine={selectedLine}
            onCloseDialog={handleCloseDialog}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-border after:bg-border" />
        
        <ResizablePanel defaultSize={30} minSize={20}>
          <CodeReview 
            review={review} 
            onRefresh={() => {
              // Reset the review state when refresh is clicked
              setReview("");
              setHighlightedLines([]);
              setLineComments({});
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
