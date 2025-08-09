
import { supabase } from '@/integrations/supabase/client';

export interface TranslationCache {
  [key: string]: {
    [locale: string]: string;
  };
}

export class TranslationManager {
  private cache: TranslationCache = {};
  private pendingTranslations = new Map<string, Promise<string>>();

  constructor() {
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem('translation_cache');
      if (stored) {
        this.cache = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }

  private saveCacheToStorage() {
    try {
      localStorage.setItem('translation_cache', JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  async translateText(text: string, targetLanguage: string, currentLanguage: string = 'en'): Promise<string> {
    const cacheKey = `${text}_${currentLanguage}_${targetLanguage}`;
    
    // Check cache first
    if (this.cache[text] && this.cache[text][targetLanguage]) {
      return this.cache[text][targetLanguage];
    }

    // Check if translation is already pending
    if (this.pendingTranslations.has(cacheKey)) {
      return this.pendingTranslations.get(cacheKey)!;
    }

    // Start new translation
    const translationPromise = this.performTranslation(text, targetLanguage, currentLanguage);
    this.pendingTranslations.set(cacheKey, translationPromise);

    try {
      const result = await translationPromise;
      
      // Cache the result
      if (!this.cache[text]) {
        this.cache[text] = {};
      }
      this.cache[text][targetLanguage] = result;
      this.saveCacheToStorage();
      
      return result;
    } finally {
      this.pendingTranslations.delete(cacheKey);
    }
  }

  private async performTranslation(text: string, targetLanguage: string, currentLanguage: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          targetLanguage,
          currentLanguage,
          texts: [text]
        }
      });

      if (error) {
        console.error('Translation API error:', error);
        return text; // Return original text on error
      }

      if (data?.translatedText) {
        try {
          const translations = JSON.parse(data.translatedText);
          return Array.isArray(translations) && translations[0] ? translations[0] : text;
        } catch (parseError) {
          console.error('Translation parsing error:', parseError);
          return text;
        }
      }

      return text;
    } catch (error) {
      console.error('Translation service error:', error);
      return text;
    }
  }

  clearCache() {
    this.cache = {};
    localStorage.removeItem('translation_cache');
  }
}

export const translationManager = new TranslationManager();
