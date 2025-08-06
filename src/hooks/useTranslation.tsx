
import { useState, useEffect } from 'react';

interface TranslationHook {
  t: (key: string) => string;
  locale: string;
  isRTL: boolean;
  setLocale: (locale: string) => void;
}

const translations = {
  en: {
    // MCP Assistant
    'MCP Assistant': 'MCP Assistant',
    'Automated Presentation Management': 'Automated Presentation Management',
    'Generate LOI': 'Generate LOI',
    'Generate Terms & Conditions': 'Generate Terms & Conditions',
    'MCP Generated': 'MCP Generated',
    'Version': 'Version',
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Edit': 'Edit',
    'Last updated by': 'Last updated by',
    'No presentations yet': 'No presentations yet',
    'Use MCP Assistant to generate Letter of Intent and Terms & Conditions for your group': 'Use MCP Assistant to generate Letter of Intent and Terms & Conditions for your group',
    'Letter of Intent generated successfully by MCP Assistant': 'Letter of Intent generated successfully by MCP Assistant',
    'Terms and Conditions generated successfully by MCP Assistant': 'Terms and Conditions generated successfully by MCP Assistant',
    'Failed to generate presentation': 'Failed to generate presentation',
    'Presentation updated successfully': 'Presentation updated successfully',
    'Failed to save presentation': 'Failed to save presentation',
    'Loading presentations...': 'Loading presentations...',
    'Edit presentation content...': 'Edit presentation content...',
    
    // Status translations
    'draft': 'Draft',
    'active': 'Active',
    'under_review': 'Under Review',
    
    // General
    'Proposals': 'Proposals',
    'Create New Proposal': 'Create New Proposal',
    'Submit to MCP': 'Submit to MCP',
    'MCP Recommendation': 'MCP Recommendation',
    'Go to Voting': 'Go to Voting',
    'View Details': 'View Details',
    'collected': 'Collected',
    'sent_to_voting': 'Sent to Voting',
    'sent_to_discussion': 'Sent to Discussion',
    'final_decision': 'Final Decision'
  },
  ar: {
    // MCP Assistant
    'MCP Assistant': 'مساعد MCP',
    'Automated Presentation Management': 'إدارة العروض التقديمية الآلية',
    'Generate LOI': 'إنشاء خطاب النوايا',
    'Generate Terms & Conditions': 'إنشاء الشروط والأحكام',
    'MCP Generated': 'تم إنشاؤه بواسطة MCP',
    'Version': 'الإصدار',
    'Save': 'حفظ',
    'Cancel': 'إلغاء',
    'Edit': 'تحرير',
    'Last updated by': 'آخر تحديث بواسطة',
    'No presentations yet': 'لا توجد عروض تقديمية بعد',
    'Use MCP Assistant to generate Letter of Intent and Terms & Conditions for your group': 'استخدم مساعد MCP لإنشاء خطاب النوايا والشروط والأحكام لمجموعتك',
    'Letter of Intent generated successfully by MCP Assistant': 'تم إنشاء خطاب النوايا بنجاح بواسطة مساعد MCP',
    'Terms and Conditions generated successfully by MCP Assistant': 'تم إنشاء الشروط والأحكام بنجاح بواسطة مساعد MCP',
    'Failed to generate presentation': 'فشل في إنشاء العرض التقديمي',
    'Presentation updated successfully': 'تم تحديث العرض التقديمي بنجاح',
    'Failed to save presentation': 'فشل في حفظ العرض التقديمي',
    'Loading presentations...': 'جاري تحميل العروض التقديمية...',
    'Edit presentation content...': 'تحرير محتوى العرض التقديمي...',
    
    // Status translations
    'draft': 'مسودة',
    'active': 'نشط',
    'under_review': 'قيد المراجعة',
    
    // General
    'Proposals': 'مقترحات',
    'Create New Proposal': 'إنشاء مقترح جديد',
    'Submit to MCP': 'إرسال إلى MCP',
    'MCP Recommendation': 'توصية MCP',
    'Go to Voting': 'انتقل للتصويت',
    'View Details': 'عرض التفاصيل',
    'collected': 'تم جمعه',
    'sent_to_voting': 'أرسل للتصويت',
    'sent_to_discussion': 'أرسل للنقاش',
    'final_decision': 'القرار النهائي'
  }
};

export const useTranslation = (): TranslationHook => {
  const [locale, setLocaleState] = useState<string>('en');
  
  const t = (key: string): string => {
    const currentTranslations = translations[locale as keyof typeof translations] || translations.en;
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  const isRTL = locale === 'ar';

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-language', newLocale);
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-language');
    if (savedLocale && ['en', 'ar'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  return {
    t,
    locale,
    isRTL,
    setLocale
  };
};
