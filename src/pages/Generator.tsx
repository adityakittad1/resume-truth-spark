/**
 * Resume Generator Page
 * ATS-optimized resume builder
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageTransition } from "@/components/PageTransition";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

type Step = "personal" | "education" | "experience" | "skills" | "projects" | "preview";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "preview", label: "Preview", icon: FileText },
];

export default function Generator() {
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const [formData, setFormData] = useState({
    // Personal
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    // Education
    degree: "",
    university: "",
    graduationYear: "",
    gpa: "",
    // Experience
    experiences: [{ title: "", company: "", duration: "", description: "" }],
    // Skills
    technicalSkills: "",
    softSkills: "",
    tools: "",
    // Projects
    projects: [{ name: "", description: "", technologies: "", link: "" }],
  });

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Resumate" className="h-10 w-auto" />
            </Link>
            <h1 className="text-lg font-bold text-primary">Resume Builder</h1>
            <FeedbackDialog pageName="Generator Page" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 pt-20 pb-16 max-w-4xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : isCompleted 
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <StepIcon className="w-5 h-5" />
                    </motion.div>
                    <span className={`text-xs hidden sm:block ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const CurrentIcon = steps[currentStepIndex].icon;
                    return <CurrentIcon className="w-5 h-5 text-primary" />;
                  })()}
                  {steps[currentStepIndex].label} Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === "personal" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => updateFormData("fullName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 234 567 8900"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, Country"
                          value={formData.location}
                          onChange={(e) => updateFormData("location", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          placeholder="linkedin.com/in/johndoe"
                          value={formData.linkedin}
                          onChange={(e) => updateFormData("linkedin", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub URL</Label>
                        <Input
                          id="github"
                          placeholder="github.com/johndoe"
                          value={formData.github}
                          onChange={(e) => updateFormData("github", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="A brief summary of your professional background and career objectives..."
                        rows={4}
                        value={formData.summary}
                        onChange={(e) => updateFormData("summary", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {currentStep === "education" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree *</Label>
                        <Input
                          id="degree"
                          placeholder="B.Tech in Computer Science"
                          value={formData.degree}
                          onChange={(e) => updateFormData("degree", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="university">University/College *</Label>
                        <Input
                          id="university"
                          placeholder="MIT"
                          value={formData.university}
                          onChange={(e) => updateFormData("university", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          placeholder="2024"
                          value={formData.graduationYear}
                          onChange={(e) => updateFormData("graduationYear", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA/CGPA</Label>
                        <Input
                          id="gpa"
                          placeholder="8.5/10"
                          value={formData.gpa}
                          onChange={(e) => updateFormData("gpa", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === "experience" && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input placeholder="Software Engineer Intern" />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input placeholder="Google" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input placeholder="Jan 2024 - Present" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements..."
                        rows={4}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tip: Use action verbs and quantify your achievements (e.g., "Increased efficiency by 30%")
                    </p>
                  </div>
                )}

                {currentStep === "skills" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="technicalSkills">Technical Skills *</Label>
                      <Textarea
                        id="technicalSkills"
                        placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
                        rows={3}
                        value={formData.technicalSkills}
                        onChange={(e) => updateFormData("technicalSkills", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tools">Tools & Technologies</Label>
                      <Textarea
                        id="tools"
                        placeholder="VS Code, Docker, AWS, Figma, Jira..."
                        rows={2}
                        value={formData.tools}
                        onChange={(e) => updateFormData("tools", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="softSkills">Soft Skills</Label>
                      <Input
                        id="softSkills"
                        placeholder="Communication, Leadership, Problem-solving..."
                        value={formData.softSkills}
                        onChange={(e) => updateFormData("softSkills", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {currentStep === "projects" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input placeholder="E-commerce Platform" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Brief description of the project, your role, and key achievements..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Technologies Used</Label>
                      <Input placeholder="React, Node.js, MongoDB, AWS" />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Link (optional)</Label>
                      <Input placeholder="https://github.com/..." />
                    </div>
                  </div>
                )}

                {currentStep === "preview" && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Resume Preview
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your ATS-optimized resume is ready! Review and download.
                    </p>
                    <div className="bg-muted/50 border border-border rounded-lg p-6 text-left max-w-lg mx-auto">
                      <h4 className="font-bold text-lg">{formData.fullName || "Your Name"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.email || "email@example.com"} | {formData.phone || "Phone"} | {formData.location || "Location"}
                      </p>
                      <hr className="my-3 border-border" />
                      <p className="text-sm">{formData.summary || "Your professional summary will appear here..."}</p>
                    </div>
                    <Button className="mt-6" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Resume (Coming Soon)
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep !== "preview" && (
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={goBack}
                      disabled={currentStepIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={goNext}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {currentStep === "preview" && (
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={goBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Resume
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
