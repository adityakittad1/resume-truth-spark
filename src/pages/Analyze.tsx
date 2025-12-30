/**
 * Analyze Page - Resume Analysis Flow
 * Upload → Select Role → Analyze → View Results
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTransition } from "@/components/PageTransition";
import { FeedbackDialog } from "@/components/FeedbackDialog";
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
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Resumate" className="h-8 w-auto" />
            </Link>
            <h1 className="text-lg font-bold text-primary">Resume Analyzer</h1>
            <FeedbackDialog pageName="Analyze Page" />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 pt-20 pb-16 max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {step === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Your Resume</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FileUpload onFileSelect={handleFileSelect} selectedFile={file} />
                    <Button
                      className="w-full"
                      disabled={!file}
                      onClick={() => setStep("role")}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Role Selection */}
            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Select Target Role</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RoleSelector
                      selectedRole={selectedRole}
                      onRoleSelect={handleRoleSelect}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep("upload")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={!selectedRole}
                        onClick={startAnalysis}
                      >
                        Analyze Resume
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Analyzing */}
            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardContent className="py-8">
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
                className="space-y-4"
              >
                <AnalysisResults result={result} />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetAnalysis}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Analyze Another Resume
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
