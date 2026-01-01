import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft, FileText, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/PageTransition";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { PersonalInfoForm } from "@/components/resume-builder/PersonalInfoForm";
import { ExperienceForm } from "@/components/resume-builder/ExperienceForm";
import { EducationForm } from "@/components/resume-builder/EducationForm";
import { SkillsForm } from "@/components/resume-builder/SkillsForm";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { exportToPDF } from "@/lib/pdfExport";
import { ResumeData, defaultResumeData } from "@/types/resume";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Generator = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeTab, setActiveTab] = useState("edit");

  const handleExportPDF = async () => {
    try {
      await exportToPDF();
      toast.success("PDF export initiated", {
        description: "Your resume is ready to download.",
      });
    } catch (error) {
      toast.error("Export failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const isResumeEmpty =
    !resumeData.personalInfo.fullName &&
    resumeData.experience.length === 0 &&
    resumeData.education.length === 0 &&
    resumeData.skills.length === 0;

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <motion.img
                src={logo}
                alt="Resumate"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <FeedbackDialog pageName="Resume Generator" />
            <Button
              onClick={handleExportPDF}
              disabled={isResumeEmpty}
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              ATS Resume Builder
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your ATS-Optimized Resume
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Build a professional resume that passes Applicant Tracking Systems
              and impresses recruiters.
            </p>
          </motion.div>

          {/* Mobile Tabs */}
          <div className="lg:hidden mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="edit" className="gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4 space-y-6">
                <PersonalInfoForm
                  data={resumeData.personalInfo}
                  onChange={(personalInfo) =>
                    setResumeData({ ...resumeData, personalInfo })
                  }
                />
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(experience) =>
                    setResumeData({ ...resumeData, experience })
                  }
                />
                <EducationForm
                  data={resumeData.education}
                  onChange={(education) =>
                    setResumeData({ ...resumeData, education })
                  }
                />
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(skills) => setResumeData({ ...resumeData, skills })}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <ResumePreview data={resumeData} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Desktop Split View */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* Left - Form */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PersonalInfoForm
                data={resumeData.personalInfo}
                onChange={(personalInfo) =>
                  setResumeData({ ...resumeData, personalInfo })
                }
              />
              <ExperienceForm
                data={resumeData.experience}
                onChange={(experience) =>
                  setResumeData({ ...resumeData, experience })
                }
              />
              <EducationForm
                data={resumeData.education}
                onChange={(education) =>
                  setResumeData({ ...resumeData, education })
                }
              />
              <SkillsForm
                data={resumeData.skills}
                onChange={(skills) => setResumeData({ ...resumeData, skills })}
              />
            </motion.div>

            {/* Right - Preview */}
            <motion.div
              className="sticky top-24 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Live Preview</h2>
              </div>
              <div className="overflow-auto max-h-[calc(100vh-150px)] rounded-lg border border-border/50">
                <ResumePreview data={resumeData} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Generator;
