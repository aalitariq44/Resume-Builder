import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Resume } from '@/types';
import PDFResume from './PDFResume';

// دالة لتوليد PDF من البيانات
export const generatePDF = async (resume: Resume): Promise<Blob> => {
  // التحقق من صحة البيانات الأساسية
  if (!resume || !resume.id || !resume.personalInfo) {
    throw new Error('البيانات غير صالحة لإنشاء PDF');
  }
  
  // التأكد من وجود القيم الافتراضية للمصفوفات
  const safeResume: Resume = {
    ...resume,
    experience: resume.experience || [],
    education: resume.education || [],
    skills: resume.skills || [],
    languages: resume.languages || [],
    hobbies: resume.hobbies || [],
    courses: resume.courses || [],
    achievements: resume.achievements || [],
    references: resume.references || [],
    customSections: resume.customSections || [],
    sectionOrder: resume.sectionOrder || [],
    hiddenSections: resume.hiddenSections || [],
  };
  
  try {
    const doc = <PDFResume resume={safeResume} />;
    const blob = await pdf(doc).toBlob();
    return blob;
  } catch (error) {
    console.error('خطأ في توليد PDF:', error);
    throw new Error('فشل في إنشاء ملف PDF');
  }
};

// دالة لتحميل PDF
export const downloadPDF = async (resume: Resume, filename?: string): Promise<void> => {
  try {
    const blob = await generatePDF(resume);
    const defaultFilename = `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_CV.pdf`;
    saveAs(blob, filename || defaultFilename);
  } catch (error) {
    console.error('خطأ في تحميل PDF:', error);
    throw new Error('فشل في تحميل ملف PDF');
  }
};

// دالة لعرض PDF في نافذة جديدة
export const previewPDF = async (resume: Resume): Promise<void> => {
  try {
    const blob = await generatePDF(resume);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // تنظيف الرابط بعد فترة
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  } catch (error) {
    console.error('خطأ في معاينة PDF:', error);
    throw new Error('فشل في معاينة ملف PDF');
  }
};

// دالة للحصول على رابط PDF للمشاركة
export const getPDFDataURL = async (resume: Resume): Promise<string> => {
  try {
    const blob = await generatePDF(resume);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('خطأ في الحصول على رابط PDF:', error);
    throw new Error('فشل في إنشاء رابط PDF');
  }
};

// دالة لطباعة PDF
export const printPDF = async (resume: Resume): Promise<void> => {
  try {
    const blob = await generatePDF(resume);
    const url = URL.createObjectURL(blob);
    
    // إنشاء iframe مخفي للطباعة
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      iframe.contentWindow?.print();
      
      // إزالة iframe بعد الطباعة
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    };
  } catch (error) {
    console.error('خطأ في طباعة PDF:', error);
    throw new Error('فشل في طباعة ملف PDF');
  }
};

// دالة للتحقق من صحة البيانات قبل التصدير
export const validateResumeForPDF = (resume: Resume): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // التحقق من وجود resume
  if (!resume) {
    errors.push('البيانات غير موجودة');
    return { isValid: false, errors };
  }
  
  // التحقق من وجود personalInfo
  if (!resume.personalInfo) {
    errors.push('المعلومات الشخصية غير موجودة');
    return { isValid: false, errors };
  }
  
  // التحقق من المعلومات الأساسية
  if (!resume.personalInfo.firstName) {
    errors.push('الاسم الأول مطلوب');
  }
  
  if (!resume.personalInfo.lastName) {
    errors.push('اسم العائلة مطلوب');
  }
  
  
  if (!resume.personalInfo.phone) {
    errors.push('رقم الهاتف مطلوب');
  }
  
  // التحقق من وجود قسم واحد على الأقل
  const hasContent = [
    (resume.experience && resume.experience.length > 0),
    (resume.education && resume.education.length > 0),
    (resume.skills && resume.skills.length > 0),
    (resume.languages && resume.languages.length > 0),
    (resume.courses && resume.courses.length > 0),
    (resume.achievements && resume.achievements.length > 0),
    (resume.hobbies && resume.hobbies.length > 0),
    (resume.references && resume.references.length > 0),
    (resume.objective && resume.objective.trim()),
  ].some(Boolean);
  
  if (!hasContent) {
    errors.push('يجب إضافة محتوى في قسم واحد على الأقل');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// دالة لحفظ PDF في localStorage للمعاينة السريعة
export const savePDFToCache = async (resume: Resume): Promise<string> => {
  try {
    const dataURL = await getPDFDataURL(resume);
    const cacheKey = `pdf_cache_${resume.id}`;
    localStorage.setItem(cacheKey, dataURL);
    return cacheKey;
  } catch (error) {
    console.error('خطأ في حفظ PDF في الذاكرة المؤقتة:', error);
    throw error;
  }
};

// دالة لاسترجاع PDF من localStorage
export const getPDFFromCache = (resumeId: string): string | null => {
  try {
    const cacheKey = `pdf_cache_${resumeId}`;
    return localStorage.getItem(cacheKey);
  } catch (error) {
    console.error('خطأ في استرجاع PDF من الذاكرة المؤقتة:', error);
    return null;
  }
};

// دالة لحذف PDF من localStorage
export const clearPDFCache = (resumeId?: string): void => {
  try {
    if (resumeId) {
      const cacheKey = `pdf_cache_${resumeId}`;
      localStorage.removeItem(cacheKey);
    } else {
      // حذف جميع ملفات PDF المخزنة مؤقتاً
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('pdf_cache_')) {
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('خطأ في حذف PDF من الذاكرة المؤقتة:', error);
  }
};

// معلومات تقنية عن PDF
export const PDFInfo = {
  pageSize: 'A4',
  dimensions: {
    width: 595.28, // نقطة
    height: 841.89, // نقطة
    widthMM: 210, // مليمتر
    heightMM: 297, // مليمتر
  },
  margins: {
    default: 20, // مليمتر
    minimum: 10, // مليمتر
  },
  supportedFonts: ['Cairo', 'Inter'],
  supportedLanguages: ['ar', 'en'],
  maxFileSize: 5 * 1024 * 1024, // 5 ميجابايت
};

export default {
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
};
