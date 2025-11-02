import { Card } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";
import { TemplateId, RESUME_TEMPLATES } from "@/types/templates";
import { Mail, Phone, MapPin } from "lucide-react";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template?: TemplateId;
}

export const ResumePreview = ({ resumeData, template = 'modern' }: ResumePreviewProps) => {
  const { personalInfo, experience, education, skills } = resumeData;
  const currentTemplate = RESUME_TEMPLATES.find(t => t.id === template);

  const templateStyles = {
    borderColor: currentTemplate?.primaryColor || 'hsl(var(--primary))',
    accentColor: currentTemplate?.accentColor || 'hsl(var(--accent))',
  };

  return (
    <Card className="p-8 bg-card shadow-elegant min-h-[800px]" style={{ '--template-primary': templateStyles.borderColor, '--template-accent': templateStyles.accentColor } as any}>
      {/* Header */}
      <div className="border-b-2 pb-4 mb-6" style={{ borderColor: templateStyles.borderColor }}>
        <h1 className="text-3xl font-bold text-foreground mb-1">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p className="text-lg font-medium mb-3" style={{ color: templateStyles.borderColor }}>
          {personalInfo.title || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {personalInfo.location}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2 border-b border-border pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-3 border-b border-border pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {exp.position}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: templateStyles.borderColor }}>
                      {exp.company}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-3 border-b border-border pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: templateStyles.borderColor }}>
                      {edu.institution}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-3 border-b border-border pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${templateStyles.borderColor}20`,
                  color: templateStyles.borderColor
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!personalInfo.fullName &&
        experience.length === 0 &&
        education.length === 0 &&
        skills.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Start filling in your details to see your resume preview</p>
          </div>
        )}
    </Card>
  );
};
