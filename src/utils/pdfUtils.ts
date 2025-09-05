// Client-side PDF utilities
export interface PDFExportOptions {
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  filename?: string;
  language?: 'ar' | 'en';
  template?: 'modern' | 'classic' | 'minimal' | 'creative';
}

// Extend PersonalInfo type to include missing properties
interface ExtendedPersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  summary?: string;
  location?: string;
  website?: string;
}

interface Resume {
  personalInfo?: ExtendedPersonalInfo;
  experience?: any[];
  education?: any[];
  skills?: any[];
  languages?: any[];
}

export function getOptimalSettings(resume: Resume): PDFExportOptions {
  const hasLongContent = (
    (resume.experience?.length || 0) > 3 ||
    (resume.education?.length || 0) > 3 ||
    (resume.skills?.length || 0) > 10
  );

  return {
    format: 'A4',
    orientation: 'portrait',
    filename: generateFilename(resume.personalInfo as ExtendedPersonalInfo),
    language: 'ar',
    template: hasLongContent ? 'minimal' : 'modern'
  };
}

export function generateFilename(personalInfo: ExtendedPersonalInfo): string {
  const firstName = personalInfo?.firstName || 'Resume';
  const lastName = personalInfo?.lastName || '';
  const jobTitle = personalInfo?.jobTitle || '';

  let filename = `${firstName}`;
  if (lastName) filename += `_${lastName}`;
  if (jobTitle) filename += `_${jobTitle}`;
  filename += '_Resume.pdf';

  // Clean the filename
  return filename.replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_');
}

export function showSuccessMessage(): void {
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: Cairo, sans-serif;
      z-index: 10000;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
      max-width: 350px;
    ">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">✅</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">تم تصدير PDF بنجاح!</div>
          <div style="font-size: 12px; opacity: 0.9;">تم إنشاء ملف PDF احترافي بجودة عالية</div>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}

export function showErrorMessage(message?: string): void {
  const errorText = message || 'فشل في تصدير PDF\nحدث خطأ أثناء إنشاء الملف، يرجى المحاولة مرة أخرى';
  const toast = document.createElement('div');
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: Cairo, sans-serif;
      z-index: 10000;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out;
      max-width: 400px;
      white-space: pre-line;
    ">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 20px;">❌</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">فشل في تصدير PDF</div>
          <div style="font-size: 12px; opacity: 0.9;">${errorText}</div>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    </style>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 8000); // Show longer for error messages
}

export function validateResumeData(resumeData: Resume): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!resumeData.personalInfo?.firstName) {
    errors.push('الاسم الأول مطلوب');
  }

  if (!resumeData.personalInfo?.lastName) {
    errors.push('الاسم الأخير مطلوب');
  }

  if (!resumeData.personalInfo?.email) {
    errors.push('البريد الإلكتروني مطلوب');
  }

  // Removed experience validation to allow export with incomplete data

  return {
    isValid: errors.length === 0,
    errors
  };
}
