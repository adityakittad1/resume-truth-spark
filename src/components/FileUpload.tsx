/**
 * File Upload Component
 * Handles PDF and DOCX resume uploads with proper text extraction
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadProps {
  onFileSelect: (file: File | null, text: string | null) => void;
  selectedFile: File | null;
}

// Supported file types
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract text from PDF using pdf.js
  const extractPdfText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }
      
      return fullText.trim();
    } catch (err) {
      console.error("PDF extraction error:", err);
      throw new Error("Failed to extract text from PDF");
    }
  };

  // Extract text from DOCX using mammoth
  const extractDocxText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (err) {
      console.error("DOCX extraction error:", err);
      throw new Error("Failed to extract text from DOCX");
    }
  };

  // Main extraction function
  const extractText = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      return await extractPdfText(file);
    }
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return await extractDocxText(file);
    }

    throw new Error("Unsupported file type");
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a PDF or DOCX file";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
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
      
      if (!text || text.length < 50) {
        setError("Could not extract enough text from the file. Please ensure your resume contains readable text.");
        onFileSelect(null, null);
        return;
      }
      
      onFileSelect(file, text);
    } catch (err) {
      console.error("File processing error:", err);
      setError("Failed to read file. Please try a different file or ensure it contains readable text.");
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
                {(selectedFile.size / 1024).toFixed(1)} KB - Ready for analysis
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
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {isProcessing ? "Extracting text from resume..." : "Drop your resume here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse (PDF, DOCX up to 10MB)
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
