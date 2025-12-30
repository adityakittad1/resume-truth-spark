import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileSearch, Target, Lightbulb, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { PageTransition } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const Index = () => {
  const features = [
    {
      icon: FileSearch,
      title: "Evidence-Based Scoring",
      description: "Claims without proof get penalized. We analyze your resume like a skeptical recruiter would.",
    },
    {
      icon: Target,
      title: "17 Role Profiles",
      description: "Tailored analysis for your target role. From Software Engineer to Product Manager.",
    },
    {
      icon: Lightbulb,
      title: "Actionable Feedback",
      description: "Clear improvements with specific examples, not vague tips you can't act on.",
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
          <FeedbackDialog pageName="Homepage" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Analyze Your Resume{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Like a Recruiter Would
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Evidence-based scoring that catches what keyword scanners miss. Get honest feedback before recruiters do.
            </motion.p>

            {/* Dual CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                asChild
                size="lg"
                className="group text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/analyze">
                  <FileSearch className="mr-2 h-5 w-5" />
                  Analyze Resume
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="group text-lg px-8 py-6 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                <Link to="/generator">
                  <FileText className="mr-2 h-5 w-5" />
                  ATS Resume Builder
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 max-w-5xl mx-auto">
            <motion.h2
              className="text-2xl sm:text-3xl font-semibold text-center text-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Why Resumate?
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageTransition>
  );
};

export default Index;
