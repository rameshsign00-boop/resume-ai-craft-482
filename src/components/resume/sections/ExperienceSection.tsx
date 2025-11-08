import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/types/resume";
import { Plus, Trash2, Edit, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ExperienceSectionProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceSection = ({
  data,
  onChange,
}: ExperienceSectionProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [enhanceDialogOpen, setEnhanceDialogOpen] = useState(false);
  const [currentExpId, setCurrentExpId] = useState<string>("");
  const [enhancedVersions, setEnhancedVersions] = useState<string[]>([]);
  const { enhanceBulletPoints, loading } = useAI();

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

  const handleEnhance = async (exp: Experience) => {
    if (!exp.position || !exp.company || !exp.description) {
      toast.error("Please fill in position, company, and description first");
      return;
    }

    setCurrentExpId(exp.id);
    setEnhanceDialogOpen(true);

    try {
      const result = await enhanceBulletPoints(
        exp.description,
        exp.position,
        exp.company
      );
      
      // Split by the separator to get 3 versions
      const versions = result.split('---VERSION---').map((v: string) => v.trim()).filter((v: string) => v);
      setEnhancedVersions(versions);
    } catch (error) {
      console.error("Enhancement error:", error);
      setEnhanceDialogOpen(false);
    }
  };

  const applyVersion = (version: string) => {
    updateExperience(currentExpId, { description: version });
    setEnhanceDialogOpen(false);
    setEnhancedVersions([]);
    toast.success("Bullet points applied!");
  };

  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <GlassCard key={exp.id} variant="subtle" className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Experience {index + 1}</h3>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditingId(exp.id)}
                className="gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                placeholder="Software Engineer"
                value={exp.position}
                autoFocus={editingId === exp.id}
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
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <PremiumButton
                type="button"
                variant="glass"
                size="sm"
                onClick={() => handleEnhance(exp)}
                disabled={loading}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Enhance
              </PremiumButton>
            </div>
            <Textarea
              placeholder="Describe your responsibilities and achievements..."
              value={exp.description}
              onChange={(e) =>
                updateExperience(exp.id, { description: e.target.value })
              }
              rows={4}
            />
          </div>
        </GlassCard>
      ))}

      <PremiumButton
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Experience
      </PremiumButton>

      {/* AI Enhancement Dialog */}
      <Dialog open={enhanceDialogOpen} onOpenChange={setEnhanceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Enhanced Bullet Points
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <p className="text-muted-foreground">Generating enhanced versions...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {enhancedVersions.map((version, index) => (
                <GlassCard key={index} variant="subtle" className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Version {index + 1}</h4>
                    <PremiumButton
                      size="sm"
                      variant="primary"
                      onClick={() => applyVersion(version)}
                    >
                      Use This
                    </PremiumButton>
                  </div>
                  <div className="text-sm whitespace-pre-line text-muted-foreground">
                    {version}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
