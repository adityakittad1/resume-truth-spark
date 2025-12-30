/**
 * Analysis Results Component
 * Displays comprehensive resume analysis with animations
 */

import { motion } from "framer-motion";
import { 
  Target, 
  Briefcase, 
  FileText, 
  Layers,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScoreDisplay, ProgressBar } from "./ScoreDisplay";
import { AnalysisResult } from "@/types/analyzer";
import { getRoleById } from "@/config/roles";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const roleInfo = getRoleById(result.metadata.role);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with overall score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
          <span className="text-sm text-muted-foreground">Analyzed for:</span>
          <Badge variant={result.metadata.roleMode === "core" ? "default" : "secondary"}>
            {roleInfo?.label || result.metadata.role}
          </Badge>
          {result.metadata.roleMode === "extended" && (
            <Badge variant="outline" className="border-warning text-warning text-xs">
              Advanced
            </Badge>
          )}
        </div>

        <ScoreDisplay score={result.overallScore} size="lg" />

        {/* Confidence indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-2 text-sm"
        >
          <Info className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Analysis confidence: 
            <span className={cn(
              "ml-1 font-medium",
              result.metadata.confidence === "high" && "text-success",
              result.metadata.confidence === "medium" && "text-primary",
              result.metadata.confidence === "low" && "text-warning"
            )}>
              {result.metadata.confidence}
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4"
      >
        <StatCard
          icon={Target}
          label="Skill Match"
          value={`${result.skillMatchPercent}%`}
          delay={0.4}
        />
        <StatCard
          icon={Briefcase}
          label="Project Relevance"
          value={`${result.projectRelevancePercent}%`}
          delay={0.5}
        />
        <StatCard
          icon={FileText}
          label="Resume Depth"
          value={`${result.resumeDepthPercent}%`}
          delay={0.6}
        />
      </motion.div>

      {/* Detailed breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Layers className="w-5 h-5 text-primary" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar
              label="Core Skills"
              value={result.breakdown.coreSkills.score}
              max={result.breakdown.coreSkills.maxScore}
              delay={0.8}
            />
            <ProgressBar
              label="Project Quality"
              value={result.breakdown.projectQuality.score}
              max={result.breakdown.projectQuality.maxScore}
              delay={0.9}
            />
            <ProgressBar
              label="Experience Depth"
              value={result.breakdown.experienceDepth.score}
              max={result.breakdown.experienceDepth.maxScore}
              delay={1.0}
            />
            <ProgressBar
              label="Resume Structure"
              value={result.breakdown.resumeStructure.score}
              max={result.breakdown.resumeStructure.maxScore}
              delay={1.1}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="h-full border-success/30 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-success">
                <TrendingUp className="w-5 h-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="h-full border-warning/30 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-warning">
                <TrendingDown className="w-5 h-5" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.improvements.map((improvement, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{improvement}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Penalties applied */}
      {result.penalties.some(p => p.applied) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Score Penalties Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.penalties
                  .filter(p => p.applied)
                  .map((penalty, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{penalty.reason}</span>
                      <Badge variant="destructive">
                        {Math.round((1 - penalty.multiplier) * 100)}% reduction
                      </Badge>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Timestamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-center text-xs text-muted-foreground"
      >
        Analyzed on {new Date(result.metadata.analyzedAt).toLocaleString()}
      </motion.p>
    </motion.div>
  );
}

// Stat card component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="text-center">
        <CardContent className="pt-4 pb-3">
          <Icon className="w-5 h-5 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
