import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit, Check, Ban } from "lucide-react";

interface SkillsSectionProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export const SkillsSection = ({ data, onChange }: SkillsSectionProps) => {
  const [inputValue, setInputValue] = useState("");
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const addSkill = () => {
    if (inputValue.trim() && !data.includes(inputValue.trim())) {
      onChange([...data, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(data.filter((s) => s !== skill));
    if (editingSkill === skill) {
      setEditingSkill(null);
      setEditValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const startEdit = (skill: string) => {
    setEditingSkill(skill);
    setEditValue(skill);
  };

  const saveEdit = () => {
    if (!editingSkill) return;
    const trimmed = editValue.trim();
    if (!trimmed) return;
    const updated = data.map((s) => (s === editingSkill ? trimmed : s));
    onChange(updated);
    setEditingSkill(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditValue("");
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Add Skills</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., JavaScript, Project Management"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button type="button" onClick={addSkill} className="gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="space-y-2">
          <Label>Your Skills</Label>
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <div key={skill} className="flex items-center gap-2">
                {editingSkill === skill ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                    <Button type="button" size="sm" variant="secondary" className="h-8 px-2" onClick={saveEdit}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-8 px-2" onClick={cancelEdit}>
                      <Ban className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant="secondary" className="gap-1 pr-1 text-sm">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => startEdit(skill)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
