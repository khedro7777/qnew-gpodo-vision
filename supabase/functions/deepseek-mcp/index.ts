
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { action, groupData, content } = await req.json();
    
    console.log('DeepSeek MCP request:', { action, groupData: groupData?.name });

    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    let prompt = '';
    
    switch (action) {
      case 'generate_loi':
        prompt = `Generate a professional Letter of Intent (LOI) for the business group "${groupData?.name || 'Business Group'}". 

Group Details:
- Industry: ${groupData?.industry_sectors?.name || 'General Business'}
- Country: ${groupData?.countries?.name || 'International'}
- Current Members: ${groupData?.current_members || 'Multiple'} / ${groupData?.max_members || 'Open'}

Create a comprehensive LOI that includes:
1. Purpose and objectives of the group
2. Member benefits and commitments
3. Collaboration framework
4. Next steps for implementation

Make it professional, specific to the industry, and ready for business use.`;
        break;
        
      case 'generate_terms':
        prompt = `Generate comprehensive Terms and Conditions for the business group "${groupData?.name || 'Business Group'}".

Group Details:
- Industry: ${groupData?.industry_sectors?.name || 'General Business'}
- Country: ${groupData?.countries?.name || 'International'}
- Current Members: ${groupData?.current_members || 'Multiple'} / ${groupData?.max_members || 'Open'}

Create detailed terms covering:
1. Membership requirements and obligations
2. Rights and responsibilities
3. Decision-making processes
4. Financial arrangements
5. Dispute resolution
6. Termination conditions
7. Governance structure

Make it legally sound and specific to the group's needs.`;
        break;
        
      case 'analyze_proposal':
        prompt = `As an AI business analyst, analyze this group proposal and provide recommendations:

Proposal Content:
${content}

Group Context:
- Name: ${groupData?.name || 'Business Group'}
- Industry: ${groupData?.industry_sectors?.name || 'General Business'}

Provide analysis on:
1. Feasibility and potential impact
2. Benefits and risks
3. Implementation challenges
4. Recommendation (approve, modify, reject)
5. Next steps if approved

Be thorough and objective in your analysis.`;
        break;
        
      default:
        throw new Error('Invalid action specified');
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          {
            role: 'system',
            content: 'You are MCP Assistant, an expert business AI that helps groups with document generation, proposal analysis, and strategic decision-making. Always provide professional, detailed, and actionable content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('DeepSeek response successful');

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
        action: action
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('DeepSeek MCP error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'MCP processing failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
