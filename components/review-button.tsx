"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ReviewButtonProps {
  selectedFile: string;
  fileContent: string;
  setReview: (review: string) => void;
}

export function ReviewButton({
  selectedFile,
  fileContent,
  setReview,
}: ReviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
  };

  return (
    <Button onClick={handleReview} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Reviewing...
        </>
      ) : (
        "Review File"
      )}
    </Button>
  );
}
