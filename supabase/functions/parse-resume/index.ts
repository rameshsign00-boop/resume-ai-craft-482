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
    const { text, file, fileName, fileType } = await req.json();

    // Get API key from environment
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Remove base64 prefix if present (legacy support)
    const base64Data = typeof file === 'string' && file.includes('base64,')
      ? file.split('base64,')[1]
      : (typeof file === 'string' ? file : '');

    // Prepare prompt for AI
    const systemPrompt = `You are a resume parser. Extract structured information from the resume and return it in JSON format.
Return ONLY valid JSON with this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "title": "string",
    "summary": "string"
  },
  "experience": [
    {
      "id": "unique-id",
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "current": boolean,
      "description": "string"
    }
  ],
  "education": [
    {
      "id": "unique-id",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "current": boolean
    }
  ],
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "id": "unique-id",
      "name": "string",
      "description": "string",
      "technologies": "string",
      "link": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }
  ]
}`;

    const inputText = typeof text === 'string' ? text : '';
    const snippet = inputText.length > 12000 ? inputText.slice(0, 12000) : inputText;
    const userPrompt = inputText
      ? `Parse this resume PLAIN TEXT and extract all information. Return ONLY JSON matching the schema.\n\n${snippet}`
      : `No plain text provided. If a file was uploaded by an older client, ignore it and return an empty-but-valid JSON per the schema with empty strings/arrays.`;
    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded');
      } else if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted');
      }
      
      throw new Error('AI processing failed');
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response and normalize to schema
    let resumeData: any;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      resumeData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI');
    }

    // Normalize to expected ResumeData shape
    const toStr = (v: any) => (typeof v === 'string' ? v.trim() : '');
    const ensureArr = (v: any) => (Array.isArray(v) ? v : []);
    const genId = (p: string, i: number) => `${p}-${Date.now()}-${i}`;

    const normalized = {
      personalInfo: {
        fullName: toStr(resumeData?.personalInfo?.fullName),
        email: toStr(resumeData?.personalInfo?.email),
        phone: toStr(resumeData?.personalInfo?.phone),
        location: toStr(resumeData?.personalInfo?.location),
        linkedin: toStr(resumeData?.personalInfo?.linkedin),
        title: toStr(resumeData?.personalInfo?.title),
        summary: toStr(resumeData?.personalInfo?.summary),
      },
      experience: ensureArr(resumeData?.experience).map((it: any, i: number) => ({
        id: toStr(it?.id) || genId('exp', i),
        company: toStr(it?.company),
        position: toStr(it?.position),
        startDate: toStr(it?.startDate),
        endDate: toStr(it?.endDate),
        current: Boolean((it as any)?.current) || toStr(it?.endDate).toLowerCase() === 'present',
        description: toStr(it?.description),
      })),
      education: ensureArr(resumeData?.education).map((it: any, i: number) => ({
        id: toStr(it?.id) || genId('edu', i),
        institution: toStr(it?.institution),
        degree: toStr(it?.degree),
        field: toStr(it?.field),
        startDate: toStr(it?.startDate),
        endDate: toStr(it?.endDate),
        current: Boolean((it as any)?.current) || false,
      })),
      skills: ensureArr(resumeData?.skills).map((s: any) => toStr(s)).filter(Boolean),
      projects: ensureArr(resumeData?.projects).map((it: any, i: number) => ({
        id: toStr(it?.id) || genId('prj', i),
        name: toStr(it?.name),
        description: toStr(it?.description),
        technologies: toStr(it?.technologies),
        link: toStr(it?.link),
        startDate: toStr(it?.startDate),
        endDate: toStr(it?.endDate),
      })),
    };

    return new Response(
      JSON.stringify({ resumeData: normalized }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error parsing resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
