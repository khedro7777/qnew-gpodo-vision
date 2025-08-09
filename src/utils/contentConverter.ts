
/**
 * Content Converter Utility
 * Automatically detects and converts Arabic content to English
 */

// Arabic text patterns for detection
const arabicPatterns = {
  // Common Arabic UI terms that need conversion
  textMappings: {
    'الأعضاء': 'Members',
    'العروض': 'Offers', 
    'العقود': 'Contracts',
    'التصويت': 'Voting',
    'الصادر': 'Outbox',
    'التحكيم': 'Arbitration',
    'قسم التصويت': 'Voting Section',
    'إدارة التصويت على القرارات والمقترحات': 'Manage voting on decisions and proposals',
    'قسم التحكيم': 'Arbitration Section',
    'إدارة النزاعات وقضايا التحكيم': 'Manage disputes and arbitration cases',
    'لوحة التحكم': 'Dashboard',
    'المجموعات': 'Groups',
    'الإعدادات': 'Settings',
    'الملف الشخصي': 'Profile',
    'الإشعارات': 'Notifications',
    'المساعدة': 'Help',
    'تسجيل الخروج': 'Sign Out',
    'تسجيل الدخول': 'Sign In',
    'إنشاء حساب': 'Sign Up',
    'مرحباً': 'Welcome',
    'الرئيسية': 'Home',
    'إنشاء مجموعة': 'Create Group',
    'انضم للمجموعة': 'Join Group',
    'أعضاء المجموعة': 'Group Members',
    'إعدادات المجموعة': 'Group Settings',
    'مغادرة المجموعة': 'Leave Group',
    'إدارة الأعضاء': 'Manage Members',
    'تفاصيل المجموعة': 'Group Details',
    'نشاط المجموعة': 'Group Activity',
    'محادثة المجموعة': 'Group Chat'
  }
};

export class ContentConverter {
  /**
   * Detects if text contains Arabic characters
   */
  static containsArabic(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
  }

  /**
   * Converts Arabic text to English using predefined mappings
   */
  static convertArabicToEnglish(text: string): string {
    let converted = text;
    
    // Apply direct mappings first
    Object.entries(arabicPatterns.textMappings).forEach(([arabic, english]) => {
      converted = converted.replace(new RegExp(arabic, 'g'), english);
    });

    return converted;
  }

  /**
   * Converts file names from Arabic to English
   */
  static convertFileName(fileName: string): string {
    // Replace Arabic characters in file names with English equivalents
    const fileNameMappings: { [key: string]: string } = {
      'المجموعات': 'Groups',
      'الأعضاء': 'Members',
      'العقود': 'Contracts',
      'العروض': 'Offers',
      'التصويت': 'Voting',
      'التحكيم': 'Arbitration'
    };

    let converted = fileName;
    Object.entries(fileNameMappings).forEach(([arabic, english]) => {
      converted = converted.replace(arabic, english);
    });

    return converted;
  }

  /**
   * Converts variable names from Arabic to English camelCase
   */
  static convertVariableName(varName: string): string {
    // Convert Arabic variable names to English camelCase
    const variableMappings: { [key: string]: string } = {
      'اعضاء': 'members',
      'عروض': 'offers',
      'عقود': 'contracts',
      'تصويت': 'voting',
      'تحكيم': 'arbitration',
      'مجموعة': 'group',
      'مستخدم': 'user',
      'رسالة': 'message',
      'اشعار': 'notification'
    };

    let converted = varName;
    Object.entries(variableMappings).forEach(([arabic, english]) => {
      converted = converted.replace(arabic, english);
    });

    return converted;
  }

  /**
   * Scans and converts all Arabic content in DOM elements
   */
  static convertDOMContent(rootElement: HTMLElement = document.body): void {
    const walker = document.createTreeWalker(
      rootElement,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node: Node | null;

    // Collect all text nodes
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        textNodes.push(node as Text);
      }
    }

    // Convert Arabic text in each node
    textNodes.forEach(textNode => {
      const originalText = textNode.textContent || '';
      if (this.containsArabic(originalText)) {
        const convertedText = this.convertArabicToEnglish(originalText);
        textNode.textContent = convertedText;
      }
    });
  }

  /**
   * Converts CSS class names from Arabic to English
   */
  static convertClassName(className: string): string {
    const classMappings: { [key: string]: string } = {
      'arabic-content': 'content',
      'rtl-layout': 'layout',
      'arabic-text': 'text'
    };

    let converted = className;
    Object.entries(classMappings).forEach(([arabic, english]) => {
      converted = converted.replace(arabic, english);
    });

    return converted;
  }
}

// Auto-convert on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ContentConverter.convertDOMContent();
  });
}

export default ContentConverter;
