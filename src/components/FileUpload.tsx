/**
 * File Upload Component
 * Handles PDF and DOCX resume uploads with proper text extraction
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import mammoth from "mammoth";

interface FileUploadProps {
  onFileSelect: (file: File | null, text: string | null) => void;
  selectedFile: File | null;
}

// Supported file types
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract text from PDF using basic binary parsing
  const extractPdfText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Convert to string for text extraction
      let text = "";
      
      // Try to decode as UTF-8 first
      try {
        const decoder = new TextDecoder("utf-8", { fatal: false });
        const rawText = decoder.decode(bytes);
        
        // Extract text between stream markers and from text objects
        // PDF text is often between BT...ET markers or in parentheses
        const textMatches = rawText.match(/\(([^)]+)\)/g) || [];
        const streamMatches = rawText.match(/BT[\s\S]*?ET/g) || [];
        
        // Extract readable strings from the PDF
        textMatches.forEach(match => {
          const cleaned = match.slice(1, -1)
            .replace(/\\n/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\/g, "");
          if (cleaned.length > 2 && /[a-zA-Z]/.test(cleaned)) {
            text += cleaned + " ";
          }
        });
        
        // Also try to extract from streams
        streamMatches.forEach(stream => {
          const tjMatches = stream.match(/\[([^\]]+)\]\s*TJ/g) || [];
          tjMatches.forEach(tj => {
            const parts = tj.match(/\(([^)]+)\)/g) || [];
            parts.forEach(part => {
              const cleaned = part.slice(1, -1);
              if (cleaned.length > 1) {
                text += cleaned;
              }
            });
            text += " ";
          });
          
          const textMatches = stream.match(/\(([^)]+)\)\s*Tj/g) || [];
          textMatches.forEach(match => {
            const cleaned = match.replace(/\)\s*Tj$/, "").slice(1);
            if (cleaned.length > 1) {
              text += cleaned + " ";
            }
          });
        });
      } catch (e) {
        console.log("UTF-8 decode failed, trying Latin-1");
      }
      
      // Clean up the extracted text
      text = text
        .replace(/\s+/g, " ")
        .replace(/[^\x20-\x7E\n]/g, " ")
        .trim();
      
      // If we couldn't extract much, try a simpler approach
      if (text.length < 100) {
        // Simple approach: extract all printable ASCII sequences
        const decoder = new TextDecoder("latin1");
        const rawText = decoder.decode(bytes);
        
        // Find all sequences of printable characters
        const sequences = rawText.match(/[\x20-\x7E]{4,}/g) || [];
        text = sequences
          .filter(s => /[a-zA-Z]{2,}/.test(s)) // Must contain letters
          .filter(s => !/^[%\/\[\]<>{}]+$/.test(s)) // Skip PDF syntax
          .join(" ");
      }
      
      return text.trim();
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

  // Extract text from plain text file
  const extractPlainText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || "");
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Main extraction function
  const extractText = async (file: File): Promise<string> => {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      return await extractPdfText(file);
    }
    
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
        file.name.toLowerCase().endsWith(".docx")) {
      return await extractDocxText(file);
    }

    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      return await extractPlainText(file);
    }

    throw new Error("Unsupported file type");
  };

  const validateFile = (file: File): string | null => {
    const fileName = file.name.toLowerCase();
    const isValidType = ACCEPTED_TYPES.includes(file.type) || 
                        fileName.endsWith(".pdf") || 
                        fileName.endsWith(".docx") || 
                        fileName.endsWith(".txt");
    
    if (!isValidType) {
      return "Please upload a PDF, DOCX, or TXT file";
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
        setError("Could not extract enough text from the file. Please try a DOCX or TXT version of your resume.");
        onFileSelect(null, null);
        return;
      }
      
      console.log("Extracted text length:", text.length);
      onFileSelect(file, text);
    } catch (err) {
      console.error("File processing error:", err);
      setError("Failed to read file. Please try a DOCX or TXT version.");
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
              {/* Accept all common file types to avoid "Customized Files" filter */}
              <input
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
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
                    PDF, DOCX, or TXT (up to 10MB)
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
