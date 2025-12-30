/**
 * Analysis Loading Component
 * Animated loading state during resume analysis
 */

import { motion } from "framer-motion";
import { FileSearch, Brain, BarChart3, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: FileSearch, label: "Reading resume...", duration: 1.5 },
  { icon: Brain, label: "Analyzing skills...", duration: 2 },
  { icon: BarChart3, label: "Calculating scores...", duration: 1.5 },
  { icon: CheckCircle2, label: "Generating report...", duration: 1 },
];

export function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated brain icon */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0 hsl(var(--primary) / 0.2)",
              "0 0 0 20px hsl(var(--primary) / 0)",
              "0 0 0 0 hsl(var(--primary) / 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 h-12 text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Step indicators */}
      <div className="space-y-3 w-full max-w-xs">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              className="p-2 rounded-full bg-primary/10"
            >
              <step.icon className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-foreground">{step.label}</span>
            <motion.div
              className="ml-auto flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.3 + 0.5 }}
            >
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Loading text */}
      <motion.p
        className="mt-6 text-sm text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        This usually takes a few seconds...
      </motion.p>
    </div>
  );
}
