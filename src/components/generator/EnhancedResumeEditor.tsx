import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  User,
  Wrench,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData, ResumeExperience, ResumeEducation } from "@/types/resume";

interface EnhancedResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function EnhancedResumeEditor({ data, onChange }: EnhancedResumeEditorProps) {
  const [enhancingField, setEnhancingField] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
  });
  const [skillInput, setSkillInput] = useState("");
  const { toast } = useToast();

  const enhanceContent = async (content: string, type: 'summary' | 'bullet', fieldId: string) => {
    if (!content.trim()) return null;
    setEnhancingField(fieldId);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('enhance-content', {
        body: { content, type }
      });
      if (error) throw error;
      toast({ title: "Enhanced!", description: "Content improved with AI." });
      return responseData.enhanced;
    } catch (error) {
      toast({ title: "Enhancement failed", variant: "destructive" });
      return null;
    } finally {
      setEnhancingField(null);
    }
  };

  const handleEnhanceSummary = async () => {
    const enhanced = await enhanceContent(data.summary, 'summary', 'summary');
    if (enhanced) onChange({ ...data, summary: enhanced });
  };

  const updateExperience = (id: string, field: keyof Omit<ResumeExperience, 'id'>, value: any) => {
    onChange({ ...data, experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) });
  };

  const updateBullet = (expId: string, bulletIdx: number, value: string) => {
    onChange({ ...data, experience: data.experience.map(exp => exp.id === expId ? { ...exp, bullets: exp.bullets.map((b, i) => i === bulletIdx ? value : b) } : exp) });
  };

  const addBullet = (expId: string) => {
    onChange({ ...data, experience: data.experience.map(exp => exp.id === expId ? { ...exp, bullets: [...exp.bullets, ''] } : exp) });
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    onChange({ ...data, experience: data.experience.map(exp => exp.id === expId ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIdx) } : exp) });
  };

  const handleEnhanceBullet = async (expId: string, bulletIdx: number) => {
    const exp = data.experience.find(e => e.id === expId);
    if (!exp) return;
    const enhanced = await enhanceContent(exp.bullets[bulletIdx], 'bullet', `${expId}-${bulletIdx}`);
    if (enhanced) updateBullet(expId, bulletIdx, enhanced);
  };

  const addExperience = () => {
    onChange({ ...data, experience: [...data.experience, { id: `exp-${Date.now()}`, role: '', company: '', startDate: '', endDate: '', bullets: [''] }] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Omit<ResumeEducation, 'id'>, value: string) => {
    onChange({ ...data, education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) });
  };

  const addEducation = () => {
    onChange({ ...data, education: [...data.education, { id: `edu-${Date.now()}`, degree: '', institution: '', graduationDate: '', gpa: '' }] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      onChange({ ...data, skills: [...data.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter(s => s !== skill) });
  };

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="border-0 shadow-lg">
        <Collapsible open={sectionsOpen.summary} onOpenChange={() => toggleSection('summary')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 py-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" />Professional Summary</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEnhanceSummary(); }} disabled={enhancingField === 'summary' || !data.summary.trim()}>
                    {enhancingField === 'summary' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Enhance
                  </Button>
                  {sectionsOpen.summary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent><CardContent className="pt-0"><Textarea value={data.summary} onChange={(e) => onChange({ ...data, summary: e.target.value })} placeholder="Write a compelling professional summary..." className="min-h-[100px]" /></CardContent></CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Experience */}
      <Card className="border-0 shadow-lg">
        <Collapsible open={sectionsOpen.experience} onOpenChange={() => toggleSection('experience')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 py-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" />Experience ({data.experience.length})</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); addExperience(); }}><Plus className="w-3 h-3" /> Add</Button>
                  {sectionsOpen.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-lg bg-muted/30 border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Job Title" />
                      <Input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company" />
                    </div>
                    <Button size="sm" variant="ghost" className="ml-2 text-destructive" onClick={() => removeExperience(exp.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Start Date" />
                    <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="End Date" />
                  </div>
                  <div className="space-y-2">
                    {exp.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Input value={bullet} onChange={(e) => updateBullet(exp.id, idx, e.target.value)} placeholder="Achievement..." className="flex-1" />
                        <Button size="sm" variant="ghost" onClick={() => handleEnhanceBullet(exp.id, idx)} disabled={enhancingField === `${exp.id}-${idx}` || !bullet.trim()}>
                          {enhancingField === `${exp.id}-${idx}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeBullet(exp.id, idx)} disabled={exp.bullets.length <= 1}><X className="w-3 h-3" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addBullet(exp.id)}><Plus className="w-3 h-3" /> Add Bullet</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Education */}
      <Card className="border-0 shadow-lg">
        <Collapsible open={sectionsOpen.education} onOpenChange={() => toggleSection('education')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 py-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />Education ({data.education.length})</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); addEducation(); }}><Plus className="w-3 h-3" /> Add</Button>
                  {sectionsOpen.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-lg bg-muted/30 border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Degree" />
                      <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="Institution" />
                    </div>
                    <Button size="sm" variant="ghost" className="ml-2 text-destructive" onClick={() => removeEducation(edu.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={edu.graduationDate} onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)} placeholder="Graduation Date" />
                    <Input value={edu.gpa || ''} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="GPA (optional)" />
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Skills */}
      <Card className="border-0 shadow-lg">
        <Collapsible open={sectionsOpen.skills} onOpenChange={() => toggleSection('skills')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 py-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" />Skills ({data.skills.length})</span>
                {sectionsOpen.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} placeholder="Add a skill..." className="flex-1" />
                <Button onClick={addSkill} disabled={!skillInput.trim()}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-destructive/10" onClick={() => removeSkill(skill)}>{skill} <X className="w-3 h-3 ml-1" /></Badge>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
