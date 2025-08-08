
import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

const LanguageSelector = () => {
  const { locale, setLocale } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  const translatePageContent = async (targetLanguage: string, currentLanguage: string) => {
    try {
      // Get all text content from the page
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, label, a');
      const textsToTranslate = Array.from(textElements)
        .map(el => el.textContent?.trim())
        .filter(text => text && text.length > 1 && !text.match(/^[0-9\s\W]+$/))
        .slice(0, 50); // Limit to prevent large payloads

      if (textsToTranslate.length === 0) return;

      console.log('Translating texts:', textsToTranslate);

      const { data, error } = await supabase.functions.invoke('translate', {
        body: { 
          targetLanguage: getLanguageName(targetLanguage),
          currentLanguage: getLanguageName(currentLanguage),
          texts: textsToTranslate
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return;
      }

      if (data?.translatedText) {
        console.log('Translation successful:', data.translatedText);
        
        // Apply translations to the page
        try {
          const translations = JSON.parse(data.translatedText);
          if (Array.isArray(translations) && translations.length > 0) {
            textElements.forEach((element, index) => {
              if (index < translations.length && translations[index]) {
                element.textContent = translations[index];
              }
            });
          }
        } catch (parseError) {
          console.error('Error parsing translation response:', parseError);
        }
      }
    } catch (error) {
      console.error('Translation service error:', error);
    }
  };

  const getLanguageName = (code: string) => {
    const languageMap: { [key: string]: string } = {
      'en': 'English',
      'ar': 'Arabic',
      'fr': 'French',
      'zh': 'Chinese',
      'es': 'Spanish',
      'hi': 'Hindi',
      'ja': 'Japanese',
      'ko': 'Korean'
    };
    return languageMap[code] || 'English';
  };

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale || isTranslating) return;
    
    setIsTranslating(true);
    
    try {
      // First set the locale
      setLocale(newLocale);
      
      // Then translate the page content
      await translatePageContent(newLocale, locale);
      
      // Update document direction for RTL languages
      if (newLocale === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = newLocale;
      }
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1" disabled={isTranslating}>
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="text-xs">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-blue-50 text-blue-700' : ''}
            disabled={isTranslating}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {isTranslating && locale !== language.code && (
              <Loader2 className="w-3 h-3 ml-2 animate-spin" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
