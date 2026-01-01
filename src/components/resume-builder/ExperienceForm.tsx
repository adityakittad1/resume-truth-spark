import { Experience } from "@/types/resume";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Plus, Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm = ({ data, onChange }: ExperienceFormProps) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      data.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const addBulletPoint = (id: string) => {
    onChange(
      data.map((exp) =>
        exp.id === id
          ? { ...exp, description: [...exp.description, ""] }
          : exp
      )
    );
  };

  const updateBulletPoint = (expId: string, index: number, value: string) => {
    onChange(
      data.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              description: exp.description.map((d, i) =>
                i === index ? value : d
              ),
            }
          : exp
      )
    );
  };

  const removeBulletPoint = (expId: string, index: number) => {
    onChange(
      data.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              description: exp.description.filter((_, i) => i !== index),
            }
          : exp
      )
    );
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            Work Experience
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="popLayout">
          {data.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-border/50 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Experience {index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Position *</Label>
                  <Input
                    placeholder="Software Engineer"
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(exp.id, "position", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Company *</Label>
                  <Input
                    placeholder="Tech Company Inc."
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Location</Label>
                  <Input
                    placeholder="San Francisco, CA"
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(exp.id, "location", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Label className="text-sm font-medium">Start Date *</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label className="text-sm font-medium">End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    updateExperience(exp.id, "current", checked)
                  }
                />
                <Label
                  htmlFor={`current-${exp.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Key Achievements & Responsibilities
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addBulletPoint(exp.id)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    Add Bullet
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.description.map((bullet, bIndex) => (
                    <div key={bIndex} className="flex gap-2">
                      <span className="text-muted-foreground mt-2.5">•</span>
                      <Textarea
                        placeholder="Describe your achievement with metrics if possible..."
                        value={bullet}
                        onChange={(e) =>
                          updateBulletPoint(exp.id, bIndex, e.target.value)
                        }
                        rows={2}
                        className="resize-none flex-1"
                      />
                      {exp.description.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBulletPoint(exp.id, bIndex)}
                          className="text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Start with action verbs. Include numbers and metrics when possible.
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {data.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No experience added yet</p>
            <p className="text-xs">Click "Add" to add your work experience</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
