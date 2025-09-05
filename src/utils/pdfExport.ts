// Dynamic imports for server-side only
let PDFDocument: any;
let blobStream: any;

if (typeof window === 'undefined') {
  // Only import on server side
  PDFDocument = require('pdfkit');
  blobStream = require('blob-stream');
}
import { Resume, PersonalInfo } from '@/types';

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
interface ExtendedPersonalInfo extends PersonalInfo {
  summary?: string;
  location?: string;
  website?: string;
}

export class PDFExportService {
  private static defaultOptions: PDFExportOptions = {
    format: 'A4',
    orientation: 'portrait',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    filename: 'resume.pdf',
    language: 'ar',
    template: 'modern'
  };

  private static readonly COLORS = {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    text: '#1f2937',
    lightGray: '#f3f4f6',
    darkGray: '#374151',
    white: '#ffffff'
  };

  private static readonly FONTS = {
    arabic: '/fonts/Cairo-Regular.ttf',
    english: 'Helvetica'
  };

  static async exportResumeToPDF(
    resumeData: Resume,
    options: PDFExportOptions = {}
  ): Promise<void> {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    try {
      // Show loading indicator
      const loadingElement = this.showLoadingIndicator();
      
      // Create new PDF document
      const doc = new PDFDocument({
        size: finalOptions.format,
        layout: finalOptions.orientation,
        margins: finalOptions.margins,
        info: {
          Title: finalOptions.filename?.replace('.pdf', '') || 'Resume',
          Author: `${resumeData.personalInfo?.firstName || ''} ${resumeData.personalInfo?.lastName || ''}`.trim(),
          Subject: 'Resume/CV',
          Creator: 'Resume Builder Professional',
          Producer: 'PDFKit',
          Keywords: 'resume, cv, professional, career'
        }
      });

      // Register Arabic font if available
      try {
        const fontResponse = await fetch('/fonts/Cairo-Regular.ttf');
        if (fontResponse.ok) {
          const fontBuffer = await fontResponse.arrayBuffer();
          doc.registerFont('Arabic', fontBuffer);
          if (finalOptions.language === 'ar') {
            doc.font('Arabic');
          }
        }
      } catch (error) {
        console.warn('Failed to load Arabic font:', error);
      }

      // Create blob stream
      const stream = doc.pipe(blobStream());

      // Generate PDF content based on template
      await this.generatePDFContent(doc, resumeData, finalOptions);

      // Finalize the PDF
      doc.end();

      // Handle the stream
      stream.on('finish', () => {
        const blob = stream.toBlob('application/pdf');
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = finalOptions.filename || 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        // Hide loading indicator and show success
        this.hideLoadingIndicator(loadingElement);
        this.showSuccessMessage();
      });

      stream.on('error', (error: any) => {
        console.error('PDF generation error:', error);
        this.hideLoadingIndicator(loadingElement);
        this.showErrorMessage();
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showErrorMessage();
      throw error;
    }
  }

  private static async generatePDFContent(
    doc: InstanceType<typeof PDFDocument>,
    resumeData: Resume,
    options: PDFExportOptions
  ): Promise<void> {
    const { margins } = options;
    let currentY = margins?.top || 50;
    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - (margins?.left || 50) - (margins?.right || 50);
    const leftMargin = margins?.left || 50;

    // Header Section - Personal Information
    if (resumeData.personalInfo) {
      currentY = await this.addPersonalInfo(doc, resumeData.personalInfo, leftMargin, currentY, contentWidth);
      currentY += 30;
    }

    // Professional Summary
    const extendedPersonalInfo = resumeData.personalInfo as ExtendedPersonalInfo;
    if (extendedPersonalInfo?.summary) {
      currentY = await this.addSection(doc, 'الملخص المهني', extendedPersonalInfo.summary, leftMargin, currentY, contentWidth);
      currentY += 25;
    }

    // Experience Section
    if (resumeData.experience && resumeData.experience.length > 0) {
      currentY = await this.addExperienceSection(doc, resumeData.experience, leftMargin, currentY, contentWidth);
      currentY += 25;
    }

    // Education Section
    if (resumeData.education && resumeData.education.length > 0) {
      currentY = await this.addEducationSection(doc, resumeData.education, leftMargin, currentY, contentWidth);
      currentY += 25;
    }

    // Skills Section
    if (resumeData.skills && resumeData.skills.length > 0) {
      currentY = await this.addSkillsSection(doc, resumeData.skills, leftMargin, currentY, contentWidth);
      currentY += 25;
    }

    // Languages Section
    if (resumeData.languages && resumeData.languages.length > 0) {
      currentY = await this.addLanguagesSection(doc, resumeData.languages, leftMargin, currentY, contentWidth);
    }
  }

  private static async addPersonalInfo(
    doc: InstanceType<typeof PDFDocument>,
    personalInfo: ExtendedPersonalInfo,
    x: number,
    y: number,
    width: number
  ): Promise<number> {
    let currentY = y;

    // Add profile image if available
    if (personalInfo.profileImage) {
      try {
        // Convert base64 to buffer if it's a data URL
        let imageBuffer: Buffer;
        if (personalInfo.profileImage.startsWith('data:image/')) {
          const base64Data = personalInfo.profileImage.split(',')[1];
          imageBuffer = Buffer.from(base64Data, 'base64');
        } else {
          // If it's a URL, fetch it
          const response = await fetch(personalInfo.profileImage);
          const arrayBuffer = await response.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
        }

        // Calculate image dimensions (keep aspect ratio, max 80x80)
        const imageSize = 80;
        const imageX = x + width - imageSize; // Position on the right

        // Add image
        doc.image(imageBuffer, imageX, currentY, {
          width: imageSize,
          height: imageSize,
          align: 'right'
        });

        // Adjust text width to leave space for image
        width = width - imageSize - 20;
      } catch (error) {
        console.warn('Failed to add profile image to PDF:', error);
      }
    }

    // Name
    const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();
    if (fullName) {
      doc.fontSize(24)
         .fillColor(this.COLORS.text)
         .text(fullName, x, currentY, { width, align: 'right' });
      currentY += 35;
    }

    // Job Title
    if (personalInfo.jobTitle) {
      doc.fontSize(16)
         .fillColor(this.COLORS.primary)
         .text(personalInfo.jobTitle, x, currentY, { width, align: 'right' });
      currentY += 25;
    }

    // Contact Information
    const contactInfo = [];
    if (personalInfo.email) contactInfo.push(`📧 ${personalInfo.email}`);
    if (personalInfo.phone) contactInfo.push(`📱 ${personalInfo.phone}`);
    if (personalInfo.location) contactInfo.push(`📍 ${personalInfo.location}`);
    if (personalInfo.website) contactInfo.push(`🌐 ${personalInfo.website}`);

    if (contactInfo.length > 0) {
      doc.fontSize(10)
         .fillColor(this.COLORS.secondary);
      
      contactInfo.forEach(info => {
        doc.text(info, x, currentY, { width, align: 'right' });
        currentY += 15;
      });
    }

    // Add separator line
    doc.strokeColor(this.COLORS.lightGray)
       .lineWidth(1)
       .moveTo(x, currentY + 10)
       .lineTo(x + width, currentY + 10)
       .stroke();

    return currentY + 20;
  }

  private static async addSection(
    doc: InstanceType<typeof PDFDocument>,
    title: string,
    content: string,
    x: number,
    y: number,
    width: number
  ): Promise<number> {
    let currentY = y;

    // Section Title
    doc.fontSize(14)
       .fillColor(this.COLORS.primary)
       .text(title, x, currentY, { width, align: 'right' });
    currentY += 20;

    // Content
    doc.fontSize(10)
       .fillColor(this.COLORS.text)
       .text(content, x, currentY, { width, align: 'right' });
    
    const textHeight = doc.heightOfString(content, { width, align: 'right' });
    return currentY + textHeight + 10;
  }

  private static async addExperienceSection(
    doc: InstanceType<typeof PDFDocument>,
    experiences: any[],
    x: number,
    y: number,
    width: number
  ): Promise<number> {
    let currentY = y;

    // Section Title
    doc.fontSize(14)
       .fillColor(this.COLORS.primary)
       .text('الخبرات المهنية', x, currentY, { width, align: 'right' });
    currentY += 25;

    experiences.forEach(exp => {
      // Job Title and Company
      const jobInfo = `${exp.position || ''} - ${exp.company || ''}`;
      doc.fontSize(12)
         .fillColor(this.COLORS.text)
         .text(jobInfo, x, currentY, { width, align: 'right' });
      currentY += 18;

      // Duration and Location
      const duration = `${exp.startDate || ''} - ${exp.endDate || exp.current ? 'حتى الآن' : ''}`;
      if (exp.location) {
        doc.fontSize(9)
           .fillColor(this.COLORS.secondary)
           .text(`${duration} | ${exp.location}`, x, currentY, { width, align: 'right' });
      } else {
        doc.fontSize(9)
           .fillColor(this.COLORS.secondary)
           .text(duration, x, currentY, { width, align: 'right' });
      }
      currentY += 15;

      // Description
      if (exp.description) {
        doc.fontSize(9)
           .fillColor(this.COLORS.text)
           .text(exp.description, x, currentY, { width, align: 'right' });
        
        const textHeight = doc.heightOfString(exp.description, { width, align: 'right' });
        currentY += textHeight + 15;
      } else {
        currentY += 10;
      }
    });

    return currentY;
  }

  private static async addEducationSection(
    doc: InstanceType<typeof PDFDocument>,
    education: any[],
    x: number,
    y: number,
    width: number
  ): Promise<number> {
    let currentY = y;

    // Section Title
    doc.fontSize(14)
       .fillColor(this.COLORS.primary)
       .text('التعليم', x, currentY, { width, align: 'right' });
    currentY += 25;

    education.forEach(edu => {
      // Degree and Institution
      const eduInfo = `${edu.degree || ''} - ${edu.institution || ''}`;
      doc.fontSize(12)
         .fillColor(this.COLORS.text)
         .text(eduInfo, x, currentY, { width, align: 'right' });
      currentY += 18;

      // Duration and Location
      const duration = `${edu.startDate || ''} - ${edu.endDate || edu.current ? 'حتى الآن' : ''}`;
      if (edu.location) {
        doc.fontSize(9)
           .fillColor(this.COLORS.secondary)
           .text(`${duration} | ${edu.location}`, x, currentY, { width, align: 'right' });
      } else {
        doc.fontSize(9)
           .fillColor(this.COLORS.secondary)
           .text(duration, x, currentY, { width, align: 'right' });
      }
      currentY += 15;

      // Grade/GPA
      if (edu.grade || edu.gpa) {
        const gradeInfo = edu.grade ? `التقدير: ${edu.grade}` : `المعدل: ${edu.gpa}`;
        doc.fontSize(9)
           .fillColor(this.COLORS.secondary)
           .text(gradeInfo, x, currentY, { width, align: 'right' });
        currentY += 15;
      }

      currentY += 10;
    });

    return currentY;
  }

  private static async addSkillsSection(
    doc: InstanceType<typeof PDFDocument>,
    skills: any[],
    x: number,
    y: number,
    width: number
  ): Promise<number> {
    let currentY = y;

    // Section Title
    doc.fontSize(14)
       .fillColor(this.COLORS.primary)
       .text('المهارات', x, currentY, { width, align: 'right' });
    currentY += 25;

    // Group skills by category if available
    const groupedSkills: { [key: string]: any[] } = {};
    skills.forEach(skill => {
      const category = skill.category || 'عام';
      if (!groupedSkills[category]) {
        groupedSkills[category] = [];
      }
      groupedSkills[category].push(skill);
    });

    Object.entries(groupedSkills).forEach(([category, categorySkills]) => {
      // Category title
      if (Object.keys(groupedSkills).length > 1) {
        doc.fontSize(11)
           .fillColor(this.COLORS.secondary)
           .text(category, x, currentY, { width, align: 'right' });
        currentY += 15;
      }

      // Skills in this category
      const skillNames = categorySkills.map(skill => {
        if (skill.level) {
          const levelMap: { [key: string]: string } = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم',
            'expert': 'خبير'
          };
          return `${skill.name} (${levelMap[skill.level] || skill.level})`;
        }
        return skill.name;
      }).join(' • ');

      doc.fontSize(10)
         .fillColor(this.COLORS.text)
         .text(skillNames, x, currentY, { width, align: 'right' });
      
      const textHeight = doc.heightOfString(skillNames, { width, align: 'right' });
      currentY += textHeight + 15;
    });

    return currentY;
  }

  private static async addLanguagesSection(
    doc: InstanceType<typeof PDFDocument>,
    languages: any[],
    x: number,
    y: number,
    width: number
  ): Promise<number> {
    let currentY = y;

    // Section Title
    doc.fontSize(14)
       .fillColor(this.COLORS.primary)
       .text('اللغات', x, currentY, { width, align: 'right' });
    currentY += 25;

    languages.forEach(lang => {
      const levelMap: { [key: string]: string } = {
        'native': 'لغة أم',
        'fluent': 'طلاقة',
        'intermediate': 'متوسط',
        'basic': 'أساسي'
      };
      
      const langInfo = `${lang.name} - ${levelMap[lang.level] || lang.level}`;
      doc.fontSize(10)
         .fillColor(this.COLORS.text)
         .text(langInfo, x, currentY, { width, align: 'right' });
      currentY += 15;
    });

    return currentY;
  }

  static generateFilename(personalInfo: ExtendedPersonalInfo): string {
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

  private static showLoadingIndicator(): HTMLElement {
    const loading = document.createElement('div');
    loading.id = 'pdf-loading';
    loading.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-family: Cairo, sans-serif;
      ">
        <div style="text-align: center;">
          <div style="
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <div style="font-size: 18px;">جاري إنشاء ملف PDF احترافي...</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">
            يرجى الانتظار، يتم تحويل السيرة الذاتية إلى PDF عالي الجودة
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(loading);
    return loading;
  }

  private static hideLoadingIndicator(loadingElement: HTMLElement): void {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }

  private static showSuccessMessage(): void {
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

  private static showErrorMessage(): void {
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
        max-width: 350px;
      ">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="font-size: 20px;">❌</div>
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">فشل في تصدير PDF</div>
            <div style="font-size: 12px; opacity: 0.9;">حدث خطأ أثناء إنشاء الملف، يرجى المحاولة مرة أخرى</div>
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
    }, 6000);
  }

  // Method to get optimal export settings based on content
  static getOptimalSettings(resume: Resume): PDFExportOptions {
    const hasLongContent = (
      (resume.experience?.length || 0) > 3 ||
      (resume.education?.length || 0) > 3 ||
      (resume.skills?.length || 0) > 10
    );

    return {
      format: 'A4',
      orientation: 'portrait',
      filename: this.generateFilename(resume.personalInfo as ExtendedPersonalInfo),
      language: 'ar',
      template: hasLongContent ? 'minimal' : 'modern'
    };
  }

  // Alternative method for simple PDF export without templates
  static async exportSimplePDF(
    resumeData: Resume,
    options: PDFExportOptions = {}
  ): Promise<void> {
    const finalOptions: PDFExportOptions = { 
      ...this.defaultOptions, 
      ...options,
      template: 'minimal' as const
    };
    
    return this.exportResumeToPDF(resumeData, finalOptions);
  }

  // Method to validate resume data before export
  static validateResumeData(resumeData: Resume): { isValid: boolean; errors: string[] } {
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
}
