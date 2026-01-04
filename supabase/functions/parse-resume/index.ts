import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { fileContent, fileName, fileBase64, mimeType } = await req.json();
    if (!fileContent && !fileBase64) return new Response(JSON.stringify({ error: 'No file content' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const jsonStructure = `{"contact":{"name":"","email":"","phone":"","location":"","linkedin":"","github":""},"summary":"","experience":[{"role":"","company":"","startDate":"","endDate":"","bullets":[]}],"education":[{"degree":"","institution":"","graduationDate":"","gpa":""}],"skills":[],"projects":[{"name":"","description":"","technologies":[]}],"certifications":[{"name":"","issuer":"","date":""}]}`;

    let messages: any[];
    if (fileBase64 && mimeType) {
      messages = [{ role: 'system', content: 'Parse resume to JSON only.' }, { role: 'user', content: [{ type: 'text', text: `Parse resume to: ${jsonStructure}` }, { type: 'image_url', image_url: { url: `data:${mimeType};base64,${fileBase64}` } }] }];
    } else {
      messages = [{ role: 'system', content: 'Parse resume to JSON only.' }, { role: 'user', content: `Parse to ${jsonStructure}:\n${fileContent?.substring(0, 15000)}` }];
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages, temperature: 0.1 }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      throw new Error(`AI error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || '{}';
    const jsonMatch = content.replace(/```json\n?/g, '').replace(/```/g, '').match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return new Response(JSON.stringify({
      contact: { name: parsed.contact?.name || '', email: parsed.contact?.email || '', phone: parsed.contact?.phone || '', location: parsed.contact?.location || '', linkedin: parsed.contact?.linkedin || '', github: parsed.contact?.github || '' },
      summary: parsed.summary || '',
      experience: parsed.experience || [],
      education: parsed.education || [],
      skills: parsed.skills || [],
      projects: parsed.projects || [],
      certifications: parsed.certifications || []
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
