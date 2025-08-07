
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

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return;
    
    setIsTranslating(true);
    
    try {
      // Call DeepSeek translation service
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { 
          targetLanguage: newLocale,
          currentLanguage: locale 
        }
      });

      if (error) {
        console.error('Translation error:', error);
      } else {
        console.log('Translation successful:', data);
      }
      
      setLocale(newLocale);
    } catch (error) {
      console.error('Failed to translate:', error);
      // Still change the language even if translation fails
      setLocale(newLocale);
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
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
