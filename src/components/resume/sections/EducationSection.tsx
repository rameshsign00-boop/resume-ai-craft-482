import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Education } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationSection = ({
  data,
  onChange,
}: EducationSectionProps) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
    );
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
        <Card key={edu.id} className="p-4 space-y-4 bg-secondary/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Education {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Institution</Label>
            <Input
              placeholder="University Name"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(edu.id, { institution: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Degree</Label>
              <Input
                placeholder="Bachelor's"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, { degree: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input
                placeholder="Computer Science"
                value={edu.field}
                onChange={(e) =>
                  updateEducation(edu.id, { field: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) =>
                  updateEducation(edu.id, { startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) =>
                  updateEducation(edu.id, { endDate: e.target.value })
                }
                disabled={edu.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-edu-${edu.id}`}
              checked={edu.current}
              onCheckedChange={(checked) =>
                updateEducation(edu.id, { current: checked as boolean })
              }
            />
            <Label htmlFor={`current-edu-${edu.id}`}>
              I'm currently studying here
            </Label>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
};
