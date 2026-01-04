import { TrendingUp, TrendingDown, Minus, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScoreComparisonProps {
  originalScore: number;
  currentScore: number;
  onCheckScore?: () => void;
  isChecking?: boolean;
}

export function ScoreComparison({ originalScore, currentScore, onCheckScore, isChecking }: ScoreComparisonProps) {
  const difference = currentScore - originalScore;
  const percentageChange = originalScore > 0 ? ((difference / originalScore) * 100).toFixed(0) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getTrendIcon = () => {
    if (difference > 0) {
      return <TrendingUp className="w-5 h-5 text-green-500" />;
    } else if (difference < 0) {
      return <TrendingDown className="w-5 h-5 text-red-500" />;
    }
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  };

  const getTrendText = () => {
    if (difference > 0) {
      return `+${difference} points (+${percentageChange}%)`;
    } else if (difference < 0) {
      return `${difference} points (${percentageChange}%)`;
    }
    return 'No change';
  };

  const getTrendColor = () => {
    if (difference > 0) return 'text-green-600 bg-green-50 border-green-200';
    if (difference < 0) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-muted-foreground bg-muted border-border';
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="py-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Score Comparison
          </span>
          {onCheckScore && (
            <Button
              size="sm"
              variant="outline"
              onClick={onCheckScore}
              disabled={isChecking}
              className="gap-2 h-8"
            >
              {isChecking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {isChecking ? 'Checking...' : 'Check Score'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Original Score */}
          <div className={`flex-1 p-4 rounded-xl border ${getScoreBgColor(originalScore)} text-center`}>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Original</p>
            <p className={`text-3xl font-bold ${getScoreColor(originalScore)}`}>
              {originalScore}%
            </p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          {/* Current Score */}
          <div className={`flex-1 p-4 rounded-xl border ${getScoreBgColor(currentScore)} text-center`}>
            <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Current</p>
            <p className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>
              {currentScore}%
            </p>
          </div>
        </div>

        {/* Change indicator */}
        <div className={`mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">{getTrendText()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
