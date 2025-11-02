import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileText, Download, Zap, Shield, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wand2,
      title: "AI-Powered",
      description: "Generate professional content with advanced AI technology",
    },
    {
      icon: FileText,
      title: "Modern Templates",
      description: "Beautiful, ATS-friendly resume designs that stand out",
    },
    {
      icon: Download,
      title: "Easy Export",
      description: "Download your resume as PDF with a single click",
    },
    {
      icon: Zap,
      title: "Real-time Preview",
      description: "See your changes instantly as you build your resume",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is secure and never shared with third parties",
    },
    {
      icon: Sparkles,
      title: "Job Matching",
      description: "AI analyzes how well your resume fits job descriptions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-glow" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary animate-float" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Resume Builder
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Create Your Perfect{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Resume
              </span>{" "}
              in Minutes
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stand out from the crowd with AI-generated content and professionally designed templates. 
              Build, customize, and download your resume with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="gap-2 bg-gradient-primary shadow-glow text-lg px-8 py-6 animate-scale-in"
              >
                <Sparkles className="h-5 w-5" />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/builder")}
                className="text-lg px-8 py-6 backdrop-blur-sm"
              >
                Try Without Signup
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help you create the perfect resume
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden backdrop-blur-sm bg-gradient-primary p-12 text-center">
          <div className="absolute inset-0 bg-gradient-accent opacity-20 animate-glow" />
          <div className="relative space-y-6 animate-scale-in">
            <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground">
              Ready to Build Your Future?
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Join thousands of job seekers who've landed their dream jobs with our AI-powered resume builder
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="gap-2 bg-card text-foreground hover:bg-card/90 text-lg px-8 py-6 shadow-elegant"
            >
              <Sparkles className="h-5 w-5" />
              Create Free Account
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Index;
