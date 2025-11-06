import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import * as pdfjsLib from "pdfjs-dist";
// Try to set the worker src for pdf.js (Vite will turn this into a URL)
// It's safe to ignore if it fails in some environments.
try {
  // @ts-ignore - dynamic import with ?url is fine in Vite
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import("pdfjs-dist/build/pdf.worker.mjs?url").then((m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdfjsLib as any).GlobalWorkerOptions && ((pdfjsLib as any).GlobalWorkerOptions.workerSrc = m.default);
  });
} catch {}
import mammoth from "mammoth";

interface ResumeUploaderProps {
  onParsed: (data: ResumeData) => void;
}

export const ResumeUploader = ({ onParsed }: ResumeUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const extractPdfText = async (arrayBuffer: ArrayBuffer) => {
    const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = (content.items || []).map((item: any) => (item.str || ""));
      text += strings.join(" ") + "\n";
    }
    return text.trim();
  };

  const extractDocxText = async (arrayBuffer: ArrayBuffer) => {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return (result.value || "").trim();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    setPendingFile(file);
    setFileName(file.name);
    setShowConfirmDialog(true);
    
    // Reset the input
    event.target.value = '';
  };

  const handleCancelFile = () => {
    setPendingFile(null);
    setFileName("");
    setShowConfirmDialog(false);
  };

  const handleConfirmParse = async () => {
    if (!pendingFile) return;
    
    setShowConfirmDialog(false);
    setUploading(true);

    try {
      const arrayBuffer = await pendingFile.arrayBuffer();
      let text = "";
      if (pendingFile.type === 'application/pdf') {
        text = await extractPdfText(arrayBuffer);
      } else {
        text = await extractDocxText(arrayBuffer);
      }

      if (!text) {
        toast.error("Could not read text from file. Please try a different file.");
        setUploading(false);
        setPendingFile(null);
        setFileName("");
        return;
      }

      // Call edge function to parse resume text
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: { 
          text,
          fileName: pendingFile.name,
          fileType: pendingFile.type
        },
      });

      if (error) {
        console.error('Parse error:', error);
        if ((error.message || '').includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if ((error.message || '').includes('402')) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to parse resume. Please try again.");
        }
        setUploading(false);
        setPendingFile(null);
        setFileName("");
        return;
      }

      if (data && data.resumeData) {
        onParsed(data.resumeData as ResumeData);
        toast.success("Resume parsed successfully!");
      } else {
        toast.error("Could not extract data from resume");
      }
      
      setUploading(false);
      setPendingFile(null);
      setFileName("");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to process file");
      setUploading(false);
      setPendingFile(null);
      setFileName("");
    }
  };

  return (
    <>
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
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </Button>
            {fileName && !uploading && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground truncate">
                  {fileName}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCancelFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Resume Import</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to parse and import "{fileName}"? This will extract the resume data and populate the form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelFile}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmParse}>
              Confirm & Parse
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
