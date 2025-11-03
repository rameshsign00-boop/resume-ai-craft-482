import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateSelector } from "@/components/resume/TemplateSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Download, Sparkles, Save, Target } from "lucide-react";
import { ResumeData } from "@/types/resume";
import { TemplateId } from "@/types/templates";
import { useAI } from "@/hooks/useAI";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";

const Builder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("id");
  const { analyzeJobMatch, loading: aiLoading } = useAI();

  const [user, setUser] = useState<any>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      title: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [title, setTitle] = useState("My Resume");
  const [saving, setSaving] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (resumeId && user) {
      loadResume();
    }
  }, [resumeId, user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  const loadResume = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setTemplate(data.template as TemplateId);
      setResumeData({
        personalInfo: data.personal_info as any,
        experience: data.experience as any,
        education: data.education as any,
        skills: data.skills as any,
        projects: (data.projects as any) || [],
      });
    } catch (error: any) {
      console.error("Error loading resume:", error);
      toast.error("Failed to load resume");
    }
  };

  const saveResume = async () => {
    if (!user) {
      toast.error("Please sign in to save your resume");
      navigate("/auth");
      return;
    }

    setSaving(true);
    try {
      const resumePayload = {
        user_id: user.id,
        title,
        template,
        personal_info: resumeData.personalInfo as any,
        experience: resumeData.experience as any,
        education: resumeData.education as any,
        skills: resumeData.skills as any,
        projects: resumeData.projects as any,
      };

      if (resumeId) {
        const { error } = await supabase
          .from("resumes")
          .update(resumePayload)
          .eq("id", resumeId);

        if (error) throw error;
        toast.success("Resume updated successfully!");
      } else {
        const { error } = await supabase
          .from("resumes")
          .insert([resumePayload]);

        if (error) throw error;
        toast.success("Resume saved successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const handleJobMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    try {
      const result = await analyzeJobMatch(resumeData, jobDescription);
      setMatchResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Job match error:", error);
    }
  };

  const handleExport = () => {
    toast.info("PDF export feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(user ? "/dashboard" : "/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Target className="h-4 w-4" />
                    Job Match
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>AI Job Match Analyzer</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Job Description</Label>
                      <Textarea
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button
                      onClick={handleJobMatch}
                      disabled={aiLoading}
                      className="w-full bg-gradient-primary"
                    >
                      {aiLoading ? "Analyzing..." : "Analyze Match"}
                    </Button>

                    {matchResult && (
                      <Card className="p-6 bg-secondary/30">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-center mb-2">
                              {matchResult.matchPercentage}% Match
                            </h3>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div
                                className="bg-gradient-primary h-3 rounded-full transition-all"
                                style={{ width: `${matchResult.matchPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Strengths</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {matchResult.strengths?.map((s: string, i: number) => (
                                <li key={i} className="text-sm">{s}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Missing Skills</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {matchResult.gaps?.map((g: string, i: number) => (
                                <li key={i} className="text-sm text-destructive">{g}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Recommendations</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {matchResult.recommendations?.map((r: string, i: number) => (
                                <li key={i} className="text-sm">{r}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {user && (
                <Button
                  onClick={saveResume}
                  disabled={saving}
                  variant="outline"
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              )}

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

            <Card className="p-4 backdrop-blur-sm bg-card/80 border-border/50">
              <TemplateSelector selected={template} onSelect={setTemplate} />
            </Card>

            <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="animate-scale-in">
              <ResumePreview resumeData={resumeData} template={template} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
