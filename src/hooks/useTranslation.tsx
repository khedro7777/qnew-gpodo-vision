
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  detectedSourceLang?: string;
  error?: string;
}

export const useTranslation = () => {
  const [loading, setLoading] = useState(false);

  const translate = useCallback(async (
    text: string,
    targetLang: string,
    sourceLang = 'auto'
  ): Promise<string> => {
    setLoading(true);
    try {
      console.log('Translating text:', { text: text.substring(0, 50) + '...', targetLang, sourceLang });

      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text,
          targetLang,
          sourceLang,
        },
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      console.log('Translation successful');
      return data.translatedText;
    } catch (error: any) {
      console.error('Translation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    translate,
    loading,
  };
};
