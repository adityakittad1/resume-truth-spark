import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileSearch, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  Upload, 
  CheckCircle2,
  MessageSquare,
  Shield,
  BarChart3,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { PageTransition } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Index = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload Resume",
      description: "Drop your PDF, DOC, or DOCX file",
    },
    {
      number: 2,
      icon: Target,
      title: "Choose Role",
      description: "Select your target position",
    },
    {
      number: 3,
      icon: MessageSquare,
      title: "Get Feedback",
      description: "Receive actionable insights",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "ATS-Friendly Checks",
      description: "Ensure your resume passes automated screening systems",
    },
    {
      icon: BarChart3,
      title: "Clear Scoring",
      description: "Understand exactly where you stand with a 0-100 score",
    },
    {
      icon: Lightbulb,
      title: "Actionable Tips",
      description: "Get specific improvements you can make right now",
    },
    {
      icon: GraduationCap,
      title: "Student-Focused",
      description: "Tailored advice for freshers and internship seekers",
    },
  ];

  return (
    <PageTransition className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Resumate" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <FeedbackDialog pageName="Homepage" />
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link to="/analyze">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                For Students & Freshers
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Get honest feedback{" "}
                <span className="text-primary">on your resume.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Built for students. Clear, practical, and recruiter-focused. Know exactly what's working and what needs improvement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  asChild
                  size="lg"
                  className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/analyze">
                    Review My Resume
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>No signup required</span>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-3 mt-6">
                <div className="flex -space-x-2">
                  {["A", "D", "P", "S"].map((letter, i) => (
                    <motion.div
                      key={letter}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Trusted by many students</span>
              </div>
            </motion.div>

            {/* Right Content - Score Preview Card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Resume Analysis</h3>
                    <p className="text-sm text-muted-foreground">Just completed</p>
                  </div>
                </div>

                {/* Score Circle */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={352}
                        initial={{ strokeDashoffset: 352 }}
                        animate={{ strokeDashoffset: 352 - (352 * 85) / 100 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-4xl font-bold text-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        85
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Feedback items */}
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Strong technical skills</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Good project descriptions</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
              How It Works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center z-10">
                  {step.number}
                </div>

                <div className="bg-card border border-border rounded-xl p-6 pt-8 h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Why Resumate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Built for Your Success
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to improve your resume?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Get your personalized feedback in under 30 seconds. No signup, no payment, just honest results.
            </p>
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/analyze">
                Analyze My Resume Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  );
};

export default Index;
