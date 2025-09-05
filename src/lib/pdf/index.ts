// تصدير جميع وظائف PDF والمكونات
export { registerFonts, getFontFamily, getTextDirection, getTextAlign } from './fonts';
export { createStyles, getSkillBarWidth, translateSkillLevel, translateLanguageLevel } from './styles';
export { default as PDFResume } from './PDFResume';
export {
  generatePDF,
  downloadPDF,
  previewPDF,
  printPDF,
  getPDFDataURL,
  validateResumeForPDF,
  savePDFToCache,
  getPDFFromCache,
  clearPDFCache,
  PDFInfo,
} from './utils';

// معلومات حول نظام PDF
export const PDF_SYSTEM_INFO = {
  version: '1.0.0',
  description: 'نظام طباعة PDF متكامل للسير الذاتية',
  features: [
    'دعم كامل للغة العربية مع اتجاه RTL',
    'تصميم احترافي بحجم A4',
    'خطوط Cairo المحسنة للعربية',
    'تخطيط مرن وقابل للتخصيص',
    'تصدير وطباعة ومعاينة',
    'تحسين للطباعة عالية الجودة',
    'حفظ في الذاكرة المؤقتة للأداء',
    'التحقق من صحة البيانات'
  ],
  supportedLanguages: ['العربية', 'English'],
  pageFormat: 'A4 (210 × 297 مم)',
  fonts: ['Cairo', 'Inter'],
  maxFileSize: '5 ميجابايت',
  compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge']
};

// دالة مساعدة للحصول على معلومات النظام
export const getPDFSystemInfo = () => PDF_SYSTEM_INFO;
