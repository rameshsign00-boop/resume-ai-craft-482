import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceSection = ({
  data,
  onChange,
}: ExperienceSectionProps) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <Card key={exp.id} className="p-4 space-y-4 bg-secondary/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Experience {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                placeholder="Software Engineer"
                value={exp.position}
                onChange={(e) =>
                  updateExperience(exp.id, { position: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                placeholder="Tech Corp"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp.id, { company: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(exp.id, { startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) =>
                  updateExperience(exp.id, { endDate: e.target.value })
                }
                disabled={exp.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${exp.id}`}
              checked={exp.current}
              onCheckedChange={(checked) =>
                updateExperience(exp.id, { current: checked as boolean })
              }
            />
            <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your responsibilities and achievements..."
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp.id, { description: e.target.value })
              }
              rows={3}
            />
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
};
