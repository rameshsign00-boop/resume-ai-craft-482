import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProjectsSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsSection = ({
  data,
  onChange,
}: ProjectsSectionProps) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(
      data.map((project) => (project.id === id ? { ...project, ...updates } : project))
    );
  };

  const removeProject = (id: string) => {
    onChange(data.filter((project) => project.id !== id));
  };

  return (
    <div className="space-y-4">
      {data.map((project, index) => (
        <Card key={project.id} className="p-4 space-y-4 bg-secondary/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Project {index + 1}</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeProject(project.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              placeholder="E-commerce Platform"
              value={project.name}
              onChange={(e) =>
                updateProject(project.id, { name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Technologies Used</Label>
              <Input
                placeholder="React, Node.js, MongoDB"
                value={project.technologies}
                onChange={(e) =>
                  updateProject(project.id, { technologies: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Project Link</Label>
              <Input
                placeholder="https://github.com/..."
                value={project.link}
                onChange={(e) =>
                  updateProject(project.id, { link: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="month"
                value={project.startDate}
                onChange={(e) =>
                  updateProject(project.id, { startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                value={project.endDate}
                onChange={(e) =>
                  updateProject(project.id, { endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the project, your role, and achievements..."
              value={project.description}
              onChange={(e) =>
                updateProject(project.id, { description: e.target.value })
              }
              rows={3}
            />
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
};
