import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { resumeTemplates, TemplateId } from "./ResumeTemplates";

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {resumeTemplates.map((template) => (
        <Card
          key={template.id}
          className={`
            cursor-pointer transition-all duration-200 overflow-hidden
            hover:shadow-lg hover:scale-[1.02]
            ${selectedTemplate === template.id
              ? 'ring-2 ring-primary shadow-lg'
              : 'hover:ring-1 hover:ring-primary/50'
            }
          `}
          onClick={() => onSelectTemplate(template.id)}
        >
          <CardContent className="p-0">
            {/* Template Preview */}
            <div className={`h-24 bg-gradient-to-br ${template.preview} relative`}>
              {/* Mini resume mockup */}
              <div className="absolute inset-2 bg-white rounded shadow-sm p-2">
                <div className="h-2 w-12 bg-gray-300 rounded mb-1 mx-auto" />
                <div className="h-1 w-16 bg-gray-200 rounded mb-2 mx-auto" />
                <div className="space-y-1">
                  <div className="h-1 w-full bg-gray-100 rounded" />
                  <div className="h-1 w-3/4 bg-gray-100 rounded" />
                  <div className="h-1 w-5/6 bg-gray-100 rounded" />
                </div>
              </div>

              {/* Selected indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Template info */}
            <div className="p-2">
              <p className="text-xs font-semibold text-center">{template.name}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
