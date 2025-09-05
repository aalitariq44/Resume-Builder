// مثال على كيفية استخدام API تصدير PDF الجديد

import { getOptimalSettings, generateFilename, validateResumeData, showSuccessMessage, showErrorMessage, PDFExportOptions } from './pdfUtils';
import { Resume } from '@/types';

/**
 * مثال على بيانات سيرة ذاتية
 */
const sampleResumeData: Resume = {
  personalInfo: {
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed.mohammed@example.com',
    phone: '+966501234567',
    jobTitle: 'مطور ويب متقدم',
    // خصائص إضافية (ستحتاج لإضافتها في types/index.ts)
    location: 'الرياض، المملكة العربية السعودية',
    website: 'https://ahmed-portfolio.com',
    summary: 'مطور ويب متخصص في React و Node.js مع خبرة 5 سنوات في تطوير التطبيقات الحديثة'
  },
  experience: [
    {
      position: 'مطور ويب أول',
      company: 'شركة التقنية المتقدمة',
      location: 'الرياض',
      startDate: '2020-01',
      endDate: '2024-12',
      current: true,
      description: 'تطوير تطبيقات ويب متقدمة باستخدام React و TypeScript. قيادة فريق من 3 مطورين وتحسين أداء التطبيقات بنسبة 40%.'
    },
    {
      position: 'مطور ويب',
      company: 'استديو الإبداع الرقمي',
      location: 'جدة',
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: 'تطوير مواقع إلكترونية متجاوبة وتطبيقات موبايل هجينة. العمل مع العملاء لتحليل المتطلبات وتطوير الحلول المناسبة.'
    }
  ],
  education: [
    {
      degree: 'بكالوريوس علوم الحاسب',
      institution: 'جامعة الملك سعود',
      location: 'الرياض',
      startDate: '2014-09',
      endDate: '2018-06',
      current: false,
      gpa: '3.8',
      grade: 'ممتاز'
    }
  ],
  skills: [
    { name: 'JavaScript', level: 'expert', category: 'لغات البرمجة' },
    { name: 'TypeScript', level: 'advanced', category: 'لغات البرمجة' },
    { name: 'React', level: 'expert', category: 'مكتبات وإطارات العمل' },
    { name: 'Node.js', level: 'advanced', category: 'مكتبات وإطارات العمل' },
    { name: 'Next.js', level: 'advanced', category: 'مكتبات وإطارات العمل' },
    { name: 'MongoDB', level: 'intermediate', category: 'قواعد البيانات' },
    { name: 'PostgreSQL', level: 'intermediate', category: 'قواعد البيانات' },
    { name: 'AWS', level: 'intermediate', category: 'الحوسبة السحابية' },
    { name: 'Docker', level: 'intermediate', category: 'DevOps' },
    { name: 'Git', level: 'advanced', category: 'أدوات التطوير' }
  ],
  languages: [
    { name: 'العربية', level: 'native' },
    { name: 'الإنجليزية', level: 'fluent' },
    { name: 'الفرنسية', level: 'intermediate' }
  ]
};

/**
 * دالة لتصدير السيرة الذاتية إلى PDF باستخدام الإعدادات الافتراضية
 */
export async function exportResumeBasic(resumeData: Resume): Promise<void> {
  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Create download link from the response
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log('تم تصدير السيرة الذاتية بنجاح!');
    showSuccessMessage();
  } catch (error) {
    console.error('خطأ في تصدير السيرة الذاتية:', error);
    showErrorMessage();
  }
}

/**
 * دالة لتصدير السيرة الذاتية مع إعدادات مخصصة
 */
export async function exportResumeCustom(resumeData: Resume): Promise<void> {
  const customOptions: PDFExportOptions = {
    format: 'A4',
    orientation: 'portrait',
    language: 'ar',
    template: 'modern',
    margins: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40
    },
    filename: 'my_professional_resume.pdf'
  };

  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        options: customOptions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Create download link from the response
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = customOptions.filename || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log('تم تصدير السيرة الذاتية مع الإعدادات المخصصة!');
    showSuccessMessage();
  } catch (error) {
    console.error('خطأ في تصدير السيرة الذاتية:', error);
    showErrorMessage();
  }
}

/**
 * دالة لتصدير السيرة الذاتية مع التحقق من صحة البيانات أولاً
 */
export async function exportResumeWithValidation(resumeData: Resume): Promise<void> {
  // التحقق من صحة البيانات أولاً
  const validation = validateResumeData(resumeData);

  if (!validation.isValid) {
    console.error('أخطاء في بيانات السيرة الذاتية:', validation.errors);
    alert(`يرجى إصلاح الأخطاء التالية قبل التصدير:\n${validation.errors.join('\n')}`);
    return;
  }

  // الحصول على الإعدادات المثالية بناءً على محتوى السيرة الذاتية
  const optimalSettings = getOptimalSettings(resumeData);

  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        options: optimalSettings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Create download link from the response
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = optimalSettings.filename || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log('تم تصدير السيرة الذاتية مع الإعدادات المثالية!');
    showSuccessMessage();
  } catch (error) {
    console.error('خطأ في تصدير السيرة الذاتية:', error);
    showErrorMessage();
  }
}

/**
 * دالة لتصدير السيرة الذاتية بشكل مبسط
 */
export async function exportResumeSimple(resumeData: Resume): Promise<void> {
  const simpleOptions: PDFExportOptions = {
    template: 'minimal'
  };

  try {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        options: simpleOptions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Create download link from the response
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log('تم تصدير السيرة الذاتية بالنموذج المبسط!');
    showSuccessMessage();
  } catch (error) {
    console.error('خطأ في تصدير السيرة الذاتية المبسطة:', error);
    showErrorMessage();
  }
}

/**
 * مثال على كيفية استخدام API في مكون React
 */
export const ExampleUsageInComponent = {
  // في مكون React
  handleExportPDF: async (resumeData: Resume) => {
    // طريقة 1: التصدير الأساسي
    await exportResumeBasic(resumeData);

    // طريقة 2: التصدير مع إعدادات مخصصة
    // await exportResumeCustom(resumeData);

    // طريقة 3: التصدير مع التحقق من صحة البيانات
    // await exportResumeWithValidation(resumeData);

    // طريقة 4: التصدير المبسط
    // await exportResumeSimple(resumeData);
  },

  // إنشاء اسم ملف مخصص
  generateCustomFilename: (resumeData: Resume) => {
    return generateFilename(resumeData.personalInfo as any);
  },

  // التحقق من صحة البيانات
  validateData: (resumeData: Resume) => {
    return validateResumeData(resumeData);
  }
};

// تصدير بيانات المثال للاختبار
export { sampleResumeData };

// مثال لاستخدام المكتبة مباشرة
if (typeof window !== 'undefined') {
  // يمكن استخدام هذا في المتصفح للاختبار
  (window as any).testPDFExport = async () => {
    await exportResumeWithValidation(sampleResumeData);
  };
}
