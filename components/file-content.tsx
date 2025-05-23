"use client";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";
import { ReviewButton } from "./review-button";

interface FileContentProps {
  selectedFile: string;
  fileContent: string;
  highlightedLines: number[];
  lineComments: Record<number, string>;
  onLineClick: (lineNumber: number, e: React.MouseEvent) => void;
  setReview: (review: string) => void;
  showDialog: boolean;
  selectedLine: number | null;
  onCloseDialog: () => void;
}

export function FileContent({
  selectedFile,
  fileContent,
  highlightedLines,
  lineComments,
  onLineClick,
  setReview,
  showDialog,
  selectedLine,
  onCloseDialog,
}: FileContentProps) {
  const { theme } = useTheme();
  console.log(lineComments);
  const getLanguageFromFileName = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
      case "jsx":
        return "javascript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "text";
    }
  };

  const lineProps = (lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const comment = lineComments[lineNumber];
    console.log("Line number:", lineNumber, "Comment:", comment);

    return {
      style: {
        display: "block",
        backgroundColor: isHighlighted
          ? theme === "dark" ? "rgba(255, 255, 0, 0.2)" : "rgba(255, 215, 0, 0.15)"
          : "transparent",
        borderLeft: isHighlighted ? "3px solid #ffd700" : "none",
        paddingLeft: isHighlighted ? "5px" : "0",
        transition: "background-color 0.2s ease",
        cursor: isHighlighted ? "pointer" : "default",
      },
      onClick: (e: React.MouseEvent) => {
        if (isHighlighted && comment) {
          console.log("Clicking line:", lineNumber, "Comment:", comment);
          onLineClick(lineNumber, e);
        }
      },
    };
  };

  return (
    <>
      <div className='h-full bg-card flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b border-border'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-foreground'>{selectedFile || 'No file selected'}</span>
            <span className='text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground'>{selectedFile ? getLanguageFromFileName(selectedFile) : ''}</span>
          </div>
          {selectedFile && (
            <ReviewButton
              selectedFile={selectedFile}
              fileContent={fileContent}
              setReview={setReview}
            />
          )}
        </div>
        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-[calc(100vh-120px)]'>
            {selectedFile ? (
              <div className='relative'>
                <div className='overflow-x-auto bg-card'>
                  <SyntaxHighlighter
                    language={getLanguageFromFileName(selectedFile)}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      background: "transparent",
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      wordWrap: "break-word",
                    }}
                    showLineNumbers
                    wrapLines={true}
                    wrapLongLines={true}
                    lineProps={lineProps}
                    style={theme === "dark" ? vscDarkPlus : oneLight}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <div className='h-full flex items-center justify-center text-muted-foreground'>
                <p>Select a file from the list to view its content</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={onCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Line {selectedLine}</DialogTitle>
          </DialogHeader>
          <div className='prose dark:prose-invert max-w-none text-sm'>
            <p className='whitespace-pre-wrap'>
              {selectedLine
                ? (() => {
                    console.log("Dialog - Selected Line:", selectedLine);
                    console.log("Dialog - Line Comments:", lineComments);
                    console.log(
                      "Dialog - Comment for selected line:",
                      lineComments[selectedLine]
                    );
                    return lineComments[selectedLine];
                  })()
                : ""}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
