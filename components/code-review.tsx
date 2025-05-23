"use client";

import { MarkdownRenderer } from "./markdown-renderer";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface CodeReviewProps {
  review: string;
  onRefresh?: () => void;
}

export function CodeReview({ review, onRefresh }: CodeReviewProps) {
  const handleCopy = () => {
    if (review) {
      navigator.clipboard.writeText(review);
      toast.success("Review copied to clipboard");
    }
  };

  const handleRefresh = () => {
    // If parent provided a refresh callback, call it
    if (onRefresh) {
      onRefresh();
      toast.info("Review refreshed");
    }
  };
  return (
    <div className="h-full bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">💖 Code Review</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleCopy}
            variant="outline"
            size="sm"
            disabled={!review}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-120px)]">
          {review ? (
            <div className="p-4 text-foreground">
              <MarkdownRenderer content={review} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground h-full">
              <svg className="w-12 h-12 mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Click &quot;Review File&quot; to analyze this file</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
