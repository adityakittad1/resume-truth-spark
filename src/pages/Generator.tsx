import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "@/components/generator/ModeSelector";
import { ResumeUploader } from "@/components/generator/ResumeUploader";
import { ResumePreview } from "@/components/generator/ResumePreview";
import { ImproveResumeFlow } from "@/components/generator/ImproveResumeFlow";
import { ResumeForm } from "@/components/generator/ResumeForm";
import { ResumeData, emptyResumeData } from "@/types/resume";

type GeneratorStep = 'select' | 'upload' | 'improve' | 'form' | 'preview';

const Generator = () => {
  const [step, setStep] = useState<GeneratorStep>('select');
  const [mode, setMode] = useState<'scratch' | 'improve' | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);

  const handleModeSelect = (selectedMode: 'scratch' | 'improve') => {
    setMode(selectedMode);
    if (selectedMode === 'scratch') {
      setResumeData(emptyResumeData);
      setStep('form'); // Go to form for manual entry
    } else {
      setStep('upload');
    }
  };

  const handleParsedResume = (data: ResumeData) => {
    setResumeData(data);
    setStep('improve');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setMode(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <img
                src={logo}
                alt="Resumate"
                className="h-20 md:h-28 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        {/* Step: Mode Selection */}
        {step === 'select' && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Create Your ATS-Friendly Resume
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100" style={{ opacity: 0 }}>
              Build an ATS-optimized resume with a single-column layout, standard fonts, and clean formatting — enhanced using AI for stronger, more accurate results.
            </p>
            <ModeSelector onSelectMode={handleModeSelect} />
          </div>
        )}

        {/* Step: Upload Resume */}
        {step === 'upload' && (
          <ResumeUploader
            onParsed={handleParsedResume}
            onBack={handleBackToSelect}
          />
        )}

        {/* Step: Form (Start from Scratch) */}
        {step === 'form' && (
          <ResumeForm
            initialData={resumeData}
            onSubmit={(data) => {
              setResumeData(data);
              setStep('preview');
            }}
            onBack={handleBackToSelect}
          />
        )}

        {/* Step: Improve Flow */}
        {step === 'improve' && (
          <ImproveResumeFlow
            initialData={resumeData}
            onComplete={(data) => {
              setResumeData(data);
              setStep('preview');
            }}
            onBack={() => setStep('upload')}
          />
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <ResumePreview
            data={resumeData}
            onBack={() => setStep('improve')}
            onEdit={() => setStep('improve')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Resumate. Built by Aditya Kittad.
            </p>
            <a
              href="https://www.linkedin.com/company/resumate-io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2 transition-all duration-300 hover:scale-105 hover:bg-[#0077B5]/10 hover:border-[#0077B5]/50 hover:text-[#0077B5]"
              >
                <Linkedin className="w-4 h-4" />
                Connect on LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Generator;
