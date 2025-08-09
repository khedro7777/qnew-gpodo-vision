
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
import { useAutoTranslation } from '@/hooks/useAutoTranslation';
import { toast } from 'sonner';

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
  const { translatePage, isTranslating } = useAutoTranslation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

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
    if (newLocale === locale || isTranslating || isChangingLanguage) return;
    
    setIsChangingLanguage(true);
    
    try {
      // Set the locale first
      setLocale(newLocale);
      
      // Show loading toast
      toast.info(`Switching to ${getLanguageName(newLocale)}...`);
      
      // Translate page content if not English
      if (newLocale !== 'en') {
        await translatePage(newLocale);
      }
      
      // Success notification
      toast.success(`Language changed to ${getLanguageName(newLocale)}`);
      
    } catch (error) {
      console.error('Failed to change language:', error);
      toast.error('Failed to change language');
      
      // Revert locale on error
      setLocale(locale);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1" 
          disabled={isTranslating || isChangingLanguage}
        >
          {isTranslating || isChangingLanguage ? (
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
            disabled={isTranslating || isChangingLanguage}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
            {(isTranslating || isChangingLanguage) && locale !== language.code && (
              <Loader2 className="w-3 h-3 ml-2 animate-spin" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
