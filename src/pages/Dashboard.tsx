import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  FileText,
  LogOut,
  Trash2,
  Edit,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface Resume {
  id: string;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    fetchResumes();
  };

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error: any) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const deleteResume = async (id: string) => {
    try {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;

      setResumes(resumes.filter((r) => r.id !== id));
      toast.success("Resume deleted");
    } catch (error: any) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">My Resumes</h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/builder")}
                className="gap-2 bg-gradient-primary"
              >
                <Plus className="h-4 w-4" />
                New Resume
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <h2 className="text-xl text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <Card className="p-12 text-center backdrop-blur-sm bg-card/80 border-border/50 animate-scale-in">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first resume and let AI help you shine
            </p>
            <Button
              onClick={() => navigate("/builder")}
              className="gap-2 bg-gradient-primary"
            >
              <Plus className="h-4 w-4" />
              Create Your First Resume
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <Card
                key={resume.id}
                className="p-6 backdrop-blur-sm bg-card/80 border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {resume.template} template
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  Updated {formatDate(resume.updated_at)}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => navigate(`/builder?id=${resume.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteResume(resume.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
