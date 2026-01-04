import { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";

interface ATSIssue {
  category: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  section?: string;
}

interface ATSSuggestion {
  section: string;
  current: string;
  suggested: string;
  reason: string;
}

interface ATSAnalysis {
  score: number;
  issues: ATSIssue[];
  suggestions: ATSSuggestion[];
  strengths: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
}

interface ATSAnalysisCardProps {
  resumeData: ResumeData;
  onImproveAll: () => void;
  onApplySuggestion?: (suggestion: ATSSuggestion) => void;
  onScoreUpdate?: (score: number) => void;
  onSuggestionsReady?: (suggestions: ATSSuggestion[]) => void;
}

export function ATSAnalysisCard({ resumeData, onImproveAll, onApplySuggestion, onScoreUpdate, onSuggestionsReady }: ATSAnalysisCardProps) {
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issuesOpen, setIssuesOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);
  const [keywordsOpen, setKeywordsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    analyzeResume();
  }, []);

  const analyzeResume = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeData }
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setAnalysis(data);

      // Notify parent of score update
      if (onScoreUpdate && data.score !== undefined) {
        onScoreUpdate(data.score);
      }

      // Notify parent of suggestions
      if (onSuggestionsReady && data.suggestions) {
        onSuggestionsReady(data.suggestions);
      }
    } catch (err) {
      console.error('ATS analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      toast({
        title: "Analysis failed",
        description: "Could not analyze your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary animate-pulse" />
            Analyzing Your Resume...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !analysis) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Analysis Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error || 'Could not analyze your resume.'}</p>
          <Button onClick={analyzeResume} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const highIssues = analysis.issues.filter(i => i.severity === 'high').length;
  const mediumIssues = analysis.issues.filter(i => i.severity === 'medium').length;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/80 overflow-hidden">
      {/* Score Header */}
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            ATS Compatibility Score
          </CardTitle>
          <Button
            onClick={onImproveAll}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Sparkles className="w-4 h-4" />
            Improve All with AI
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Score Display */}
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted/30"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${(analysis.score / 100) * 301.59} 301.59`}
                className={getScoreColor(analysis.score)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </span>
              <span className="text-xs text-muted-foreground">
                {getScoreLabel(analysis.score)}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              {highIssues > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {highIssues} Critical
                </Badge>
              )}
              {mediumIssues > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {mediumIssues} Warnings
                </Badge>
              )}
              {analysis.strengths.length > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {analysis.strengths.length} Strengths
                </Badge>
              )}
            </div>

            {analysis.strengths.length > 0 && (
              <div className="space-y-1">
                {analysis.strengths.slice(0, 2).map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Issues Section */}
        {analysis.issues.length > 0 && (
          <Collapsible open={issuesOpen} onOpenChange={setIssuesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <span className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Issues Found ({analysis.issues.length})
                </span>
                {issuesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {analysis.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
                >
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={getSeverityBadge(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      {issue.section && (
                        <Badge variant="secondary" className="text-xs">
                          {issue.section}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1">{issue.message}</p>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Suggestions Section */}
        {analysis.suggestions.length > 0 && (
          <Collapsible open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <span className="flex items-center gap-2 font-semibold">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Improvement Suggestions ({analysis.suggestions.length})
                </span>
                {suggestionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {analysis.suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {suggestion.section}
                    </Badge>
                    {onApplySuggestion && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1"
                        onClick={() => onApplySuggestion(suggestion)}
                      >
                        <Zap className="w-3 h-3" />
                        Apply
                      </Button>
                    )}
                  </div>
                  {suggestion.current !== 'Missing' && (
                    <div className="text-sm mb-2">
                      <span className="text-muted-foreground">Current: </span>
                      <span className="line-through text-muted-foreground/70">{suggestion.current}</span>
                    </div>
                  )}
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Suggested: </span>
                    <span className="text-foreground font-medium">{suggestion.suggested}</span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {suggestion.reason}
                  </p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Keywords Section */}
        <Collapsible open={keywordsOpen} onOpenChange={setKeywordsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
              <span className="flex items-center gap-2 font-semibold">
                <Tag className="w-4 h-4 text-blue-500" />
                Keywords Analysis
              </span>
              {keywordsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            {analysis.keywords.found.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Found in your resume:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.found.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {analysis.keywords.missing.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Consider adding:</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.missing.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      + {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
