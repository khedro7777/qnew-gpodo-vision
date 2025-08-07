
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { targetLanguage, currentLanguage, texts } = await req.json()

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text from ${currentLanguage} to ${targetLanguage}. Maintain the original meaning and context. For UI elements, keep translations concise and appropriate for interface use. Only return the translated text, nothing else.`
          },
          {
            role: 'user',
            content: `Translate: ${JSON.stringify(texts || 'Hello World')}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Translation failed')
    }

    const translatedText = data.choices[0]?.message?.content || 'Translation not available'

    return new Response(
      JSON.stringify({ 
        success: true, 
        translatedText,
        targetLanguage,
        sourceLanguage: currentLanguage 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
