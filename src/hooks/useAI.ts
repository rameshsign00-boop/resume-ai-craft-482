import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const generateContent = async (type: string, data: any) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-ai-content",
        {
          body: { type, data },
        }
      );

      if (error) {
        if (error.message?.includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes('402')) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to generate content");
        }
        throw error;
      }

      return result.content;
    } catch (error) {
      console.error("AI generation error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeJobMatch = async (resumeData: any, jobDescription: string) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke(
        "job-matcher",
        {
          body: { resumeData, jobDescription },
        }
      );

      if (error) {
        if (error.message?.includes('429')) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes('402')) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to analyze job match");
        }
        throw error;
      }

      return result;
    } catch (error) {
      console.error("Job match error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateContent,
    analyzeJobMatch,
    loading,
  };
};
