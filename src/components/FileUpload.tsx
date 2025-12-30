/**
 * File Upload Component
 * Handles PDF and DOCX resume uploads with drag-and-drop
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null, text: string | null) => void;
  selectedFile: File | null;
}

// Supported file types
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract text from file
  const extractText = async (file: File): Promise<string> => {
    // For demo purposes, we'll extract text client-side
    // In production, this would use a proper PDF/DOCX parser
    
    // Simple text extraction for supported formats
    if (file.type === "application/pdf") {
      // PDF extraction would require pdf.js or similar
      // For now, return placeholder that triggers file read
      return await readFileAsText(file);
    }
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // DOCX extraction would require mammoth or similar
      return await readFileAsText(file);
    }

    return "";
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Basic extraction - in production use proper parsers
        resolve(content || "");
      };
      reader.onerror = reject;
      
      // For binary files, we'd need specialized libraries
      // This is a simplified version
      reader.readAsText(file);
    });
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a PDF or DOCX file";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await extractText(file);
      onFileSelect(file, text);
    } catch (err) {
      setError("Failed to read file. Please try a different file.");
      onFileSelect(null, null);
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleRemove = () => {
    onFileSelect(null, null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {selectedFile ? (
          // File selected state
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex items-center gap-3 p-4 bg-success/10 border-2 border-success rounded-lg"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/20">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          // Drop zone state
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
                isProcessing && "pointer-events-none opacity-60"
              )}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleInputChange}
                className="hidden"
                disabled={isProcessing}
              />
              
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {isProcessing ? "Processing..." : "Drop your resume here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse (PDF, DOCX)
                  </p>
                </div>
              </motion.div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
