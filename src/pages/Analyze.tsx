/**
 * Analyze Page - Resume Analysis Flow
 * Upload → Select Role → Analyze → View Results
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RefreshCw, FileSearch, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/PageTransition";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileUpload } from "@/components/FileUpload";
import { RoleSelector } from "@/components/RoleSelector";
import { AnalysisLoading } from "@/components/AnalysisLoading";
import { AnalysisResults } from "@/components/AnalysisResults";
import Footer from "@/components/Footer";
import { analyzeResume } from "@/lib/analyzer";
import { AllRoles, RoleMode, AnalysisResult } from "@/types/analyzer";
import logo from "@/assets/logo.png";

type Step = "upload" | "role" | "analyzing" | "results";

export default function Analyze() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AllRoles | null>(null);
  const [roleMode, setRoleMode] = useState<RoleMode>("core");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = (f: File | null, text: string | null) => {
    setFile(f);
    setResumeText(text);
  };

  const handleRoleSelect = (role: AllRoles, mode: RoleMode) => {
    setSelectedRole(role);
    setRoleMode(mode);
  };

  const startAnalysis = async () => {
    if (!resumeText || !selectedRole) return;
    
    setStep("analyzing");
    
    // Simulate processing delay for UX
    await new Promise((r) => setTimeout(r, 2500));
    
    const analysisResult = analyzeResume({
      resumeText,
      role: selectedRole,
      roleMode,
    });
    
    setResult(analysisResult);
    setStep("results");
  };

  const resetAnalysis = () => {
    setStep("upload");
    setFile(null);
    setResumeText(null);
    setSelectedRole(null);
    setResult(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Animated background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-1/4 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Header */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <motion.img 
                src={logo} 
                alt="Resumate" 
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
                <FileSearch className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Resume Analyzer</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <FeedbackDialog pageName="Analyze Page" />
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 pt-24 pb-16 max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-2">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <FileSearch className="w-8 h-8 text-primary" />
                    </motion.div>
                    <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
                    <p className="text-muted-foreground text-sm mt-2">PDF, DOCX, or TXT format supported</p>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4">
                    <FileUpload onFileSelect={handleFileSelect} selectedFile={file} />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full py-6 text-lg shadow-lg shadow-primary/25"
                        disabled={!file}
                        onClick={() => setStep("role")}
                      >
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Role Selection */}
            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-2">
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <FileSearch className="w-8 h-8 text-accent" />
                    </motion.div>
                    <CardTitle className="text-2xl">Select Target Role</CardTitle>
                    <p className="text-muted-foreground text-sm mt-2">Choose the role you're applying for</p>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4">
                    <RoleSelector
                      selectedRole={selectedRole}
                      onRoleSelect={handleRoleSelect}
                    />
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep("upload")} className="px-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className="w-full py-6 text-lg shadow-lg shadow-primary/25"
                          disabled={!selectedRole}
                          onClick={startAnalysis}
                        >
                          Analyze Resume
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Analyzing */}
            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardContent className="py-12">
                    <AnalysisLoading />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === "results" && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <AnalysisResults result={result} />
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full py-6 text-lg border-2"
                      onClick={resetAnalysis}
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Analyze Another Resume
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      asChild
                      className="w-full py-6 text-lg border-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
                      variant="outline"
                    >
                      <Link to="/generator">
                        <FileText className="w-5 h-5 mr-2" />
                        ATS Resume Generator
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
