import { Skill } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, Plus, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SKILL_CATEGORIES = [
  "Technical",
  "Programming Languages",
  "Frameworks",
  "Tools",
  "Soft Skills",
  "Languages",
  "Other",
];

export const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technical");

  const addSkill = () => {
    if (!newSkill.trim()) return;

    const skill: Skill = {
      id: crypto.randomUUID(),
      name: newSkill.trim(),
      category: selectedCategory,
    };
    onChange([...data, skill]);
    setNewSkill("");
  };

  const removeSkill = (id: string) => {
    onChange(data.filter((skill) => skill.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const groupedSkills = data.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-primary" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium">Add Skill</Label>
            <Input
              placeholder="e.g., React, Python, Project Management"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="sm:w-48 space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={addSkill} className="gap-1">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category} className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {category}
                </Label>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {skills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="secondary"
                          className="pl-3 pr-1.5 py-1.5 gap-1 text-sm"
                        >
                          {skill.name}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No skills added yet</p>
            <p className="text-xs">Add skills relevant to your target role</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Tip: Include both technical and soft skills. Match skills from job descriptions.
        </p>
      </CardContent>
    </Card>
  );
};
