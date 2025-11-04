import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";

interface ResumeUploaderProps {
  onParsed: (data: ResumeData) => void;
}

export const ResumeUploader = ({ onParsed }: ResumeUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    setFileName(file.name);
    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Call edge function to parse resume
        const { data, error } = await supabase.functions.invoke('parse-resume', {
          body: { 
            file: base64,
            fileName: file.name,
            fileType: file.type
          },
        });

        if (error) {
          console.error('Parse error:', error);
          toast.error("Failed to parse resume. Please try again.");
          setUploading(false);
          return;
        }

        if (data && data.resumeData) {
          onParsed(data.resumeData);
          toast.success("Resume parsed successfully!");
        } else {
          toast.error("Could not extract data from resume");
        }
        
        setUploading(false);
      };

      reader.onerror = () => {
        toast.error("Failed to read file");
        setUploading(false);
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload resume");
      setUploading(false);
    }
  };

  return (
    <Card className="p-6 border-dashed border-2 hover:border-primary/50 transition-colors">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <Label className="text-base font-semibold">Upload Existing Resume</Label>
            <p className="text-sm text-muted-foreground">
              Parse your existing resume (PDF or DOCX)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="relative overflow-hidden"
            disabled={uploading}
            asChild
          >
            <label className="cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </Button>
          {fileName && (
            <span className="text-sm text-muted-foreground truncate">
              {fileName}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
