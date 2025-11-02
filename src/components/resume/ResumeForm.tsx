import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ResumeData } from "@/types/resume";
import { User, Briefcase, GraduationCap, Sparkles } from "lucide-react";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export const ResumeForm = ({ resumeData, setResumeData }: ResumeFormProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/80 border-border/50">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <PersonalInfoSection
            data={resumeData.personalInfo}
            onChange={(personalInfo) =>
              setResumeData({ ...resumeData, personalInfo })
            }
          />
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <ExperienceSection
            data={resumeData.experience}
            onChange={(experience) =>
              setResumeData({ ...resumeData, experience })
            }
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <EducationSection
            data={resumeData.education}
            onChange={(education) =>
              setResumeData({ ...resumeData, education })
            }
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillsSection
            data={resumeData.skills}
            onChange={(skills) => setResumeData({ ...resumeData, skills })}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
