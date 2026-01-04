import { useState, useCallback, forwardRef } from "react";
import { Upload, FileText, Loader2, ArrowLeft, CheckCircle2, AlertCircle, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";

interface ResumeUploaderProps {
  onParsed: (data: ResumeData) => void;
  onBack: () => void;
}

const getMimeType = (fileName: string): string => {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ResumeUploader = forwardRef<HTMLDivElement, ResumeUploaderProps>(
  function ResumeUploader({ onParsed, onBack }, ref) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'parsing' | 'success' | 'error'>('idle');
  const [pastedText, setPastedText] = useState("");
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { toast } = useToast();

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const parseContent = async (content: string, name: string) => {
    setIsLoading(true);
    setFileName(name);
    setUploadStatus('parsing');

    const progressInterval = simulateProgress();

    try {
      setUploadProgress(95);

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { fileContent: content, fileName: name }
      });

      if (error) {
        throw new Error(error.message || 'Failed to parse resume');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');

      const resumeData: ResumeData = {
        contact: data.contact || { name: '', email: '', phone: '', location: '' },
        summary: data.summary || '',
        experience: (data.experience || []).map((exp: any, idx: number) => ({
          ...exp,
          id: `exp-${idx}-${Date.now()}`,
        })),
        education: (data.education || []).map((edu: any, idx: number) => ({
          ...edu,
          id: `edu-${idx}-${Date.now()}`,
        })),
        skills: data.skills || [],
        projects: (data.projects || []).map((proj: any, idx: number) => ({
          ...proj,
          id: `proj-${idx}-${Date.now()}`,
        })),
        certifications: (data.certifications || []).map((cert: any, idx: number) => ({
          ...cert,
          id: `cert-${idx}-${Date.now()}`,
        })),
      };

      toast({
        title: "Resume parsed successfully",
        description: "Review and edit your information below.",
      });

      setTimeout(() => {
        onParsed(resumeData);
      }, 800);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      console.error('Error parsing resume:', error);
      toast({
        title: "Failed to parse resume",
        description: error instanceof Error ? error.message : "Please try again or enter manually.",
        variant: "destructive",
      });

      setTimeout(() => {
        setUploadStatus('idle');
        setFileName(null);
        setUploadProgress(0);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const parseFile = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    setUploadStatus('uploading');

    const progressInterval = simulateProgress();

    try {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                     file.name.toLowerCase().endsWith('.docx');
      const isDoc = file.type === 'application/msword' || file.name.toLowerCase().endsWith('.doc');

      let requestBody: { fileContent?: string; fileName: string; fileBase64?: string; mimeType?: string };

      if (isPdf || isDocx || isDoc) {
        const base64 = await fileToBase64(file);
        const mimeType = getMimeType(file.name);
        requestBody = {
          fileName: file.name,
          fileBase64: base64,
          mimeType
        };
      } else {
        const text = await file.text();
        requestBody = {
          fileContent: text,
          fileName: file.name
        };
      }

      setUploadStatus('parsing');
      setUploadProgress(95);

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: requestBody
      });

      if (error) {
        throw new Error(error.message || 'Failed to parse resume');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');

      const resumeData: ResumeData = {
        contact: data.contact || { name: '', email: '', phone: '', location: '' },
        summary: data.summary || '',
        experience: (data.experience || []).map((exp: any, idx: number) => ({
          ...exp,
          id: `exp-${idx}-${Date.now()}`,
        })),
        education: (data.education || []).map((edu: any, idx: number) => ({
          ...edu,
          id: `edu-${idx}-${Date.now()}`,
        })),
        skills: data.skills || [],
        projects: (data.projects || []).map((proj: any, idx: number) => ({
          ...proj,
          id: `proj-${idx}-${Date.now()}`,
        })),
        certifications: (data.certifications || []).map((cert: any, idx: number) => ({
          ...cert,
          id: `cert-${idx}-${Date.now()}`,
        })),
      };

      toast({
        title: "Resume parsed successfully",
        description: "Review and edit your information below.",
      });

      setTimeout(() => {
        onParsed(resumeData);
      }, 800);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      console.error('Error parsing resume:', error);
      toast({
        title: "Failed to parse resume",
        description: error instanceof Error ? error.message : "Please try again or enter manually.",
        variant: "destructive",
      });

      setTimeout(() => {
        setUploadStatus('idle');
        setFileName(null);
        setUploadProgress(0);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'text/plain', 'application/msword',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.txt', '.doc', '.docx'];
      const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

      if (validTypes.includes(file.type) || hasValidExtension) {
        parseFile(file);
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF, DOC, DOCX, or TXT file",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim().length < 50) {
      toast({
        title: "Text too short",
        description: "Please paste your complete resume content.",
        variant: "destructive",
      });
      return;
    }
    parseContent(pastedText, "Pasted Resume");
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce-in" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-destructive animate-bounce-in" />;
      case 'uploading':
      case 'parsing':
        return <Loader2 className="w-12 h-12 text-primary animate-spin" />;
      default:
        return fileName ? (
          <FileText className="w-12 h-12 text-primary" />
        ) : (
          <Upload className="w-12 h-12 text-primary" />
        );
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading...';
      case 'parsing':
        return 'Analyzing your resume with AI...';
      case 'success':
        return 'Successfully parsed!';
      case 'error':
        return 'Failed to parse. Please try again.';
      default:
        return fileName || 'Drag and drop your resume here';
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ opacity: 0 }}>
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover-lift"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="shadow-xl border-0 overflow-hidden animate-scale-in delay-100" style={{ opacity: 0 }}>
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
          <CardTitle className="text-2xl font-bold">Upload Your Resume</CardTitle>
          <CardDescription className="text-base">
            We'll extract your information and restructure it into an ATS-friendly format
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="paste" className="gap-2">
                <ClipboardPaste className="w-4 h-4" />
                Paste Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center
                  transition-all duration-300 ease-out
                  ${isDragOver
                    ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                  }
                  ${isLoading ? 'pointer-events-none' : 'cursor-pointer'}
                  ${uploadStatus === 'success' ? 'border-green-500/50 bg-green-500/5' : ''}
                  ${uploadStatus === 'error' ? 'border-destructive/50 bg-destructive/5' : ''}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {isDragOver && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
                )}

                <div className="relative z-10">
                  <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6
                    transition-all duration-300
                    ${isDragOver ? 'bg-primary/20 scale-110' : 'bg-primary/10'}
                    ${uploadStatus === 'success' ? 'bg-green-500/20' : ''}
                    ${uploadStatus === 'error' ? 'bg-destructive/20' : ''}
                  `}>
                    {getStatusIcon()}
                  </div>

                  <p className={`
                    text-lg font-semibold mb-2 transition-colors duration-300
                    ${uploadStatus === 'success' ? 'text-green-600' : ''}
                    ${uploadStatus === 'error' ? 'text-destructive' : ''}
                  `}>
                    {getStatusText()}
                  </p>

                  {uploadStatus === 'idle' && (
                    <p className="text-sm text-muted-foreground mb-6 animate-fade-in">
                      Supports PDF, DOC, DOCX, and TXT files
                    </p>
                  )}

                  {(uploadStatus === 'uploading' || uploadStatus === 'parsing') && (
                    <div className="max-w-xs mx-auto mb-6 animate-fade-in">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {Math.round(uploadProgress)}% complete
                      </p>
                    </div>
                  )}

                  {uploadStatus === 'idle' && (
                    <label className="animate-fade-in-up delay-200" style={{ opacity: 0 }}>
                      <Button variant="outline" size="lg" asChild className="btn-animated">
                        <span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Upload className="w-4 h-4 mr-2" />
                          Browse Files
                        </span>
                      </Button>
                    </label>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="paste" className="mt-0">
              <div className="space-y-4">
                <Textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your resume content here...

Example:
John Doe
john.doe@email.com | (555) 123-4567 | New York, NY

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years...

EXPERIENCE
Senior Developer at Tech Corp (2020 - Present)
• Led development of microservices architecture
• Improved system performance by 40%

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2018

SKILLS
JavaScript, React, Node.js, Python, AWS"
                  className="min-h-[300px] resize-none font-mono text-sm"
                  disabled={isLoading}
                />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {pastedText.length} characters
                  </p>
                  <Button
                    onClick={handlePasteSubmit}
                    disabled={isLoading || pastedText.trim().length < 50}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ClipboardPaste className="w-4 h-4" />
                    )}
                    {isLoading ? 'Analyzing...' : 'Parse Resume'}
                  </Button>
                </div>

                {(uploadStatus === 'uploading' || uploadStatus === 'parsing') && (
                  <div className="animate-fade-in">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {Math.round(uploadProgress)}% complete
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Tips section */}
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
            <p className="text-sm font-medium text-foreground mb-2">Tips for best results:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a text-based resume (not scanned images)</li>
              <li>• Include clear section headers</li>
              <li>• List experience in chronological order</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
