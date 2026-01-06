/**
 * Resume Rejection Message - Shown when document is not a valid resume
 */

import { motion } from "framer-motion";
import { AlertCircle, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResumeRejectionMessageProps {
  onTryAgain: () => void;
}

export function ResumeRejectionMessage({ onTryAgain }: ResumeRejectionMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="py-12 px-6 text-center space-y-6">
          <motion.div
            className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
          >
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">
              This file doesn't appear to be a resume yet.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              We couldn't find standard resume sections like experience, education, or skills.
            </p>
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Please upload a resume, or use our ATS Resume Generator to create one.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full py-5"
                  onClick={onTryAgain}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Different File
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild className="w-full py-5">
                  <Link to="/generator">
                    Create Resume
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
