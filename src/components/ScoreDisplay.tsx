/**
 * Score Display Component
 * Animated score reveal with circular progress
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  delay?: number;
}

export function ScoreDisplay({ 
  score, 
  size = "md", 
  showLabel = true,
  delay = 0 
}: ScoreDisplayProps) {
  // Determine score color based on value
  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getStrokeColor = () => {
    if (score >= 80) return "stroke-success";
    if (score >= 60) return "stroke-primary";
    if (score >= 40) return "stroke-warning";
    return "stroke-destructive";
  };

  // Size configurations
  const sizeConfig = {
    sm: { container: "w-20 h-20", text: "text-xl", label: "text-xs", stroke: 6 },
    md: { container: "w-32 h-32", text: "text-4xl", label: "text-sm", stroke: 8 },
    lg: { container: "w-48 h-48", text: "text-6xl", label: "text-base", stroke: 10 },
  };

  const config = sizeConfig[size];
  const radius = size === "sm" ? 34 : size === "md" ? 56 : 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center"
    >
      <div className={cn("relative", config.container)}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-muted/30"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeWidth={config.stroke}
            strokeLinecap="round"
            className={getStrokeColor()}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: delay + 0.3, duration: 1.5, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Score number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: delay + 0.8, 
              type: "spring", 
              stiffness: 200,
              damping: 10 
            }}
            className={cn("font-bold", config.text, getScoreColor())}
          >
            {score}
          </motion.span>
          {showLabel && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 1 }}
              className={cn("text-muted-foreground mt-1", config.label)}
            >
              {getScoreLabel()}
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Linear Progress Bar for component scores
 */
interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  delay?: number;
}

export function ProgressBar({ value, max, label, delay = 0 }: ProgressBarProps) {
  const percent = Math.round((value / max) * 100);

  const getColor = () => {
    if (percent >= 75) return "bg-success";
    if (percent >= 50) return "bg-primary";
    if (percent >= 25) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="space-y-1.5"
    >
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{value}/{max}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", getColor())}
        />
      </div>
    </motion.div>
  );
}
