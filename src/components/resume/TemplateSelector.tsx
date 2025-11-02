import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { RESUME_TEMPLATES, TemplateId } from "@/types/templates";

interface TemplateSelectorProps {
  selected: TemplateId;
  onSelect: (template: TemplateId) => void;
}

export const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Template</h3>
      <div className="grid grid-cols-2 gap-4">
        {RESUME_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-elegant ${
              selected === template.id
                ? 'border-primary shadow-glow'
                : 'border-border/50 hover:border-primary/50'
            }`}
            onClick={() => onSelect(template.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{template.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {template.description}
                </p>
              </div>
              {selected === template.id && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div
                className="h-8 w-8 rounded"
                style={{ backgroundColor: template.primaryColor }}
              />
              <div
                className="h-8 w-8 rounded"
                style={{ backgroundColor: template.accentColor }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
