import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دمج classNames مع Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق التاريخ باللغة العربية أو الإنجليزية
 */
export function formatDate(date: string | Date, locale: 'ar' | 'en' = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (locale === 'ar') {
    return dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * تنسيق فترة زمنية (من - إلى)
 */
export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date | null,
  locale: 'ar' | 'en' = 'ar',
  isCurrently: boolean = false
): string {
  const start = formatDate(startDate, locale);
  
  if (isCurrently) {
    return locale === 'ar' ? `${start} - حاليًا` : `${start} - Present`;
  }
  
  if (!endDate) {
    return start;
  }
  
  const end = formatDate(endDate, locale);
  return `${start} - ${end}`;
}

/**
 * إنشاء معرف فريد
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * تنظيف وتنسيق النص
 */
export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * تحويل النص إلى slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * حساب مدة الخبرة بالسنوات
 */
export function calculateExperience(startDate: string | Date, endDate?: string | Date | null): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : new Date();
  
  const diffInMs = end.getTime() - start.getTime();
  const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
  
  return Math.round(diffInYears * 10) / 10; // تقريب لأقرب خانة عشرية
}

/**
 * تحويل مستوى المهارة إلى نسبة مئوية
 */
export function skillLevelToPercentage(level: string): number {
  const levels: Record<string, number> = {
    'beginner': 20,
    'intermediate': 40,
    'good': 60,
    'very-good': 80,
    'excellent': 100,
  };
  
  return levels[level] || 0;
}

/**
 * تحويل مستوى اللغة إلى وصف
 */
export function getLanguageLevelDescription(level: string, locale: 'ar' | 'en' = 'ar'): string {
  const descriptions: Record<string, Record<string, string>> = {
    ar: {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'good': 'جيد',
      'very-good': 'جيد جداً',
      'fluent': 'طلق',
      'A1': 'A1 - مبتدئ',
      'A2': 'A2 - ابتدائي',
      'B1': 'B1 - متوسط',
      'B2': 'B2 - متوسط عالي',
      'C1': 'C1 - متقدم',
      'C2': 'C2 - متقن',
    },
    en: {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'good': 'Good',
      'very-good': 'Very Good',
      'fluent': 'Fluent',
      'A1': 'A1 - Beginner',
      'A2': 'A2 - Elementary',
      'B1': 'B1 - Intermediate',
      'B2': 'B2 - Upper Intermediate',
      'C1': 'C1 - Advanced',
      'C2': 'C2 - Proficient',
    }
  };
  
  return descriptions[locale]?.[level] || level;
}

/**
 * تقصير النص مع إضافة نقاط
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * تحويل حجم الملف إلى تنسيق قابل للقراءة
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * تنظيف HTML tags من النص
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * تحويل النص إلى أول حرف كبير
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * تحويل camelCase إلى kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * تحويل kebab-case إلى camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * فحص ما إذا كان الكائن فارغ
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * نسخ عميقة للكائن
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * تأخير التنفيذ (debounce)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * تحديد التنفيذ (throttle)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * إنشاء لون عشوائي hex
 */
export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * تحويل HEX إلى RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * تحويل RGB إلى HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * حساب السطوع اللوني
 */
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  // استخدام معادلة السطوع المتوزن
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

/**
 * تحديد ما إذا كان اللون فاتح أم داكن
 */
export function isLightColor(hex: string): boolean {
  return getColorBrightness(hex) > 128;
}

/**
 * الحصول على لون متباين
 */
export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#ffffff';
}

/**
 * تحويل النص إلى base64
 */
export function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

/**
 * تحويل من base64 إلى نص
 */
export function decodeBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * تحديد اتجاه النص (RTL/LTR)
 */
export function getTextDirection(text: string): 'rtl' | 'ltr' {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text) ? 'rtl' : 'ltr';
}

/**
 * تحويل الرقم إلى أرقام عربية
 */
export function toArabicNumbers(num: string | number): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumbers[parseInt(digit)]);
}

/**
 * تحويل الأرقام العربية إلى إنجليزية
 */
export function toEnglishNumbers(num: string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let result = num;
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), index.toString());
  });
  return result;
}

/**
 * تحويل كلمة المرور إلى نقاط
 */
export function maskPassword(password: string): string {
  return '*'.repeat(password.length);
}

/**
 * فصل الاسم الكامل إلى أجزاء
 */
export function parseFullName(fullName: string): { firstName: string; lastName: string; middleName?: string } {
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  } else if (parts.length === 2) {
    return { firstName: parts[0], lastName: parts[1] };
  } else {
    return {
      firstName: parts[0],
      middleName: parts.slice(1, -1).join(' '),
      lastName: parts[parts.length - 1]
    };
  }
}

/**
 * تنسيق رقم الهاتف
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+966'): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 9 && !phone.startsWith('+')) {
    return `${countryCode}${cleaned}`;
  }
  
  return phone;
}

/**
 * إنشاء URL آمن للصورة
 */
export function createImageUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * تنظيف URL للصورة
 */
export function revokeImageUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * التحقق من نوع الملف
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * التحقق من حجم الملف
 */
export function isFileSizeValid(file: File, maxSizeInMB: number = 5): boolean {
  return file.size <= maxSizeInMB * 1024 * 1024;
}

/**
 * ضغط الصورة
 */
export async function compressImage(file: File, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const maxWidth = 800;
      const maxHeight = 800;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

/**
 * تحويل تاريخ إلى عمر
 */
export function calculateAge(birthDate: string | Date): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
