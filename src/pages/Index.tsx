import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FileSearch, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  FileText,
  Upload, 
  CheckCircle2,
  MessageSquare,
  Shield,
  BarChart3,
  GraduationCap,
  Zap,
  Users,
  Award,
  Sparkles,
  Download,
  FilePlus,
  ScanSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { PageTransition } from "@/components/PageTransition";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Index = () => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const analyzerSteps = [
    { icon: Upload, title: "Upload Resume", subtitle: "PDF, DOC, or DOCX" },
    { icon: Target, title: "Choose Role", subtitle: "Core or Advanced profile" },
    { icon: ScanSearch, title: "Get Feedback", subtitle: "ATS + recruiter insights" },
  ];

  const generatorSteps = [
    { icon: FilePlus, title: "Start or Upload", subtitle: "Fresh or existing resume" },
    { icon: Sparkles, title: "AI Enhances", subtitle: "ATS-aligned optimization" },
    { icon: Download, title: "Download PDF", subtitle: "Ready to apply" },
  ];

  const features = [
    {
      icon: Shield,
      title: "ATS-Friendly Checks",
      description: "Ensure your resume passes automated screening systems used by top companies",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: BarChart3,
      title: "Clear Scoring",
      description: "Understand exactly where you stand with our evidence-based 0-100 scoring system",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Lightbulb,
      title: "Actionable Tips",
      description: "Get specific, implementable improvements tailored to your target role",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: GraduationCap,
      title: "Student-Focused",
      description: "Tailored advice for freshers, interns, and early-career professionals",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
  ];

  const stats = [
    { value: "10K+", label: "Resumes Analyzed", icon: FileSearch },
    { value: "17+", label: "Role Profiles", icon: Target },
    { value: "95%", label: "Satisfaction Rate", icon: Award },
    { value: "30s", label: "Average Analysis Time", icon: Zap },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition className="min-h-screen bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
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
          className="absolute top-1/3 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-warning/5 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
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
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img 
              src={logo} 
              alt="Resumate" 
              className="h-14 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <FeedbackDialog pageName="Homepage" />
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Link to="/analyze">
                Get Started
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Left Content - Now centered without right card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.span 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4" />
                For Students & Freshers
              </motion.span>
              
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight"
              >
                Get honest feedback{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    on your resume.
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              >
                Built for students. Clear, practical, and recruiter-focused. Know exactly what's working and what needs improvement.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  asChild
                  size="lg"
                  className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                >
                  <Link to="/analyze">
                    <FileSearch className="mr-2 h-5 w-5" />
                    Review My Resume
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group text-lg px-8 py-6 border-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300"
                >
                  <a href="https://adityakittad1.github.io/resume-builder-pro" target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-5 w-5" />
                    ATS Resume Builder
                  </a>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-6 justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Free forever</span>
                </div>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={itemVariants} className="flex items-center gap-4 justify-center mt-10 pt-8 border-t border-border/50">
                <div className="flex -space-x-3">
                  {["A", "D", "P", "S", "M"].map((letter, i) => (
                    <motion.div
                      key={letter}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center text-sm font-semibold text-primary shadow-lg"
                      initial={{ opacity: 0, scale: 0, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-foreground">Trusted by students</span>
                  <span className="text-xs text-muted-foreground">from top universities</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
              Simple Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              How It Works
            </h2>
          </motion.div>

          {/* Dual Product Flows */}
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Resume Analyzer Flow */}
              <motion.div
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">Resume Analyzer</h3>
                    <p className="text-xs text-muted-foreground">Get honest, actionable feedback</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {analyzerSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <step.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">{step.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">{step.subtitle}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  asChild
                  size="sm"
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
                  <Link to="/analyze">
                    Try Analyzer
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </motion.div>

              {/* ATS Resume Generator Flow */}
              <motion.div
                className="bg-card border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-all duration-300"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">ATS Resume Generator</h3>
                    <p className="text-xs text-muted-foreground">Build an optimized resume</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {generatorSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-accent">{index + 1}</span>
                      </div>
                      <step.icon className="w-4 h-4 text-accent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">{step.title}</span>
                        <span className="text-xs text-muted-foreground ml-2">{step.subtitle}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full mt-4 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <a href="https://adityakittad1.github.io/resume-builder-pro" target="_blank" rel="noopener noreferrer">
                    Try Generator
                    <Sparkles className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Why Resumate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for Your Success
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create a resume that stands out and gets you interviews
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className="bg-card border border-border/50 rounded-2xl p-6 h-full hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
                  whileHover={{ y: -8 }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-500"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <feature.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground text-lg mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <FileSearch className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to improve your resume?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Get your personalized feedback in under 30 seconds. No signup, no payment, just honest results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300"
                >
                  <Link to="/analyze">
                    <FileSearch className="mr-2 h-5 w-5" />
                    Analyze My Resume
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 border-2 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300"
                >
                  <Link to="/generator">
                    <FileText className="mr-2 h-5 w-5" />
                    ATS Resume Builder
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  );
};

export default Index;
