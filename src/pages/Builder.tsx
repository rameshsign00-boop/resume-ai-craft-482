import { useState } from "react";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";

const Builder = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
  });

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log("Export to PDF", resumeData);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Enhance
              </Button>
              <Button onClick={handleExport} className="gap-2 bg-gradient-primary">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                Build Your Resume
              </h1>
              <p className="text-muted-foreground">
                Fill in your details and watch your resume come to life
              </p>
            </div>
            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="animate-scale-in">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
