
import { useState, useEffect, useCallback } from 'react';
import { translationManager } from '@/utils/translationManager';
import { useTranslation } from './useTranslation';

export const useAutoTranslation = () => {
  const { locale } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  const translateContent = useCallback(async (text: string, targetLanguage?: string) => {
    if (!text || text.trim().length === 0) return text;
    
    const target = targetLanguage || locale;
    if (target === 'en') return text; // No translation needed for English

    try {
      setIsTranslating(true);
      const translated = await translationManager.translateText(text, target, 'en');
      return translated;
    } catch (error) {
      console.error('Auto-translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  }, [locale]);

  const translateElement = useCallback(async (element: HTMLElement, targetLanguage?: string) => {
    const originalText = element.textContent;
    if (!originalText) return;

    const translatedText = await translateContent(originalText, targetLanguage);
    if (translatedText !== originalText) {
      element.textContent = translatedText;
    }
  }, [translateContent]);

  const translatePage = useCallback(async (targetLanguage?: string) => {
    const target = targetLanguage || locale;
    if (target === 'en') return;

    setIsTranslating(true);
    
    try {
      const elements = document.querySelectorAll('[data-translate], h1, h2, h3, h4, h5, h6, p, span, button, label');
      const promises = Array.from(elements).map(el => translateElement(el as HTMLElement, target));
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Page translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [locale, translateElement]);

  return {
    translateContent,
    translateElement,
    translatePage,
    isTranslating
  };
};
