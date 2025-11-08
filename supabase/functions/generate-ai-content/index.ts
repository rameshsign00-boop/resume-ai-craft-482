import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating AI content for type:', type);

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'summary') {
      systemPrompt = 'You are a professional resume writer. Generate a compelling professional summary based on the provided information. Keep it concise (2-3 sentences) and impactful.';
      userPrompt = `Generate a professional summary for:
      Title: ${data.title || 'Professional'}
      Name: ${data.name || 'Job Seeker'}
      Experience: ${JSON.stringify(data.experience || [])}
      Skills: ${JSON.stringify(data.skills || [])}`;
    } else if (type === 'job-description') {
      systemPrompt = 'You are an expert resume writer. Improve the job description to be more professional, impactful, and achievement-focused. Use action verbs and quantify results where possible.';
      userPrompt = `Improve this job description:
      Position: ${data.position}
      Company: ${data.company}
      Current description: ${data.description}`;
    } else if (type === 'skills-suggest') {
      systemPrompt = 'You are a career advisor. Based on the provided job title and experience, suggest 8-10 relevant professional skills.';
      userPrompt = `Suggest skills for:
      Title: ${data.title}
      Experience: ${JSON.stringify(data.experience || [])}`;
    } else if (type === 'bullet-points') {
      systemPrompt = 'You are an expert resume writer. Transform the provided job description into 3 different versions of achievement-focused bullet points. Each version should have 3-5 bullet points using strong action verbs and quantifiable results where possible. Format: return EXACTLY 3 versions separated by "---VERSION---". Each bullet point should start with "• ".';
      userPrompt = `Create 3 versions of bullet points for:
      Position: ${data.jobTitle}
      Company: ${data.company}
      Current description: ${data.description}
      
      Return exactly 3 versions separated by ---VERSION---`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedText = aiResponse.choices[0].message.content;

    console.log('AI content generated successfully');

    return new Response(
      JSON.stringify({ content: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-ai-content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
