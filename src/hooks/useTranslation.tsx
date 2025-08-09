
import { useState, useEffect } from 'react';

interface TranslationHook {
  t: (key: string) => string;
  locale: string;
  isRTL: boolean;
  setLocale: (locale: string) => void;
}

const translations = {
  en: {
    // Navigation and Layout
    'Dashboard': 'Dashboard',
    'Groups': 'Groups',
    'Settings': 'Settings',
    'Profile': 'Profile',
    'Notifications': 'Notifications',
    'Help': 'Help',
    'Sign Out': 'Sign Out',
    'Sign In': 'Sign In',
    'Sign Up': 'Sign Up',
    'Welcome': 'Welcome',
    'Home': 'Home',

    // Group Management
    'Create Group': 'Create Group',
    'Join Group': 'Join Group',
    'Group Members': 'Group Members',
    'Group Settings': 'Group Settings',
    'Leave Group': 'Leave Group',
    'Manage Members': 'Manage Members',
    'Group Details': 'Group Details',
    'Group Activity': 'Group Activity',
    'Group Chat': 'Group Chat',
    
    // Workflow Tabs (previously in Arabic)
    'Members': 'Members',
    'Offers': 'Offers', 
    'Contracts': 'Contracts',
    'Voting': 'Voting',
    'Outbox': 'Outbox',
    'Arbitration': 'Arbitration',
    'External': 'External',
    'Decisions': 'Decisions',
    'Complaints': 'Complaints',

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
    'Delete': 'Delete',
    'Update': 'Update',
    'Create': 'Create',
    'Submit': 'Submit',
    'Close': 'Close',
    'Open': 'Open',
    'View': 'View',
    'Download': 'Download',
    'Upload': 'Upload',
    
    // Status translations
    'draft': 'Draft',
    'active': 'Active',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'completed': 'Completed',
    'under_review': 'Under Review',
    'in_progress': 'In Progress',
    
    // Proposals and Workflow
    'Proposals': 'Proposals',
    'Create New Proposal': 'Create New Proposal',
    'Submit to MCP': 'Submit to MCP',
    'MCP Recommendation': 'MCP Recommendation',
    'Go to Voting': 'Go to Voting',
    'View Details': 'View Details',
    'collected': 'Collected',
    'sent_to_voting': 'Sent to Voting',
    'sent_to_discussion': 'Sent to Discussion',
    'final_decision': 'Final Decision',

    // Messages and Communication
    'Messages': 'Messages',
    'Send Message': 'Send Message',
    'Reply': 'Reply',
    'Forward': 'Forward',
    'Message Sent': 'Message Sent',
    'No Messages': 'No Messages',
    'Inbox': 'Inbox',
    'Sent Items': 'Sent Items',
    'Compose': 'Compose',

    // Common Actions
    'Search': 'Search',
    'Filter': 'Filter',
    'Sort': 'Sort',
    'Export': 'Export',
    'Import': 'Import',
    'Refresh': 'Refresh',
    'Loading': 'Loading',
    'Error': 'Error',
    'Success': 'Success',
    'Warning': 'Warning',
    'Info': 'Information',

    // Time and Dates
    'Today': 'Today',
    'Yesterday': 'Yesterday',
    'This Week': 'This Week',
    'Last Week': 'Last Week',
    'This Month': 'This Month',
    'Last Month': 'Last Month',

    // Forms
    'Name': 'Name',
    'Email': 'Email',
    'Password': 'Password',
    'Confirm Password': 'Confirm Password',
    'Phone': 'Phone',
    'Address': 'Address',
    'Description': 'Description',
    'Title': 'Title',
    'Subject': 'Subject',
    'Content': 'Content',
    'Attachments': 'Attachments',
    
    // Validation Messages
    'Required Field': 'This field is required',
    'Invalid Email': 'Please enter a valid email address',
    'Password Too Short': 'Password must be at least 8 characters',
    'Passwords Do Not Match': 'Passwords do not match',
    
    // Success Messages
    'Account Created': 'Account created successfully',
    'Profile Updated': 'Profile updated successfully',
    'Message Sent Successfully': 'Message sent successfully',
    'Changes Saved': 'Changes saved successfully',
    
    // Error Messages
    'Something Went Wrong': 'Something went wrong',
    'Network Error': 'Network connection error',
    'Unauthorized': 'You are not authorized to perform this action',
    'Not Found': 'The requested resource was not found',

    // Placeholders
    'Enter your name': 'Enter your name',
    'Enter your email': 'Enter your email',
    'Enter description': 'Enter description',
    'Type your message': 'Type your message',
    'Search...': 'Search...',
  },
  ar: {
    // Navigation and Layout
    'Dashboard': 'لوحة التحكم',
    'Groups': 'المجموعات',
    'Settings': 'الإعدادات',
    'Profile': 'الملف الشخصي',
    'Notifications': 'الإشعارات',
    'Help': 'المساعدة',
    'Sign Out': 'تسجيل الخروج',
    'Sign In': 'تسجيل الدخول',
    'Sign Up': 'إنشاء حساب',
    'Welcome': 'مرحباً',
    'Home': 'الرئيسية',

    // Group Management
    'Create Group': 'إنشاء مجموعة',
    'Join Group': 'انضم للمجموعة',
    'Group Members': 'أعضاء المجموعة',
    'Group Settings': 'إعدادات المجموعة',
    'Leave Group': 'مغادرة المجموعة',
    'Manage Members': 'إدارة الأعضاء',
    'Group Details': 'تفاصيل المجموعة',
    'Group Activity': 'نشاط المجموعة',
    'Group Chat': 'محادثة المجموعة',
    
    // Workflow Tabs (converted from Arabic)
    'Members': 'الأعضاء',
    'Offers': 'العروض',
    'Contracts': 'العقود',
    'Voting': 'التصويت',
    'Outbox': 'الصادر',
    'Arbitration': 'التحكيم',
    'External': 'خارجي',
    'Decisions': 'القرارات',
    'Complaints': 'الشكاوى',

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
    'Delete': 'حذف',
    'Update': 'تحديث',
    'Create': 'إنشاء',
    'Submit': 'إرسال',
    'Close': 'إغلاق',
    'Open': 'فتح',
    'View': 'عرض',
    'Download': 'تحميل',
    'Upload': 'رفع',

    // Status translations
    'draft': 'مسودة',
    'active': 'نشط',
    'pending': 'في الانتظار',
    'approved': 'موافق عليه',
    'rejected': 'مرفوض',
    'completed': 'مكتمل',
    'under_review': 'قيد المراجعة',
    'in_progress': 'قيد التنفيذ',

    // Additional Arabic translations for comprehensive coverage
    'Proposals': 'المقترحات',
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
    
    // Update document direction
    if (newLocale === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = newLocale;
    }
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-language');
    if (savedLocale && ['en', 'ar', 'fr', 'zh', 'es', 'hi', 'ja', 'ko'].includes(savedLocale)) {
      setLocaleState(savedLocale);
      
      // Set initial document direction
      if (savedLocale === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = savedLocale;
      }
    }
  }, []);

  return {
    t,
    locale,
    isRTL,
    setLocale
  };
};
