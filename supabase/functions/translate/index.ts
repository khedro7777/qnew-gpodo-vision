
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLang, sourceLang = 'auto' } = await req.json();
    
    console.log('Translation request:', { text: text.substring(0, 50) + '...', targetLang, sourceLang });

    const apiKey = Deno.env.get('DEEPL_API_KEY');
    if (!apiKey) {
      throw new Error('DeepL API key not configured');
    }

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang.toUpperCase(),
        ...(sourceLang !== 'auto' && { source_lang: sourceLang.toUpperCase() })
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Translation successful');

    return new Response(
      JSON.stringify({
        success: true,
        translatedText: data.translations[0].text,
        detectedSourceLang: data.translations[0].detected_source_language,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Translation failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
