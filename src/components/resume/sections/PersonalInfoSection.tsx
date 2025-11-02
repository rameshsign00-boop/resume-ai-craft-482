import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PersonalInfo } from "@/types/resume";
import { Sparkles } from "lucide-react";

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoSection = ({
  data,
  onChange,
}: PersonalInfoSectionProps) => {
  const handleAIGenerate = () => {
    // TODO: Integrate with AI
    const aiSummary = `Experienced ${data.title || "professional"} with a proven track record of delivering exceptional results. Skilled in driving innovation and leading cross-functional teams to achieve organizational goals.`;
    onChange({ ...data, summary: aiSummary });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            placeholder="Senior Software Engineer"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAIGenerate}
            className="gap-2"
          >
            <Sparkles className="h-3 w-3" />
            AI Generate
          </Button>
        </div>
        <Textarea
          id="summary"
          placeholder="A brief summary of your professional background and key achievements..."
          value={data.summary}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
};
