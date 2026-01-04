import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Eye, FileText, Sparkles, Loader2, RefreshCw, Zap, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { ATSAnalysisCard } from "./ATSAnalysisCard";
import { EnhancedResumeEditor } from "./EnhancedResumeEditor";
import { ResumePreview } from "./ResumePreview";
import { ScoreComparison } from "./ScoreComparison";
import { TemplateSelector } from "./TemplateSelector";
import { ResumeTemplateRenderer, TemplateId } from "./ResumeTemplates";

interface ATSSuggestion {
  section: string;
  current: string;
  suggested: string;
  reason: string;
}

interface ImproveResumeFlowProps {
  initialData: ResumeData;
  onComplete: (data: ResumeData) => void;
  onBack: () => void;
}

export function ImproveResumeFlow({ initialData, onComplete, onBack }: ImproveResumeFlowProps) {
  const [data, setData] = useState<ResumeData>(initialData);
  const [originalData] = useState<ResumeData>(initialData);
  const [isImproving, setIsImproving] = useState(false);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("analysis");
  const [showPreview, setShowPreview] = useState(false);
  const [analysisKey, setAnalysisKey] = useState(0);
  const [originalScore, setOriginalScore] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<ATSSuggestion[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic");
  const [isCheckingScore, setIsCheckingScore] = useState(false);
  const { toast } = useToast();

  // Fetch initial score on mount - only once for original score
  useEffect(() => {
    const fetchInitialScore = async () => {
      try {
        const { data: analysis } = await supabase.functions.invoke('analyze-resume', {
          body: { resumeData: initialData }
        });
        if (analysis?.score !== undefined) {
          setOriginalScore(analysis.score);
          // Only set current score if it hasn't been set yet
          if (currentScore === null) {
            setCurrentScore(analysis.score);
          }
        }
        if (analysis?.suggestions) {
          setSuggestions(analysis.suggestions);
        }
      } catch (error) {
        console.error('Failed to fetch initial score:', error);
      }
    };

    fetchInitialScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleScoreUpdate = (score: number) => {
    setCurrentScore(score);
  };

  const handleSuggestionsReady = (newSuggestions: ATSSuggestion[]) => {
    setSuggestions(newSuggestions);
  };

  const checkScore = async () => {
    setIsCheckingScore(true);
    try {
      const { data: analysis } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeData: data }
      });
      if (analysis?.score !== undefined) {
        setCurrentScore(analysis.score);
      }
      if (analysis?.suggestions) {
        setSuggestions(analysis.suggestions);
      }
      toast({
        title: "Score updated!",
        description: `Your current ATS score is ${analysis?.score || 0}%`,
      });
    } catch (error) {
      console.error('Failed to check score:', error);
      toast({
        title: "Failed to check score",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingScore(false);
    }
  };

  const applyAllSuggestions = async () => {
    if (suggestions.length === 0) {
      toast({
        title: "No suggestions available",
        description: "Re-analyze your resume to get new suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingSuggestions(true);

    try {
      let updatedData = { ...data };

      for (const suggestion of suggestions) {
        const section = suggestion.section.toLowerCase();

        if (section === 'summary' || section === 'professional summary') {
          // Apply summary suggestion
          if (suggestion.suggested && suggestion.suggested !== 'Missing') {
            updatedData.summary = suggestion.suggested;
          }
        } else if (section === 'skills') {
          // Add missing skills from suggestions
          const suggestedSkills = suggestion.suggested.split(',').map(s => s.trim()).filter(Boolean);
          const existingSkills = new Set(updatedData.skills.map(s => s.toLowerCase()));
          const newSkills = suggestedSkills.filter(s => !existingSkills.has(s.toLowerCase()));
          updatedData.skills = [...updatedData.skills, ...newSkills];
        } else if (section === 'experience' || section.includes('experience') || section.includes('bullet')) {
          // Try to match and update experience bullets
          const currentText = suggestion.current;
          const suggestedText = suggestion.suggested;

          if (currentText && suggestedText && currentText !== 'Missing') {
            updatedData.experience = updatedData.experience.map(exp => ({
              ...exp,
              bullets: exp.bullets.map(bullet =>
                bullet.toLowerCase().includes(currentText.toLowerCase().substring(0, 20))
                  ? suggestedText
                  : bullet
              )
            }));
          }
        }
      }

      setData(updatedData);

      toast({
        title: "Suggestions applied!",
        description: `Applied ${suggestions.length} AI suggestions to your resume.`,
      });

      // Re-analyze to get new score
      setTimeout(() => {
        setAnalysisKey(prev => prev + 1);
      }, 500);

    } catch (error) {
      console.error('Error applying suggestions:', error);
      toast({
        title: "Failed to apply suggestions",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  const improveAllSections = async () => {
    setIsImproving(true);

    try {
      // Improve summary
      if (data.summary.trim()) {
        const { data: summaryResult } = await supabase.functions.invoke('enhance-content', {
          body: { content: data.summary, type: 'summary' }
        });
        if (summaryResult?.enhanced) {
          setData(prev => ({ ...prev, summary: summaryResult.enhanced }));
        }
      }

      // Improve experience bullets
      const improvedExperience = await Promise.all(
        data.experience.map(async (exp) => {
          const improvedBullets = await Promise.all(
            exp.bullets.filter(b => b.trim()).map(async (bullet) => {
              try {
                const { data: bulletResult } = await supabase.functions.invoke('enhance-content', {
                  body: { content: bullet, type: 'bullet' }
                });
                return bulletResult?.enhanced || bullet;
              } catch {
                return bullet;
              }
            })
          );
          return { ...exp, bullets: improvedBullets };
        })
      );

      setData(prev => ({ ...prev, experience: improvedExperience }));

      toast({
        title: "Resume improved!",
        description: "All sections have been enhanced with AI.",
      });

      // Refresh analysis to get new score
      setAnalysisKey(prev => prev + 1);

    } catch (error) {
      console.error('Improvement error:', error);
      toast({
        title: "Improvement failed",
        description: "Some sections could not be improved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
    }
  };

  const handlePreviewBack = () => {
    setShowPreview(false);
  };

  const handlePreviewEdit = () => {
    setShowPreview(false);
    setActiveTab("edit");
  };

  if (showPreview) {
    return (
      <ResumePreview
        data={data}
        onBack={handlePreviewBack}
        onEdit={handlePreviewEdit}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            onClick={() => onComplete(data)}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <FileText className="w-4 h-4" />
            Generate PDF
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Analysis & Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Score Comparison */}
          {originalScore !== null && currentScore !== null && (
            <ScoreComparison
              originalScore={originalScore}
              currentScore={currentScore}
              onCheckScore={checkScore}
              isChecking={isCheckingScore}
            />
          )}

          <ATSAnalysisCard
            key={analysisKey}
            resumeData={data}
            onImproveAll={improveAllSections}
            onScoreUpdate={handleScoreUpdate}
            onSuggestionsReady={handleSuggestionsReady}
          />

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="default"
                className="w-full justify-start gap-2 bg-gradient-to-r from-primary to-primary/80"
                onClick={applyAllSuggestions}
                disabled={isApplyingSuggestions || suggestions.length === 0}
              >
                {isApplyingSuggestions ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {isApplyingSuggestions ? 'Applying...' : `Auto-Apply Suggestions (${suggestions.length})`}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={improveAllSections}
                disabled={isImproving}
              >
                {isImproving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isImproving ? 'Improving...' : 'Improve All with AI'}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setAnalysisKey(prev => prev + 1)}
              >
                <RefreshCw className="w-4 h-4" />
                Re-analyze Resume
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setData(originalData);
                  setCurrentScore(originalScore);
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Reset to Original
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Editor */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="analysis" className="gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </TabsTrigger>
              <TabsTrigger value="edit" className="gap-2">
                <FileText className="w-4 h-4" />
                Edit Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="mt-0 space-y-4">
              {/* Template Selector */}
              <Card className="border-0 shadow-md">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" />
                    Template Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={setSelectedTemplate}
                  />
                </CardContent>
              </Card>

              {/* Live Preview with Template - A4 Size */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="bg-gray-100 p-4 overflow-auto max-h-[800px]">
                  <div className="bg-white shadow-lg mx-auto" style={{ width: '210mm' }}>
                    <ResumeTemplateRenderer data={data} templateId={selectedTemplate} />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="mt-0">
              <EnhancedResumeEditor data={data} onChange={setData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
