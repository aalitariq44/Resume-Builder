import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import { Resume } from '@/types';

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
  address?: string;
  website?: string;
}

export class PDFPreviewService {
  private static defaultOptions: PDFExportOptions = {
    format: 'A4',
    orientation: 'portrait',
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
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

  static async generatePDFBuffer(
    resumeData: any,
    options: PDFExportOptions = {}
  ): Promise<Uint8Array> {
    const finalOptions = { ...this.defaultOptions, ...options };

    try {
      console.log('Starting PDF preview generation with data:', {
        hasPersonalInfo: !!resumeData?.personalInfo,
        hasExperience: !!(resumeData?.experience?.length),
        hasEducation: !!(resumeData?.education?.length),
        hasSkills: !!(resumeData?.skills?.length),
        hasLanguages: !!(resumeData?.languages?.length)
      });

      // Create new PDF document
      const doc = new jsPDF({
        orientation: finalOptions.orientation === 'landscape' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: finalOptions.format === 'Letter' ? 'letter' : 'a4'
      });

      // Set right-to-left for Arabic
      if (finalOptions.language === 'ar') {
        doc.setR2L(true);
      }

      // Generate PDF content
      this.generatePDFContent(doc, resumeData, finalOptions);

      // Return PDF as Uint8Array
      const arrayBuffer = doc.output('arraybuffer');
      const uint8Array = new Uint8Array(arrayBuffer);
      console.log('PDF preview generated successfully, buffer size:', uint8Array.length);
      return uint8Array;

    } catch (error) {
      console.error('Error generating PDF preview:', error);
      console.error('Resume data structure:', JSON.stringify(resumeData, null, 2));
      throw error;
    }
  }

  private static generatePDFContent(
    doc: jsPDF,
    resumeData: any,
    options: PDFExportOptions
  ): void {
    try {
      const { margins } = options;
      let currentY = margins?.top || 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margins?.left || 20) - (margins?.right || 20);
      const leftMargin = margins?.left || 20;

      console.log('Generating PDF preview content with dimensions:', { pageWidth, pageHeight, contentWidth });

      // Header Section - Personal Information
      if (resumeData?.personalInfo) {
        currentY = this.addPersonalInfo(doc, resumeData.personalInfo, leftMargin, currentY, contentWidth);
        currentY += 10;
      }

      // Professional Summary
      const extendedPersonalInfo = resumeData.personalInfo as ExtendedPersonalInfo;
      if (resumeData.objective || extendedPersonalInfo?.summary) {
        const summary = resumeData.objective || extendedPersonalInfo?.summary || '';
        currentY = this.addSection(doc, 'الملخص المهني', summary, leftMargin, currentY, contentWidth);
        currentY += 8;
      }

      // Experience Section
      if (resumeData.experience && Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
        currentY = this.addExperienceSection(doc, resumeData.experience, leftMargin, currentY, contentWidth);
        currentY += 8;
      }

      // Education Section
      if (resumeData.education && Array.isArray(resumeData.education) && resumeData.education.length > 0) {
        currentY = this.addEducationSection(doc, resumeData.education, leftMargin, currentY, contentWidth);
        currentY += 8;
      }

      // Skills Section
      if (resumeData.skills && Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
        currentY = this.addSkillsSection(doc, resumeData.skills, leftMargin, currentY, contentWidth);
        currentY += 8;
      }

      // Languages Section
      if (resumeData.languages && Array.isArray(resumeData.languages) && resumeData.languages.length > 0) {
        this.addLanguagesSection(doc, resumeData.languages, leftMargin, currentY, contentWidth);
      }

      console.log('PDF preview content generation completed');
    } catch (error) {
      console.error('Error in generatePDFContent:', error);
      throw error;
    }
  }

  private static addPersonalInfo(
    doc: jsPDF,
    personalInfo: ExtendedPersonalInfo,
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Name
    const firstName = personalInfo?.firstName || '';
    const lastName = personalInfo?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) {
      doc.setFontSize(24);
      doc.setTextColor(this.COLORS.text);
      doc.text(fullName, x + width, currentY, { align: 'right' });
      currentY += 12;
    }

    // Job Title
    if (personalInfo?.jobTitle) {
      doc.setFontSize(16);
      doc.setTextColor(this.COLORS.primary);
      doc.text(personalInfo.jobTitle, x + width, currentY, { align: 'right' });
      currentY += 8;
    }

    // Contact Information
    const contactInfo = [];
    if (personalInfo?.email) contactInfo.push(`📧 ${personalInfo.email}`);
    if (personalInfo?.phone) contactInfo.push(`📱 ${personalInfo.phone}`);
    if (personalInfo?.address) contactInfo.push(`📍 ${personalInfo.address}`);
    if (personalInfo?.website) contactInfo.push(`🌐 ${personalInfo.website}`);

    if (contactInfo.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(this.COLORS.secondary);

      contactInfo.forEach(info => {
        doc.text(info, x + width, currentY, { align: 'right' });
        currentY += 5;
      });
    }

    // Add separator line
    doc.setDrawColor(this.COLORS.lightGray);
    doc.setLineWidth(0.5);
    doc.line(x, currentY + 3, x + width, currentY + 3);

    return currentY + 8;
  }

  private static addSection(
    doc: jsPDF,
    title: string,
    content: string,
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(this.COLORS.primary);
    doc.text(title, x + width, currentY, { align: 'right' });
    currentY += 7;

    // Content
    doc.setFontSize(10);
    doc.setTextColor(this.COLORS.text);

    // Split content into lines that fit the width
    const lines = doc.splitTextToSize(content, width);
    doc.text(lines, x + width, currentY, { align: 'right' });

    const textHeight = lines.length * 4; // Approximate line height
    return currentY + textHeight + 5;
  }

  private static addExperienceSection(
    doc: jsPDF,
    experiences: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(this.COLORS.primary);
    doc.text('الخبرات المهنية', x + width, currentY, { align: 'right' });
    currentY += 10;

    experiences.forEach(exp => {
      // Job Title and Company
      const jobTitle = exp.jobTitle || exp.position || '';
      const jobInfo = `${jobTitle} - ${exp.company || ''}`;
      doc.setFontSize(12);
      doc.setTextColor(this.COLORS.text);
      doc.text(jobInfo, x + width, currentY, { align: 'right' });
      currentY += 6;

      // Duration and Location
      const duration = `${exp.startDate || ''} - ${exp.endDate || (exp.isCurrentJob || exp.isCurrentlyWorking) ? 'حتى الآن' : ''}`;
      if (exp.location) {
        doc.setFontSize(9);
        doc.setTextColor(this.COLORS.secondary);
        doc.text(`${duration} | ${exp.location}`, x + width, currentY, { align: 'right' });
      } else {
        doc.setFontSize(9);
        doc.setTextColor(this.COLORS.secondary);
        doc.text(duration, x + width, currentY, { align: 'right' });
      }
      currentY += 5;

      // Description
      if (exp.description) {
        doc.setFontSize(9);
        doc.setTextColor(this.COLORS.text);
        const descLines = doc.splitTextToSize(exp.description, width);
        doc.text(descLines, x + width, currentY, { align: 'right' });
        const textHeight = descLines.length * 3.5;
        currentY += textHeight + 5;
      } else {
        currentY += 3;
      }
    });

    return currentY;
  }

  private static addEducationSection(
    doc: jsPDF,
    education: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(this.COLORS.primary);
    doc.text('التعليم', x + width, currentY, { align: 'right' });
    currentY += 10;

    education.forEach(edu => {
      // Degree and Institution
      const degree = edu.degree || '';
      const field = edu.field ? ` (${edu.field})` : '';
      const eduInfo = `${degree}${field} - ${edu.institution || ''}`;
      doc.setFontSize(12);
      doc.setTextColor(this.COLORS.text);
      doc.text(eduInfo, x + width, currentY, { align: 'right' });
      currentY += 6;

      // Duration and Location
      const duration = `${edu.startDate || ''} - ${edu.endDate || (edu.isCurrentlyStudying || edu.current) ? 'حتى الآن' : ''}`;
      if (edu.location) {
        doc.setFontSize(9);
        doc.setTextColor(this.COLORS.secondary);
        doc.text(`${duration} | ${edu.location}`, x + width, currentY, { align: 'right' });
      } else {
        doc.setFontSize(9);
        doc.setTextColor(this.COLORS.secondary);
        doc.text(duration, x + width, currentY, { align: 'right' });
      }
      currentY += 5;

      // Grade/GPA
      if (edu.grade || edu.gpa) {
        const gradeInfo = edu.grade ? `التقدير: ${edu.grade}` : `المعدل: ${edu.gpa}`;
        doc.setFontSize(9);
        doc.setTextColor(this.COLORS.secondary);
        doc.text(gradeInfo, x + width, currentY, { align: 'right' });
        currentY += 5;
      }

      currentY += 3;
    });

    return currentY;
  }

  private static addSkillsSection(
    doc: jsPDF,
    skills: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(this.COLORS.primary);
    doc.text('المهارات', x + width, currentY, { align: 'right' });
    currentY += 10;

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
        doc.setFontSize(11);
        doc.setTextColor(this.COLORS.secondary);
        doc.text(category, x + width, currentY, { align: 'right' });
        currentY += 5;
      }

      // Skills in this category
      const skillNames = categorySkills.map(skill => {
        if (skill.level) {
          const levelMap: { [key: string]: string } = {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'good': 'جيد',
            'very-good': 'جيد جداً',
            'excellent': 'ممتاز',
            'advanced': 'متقدم',
            'expert': 'خبير'
          };
          return `${skill.name} (${levelMap[skill.level] || skill.level})`;
        }
        return skill.name;
      }).join(' • ');

      doc.setFontSize(10);
      doc.setTextColor(this.COLORS.text);
      const skillLines = doc.splitTextToSize(skillNames, width);
      doc.text(skillLines, x + width, currentY, { align: 'right' });
      const textHeight = skillLines.length * 4;
      currentY += textHeight + 5;
    });

    return currentY;
  }

  private static addLanguagesSection(
    doc: jsPDF,
    languages: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(this.COLORS.primary);
    doc.text('اللغات', x + width, currentY, { align: 'right' });
    currentY += 10;

    languages.forEach(lang => {
      const levelMap: { [key: string]: string } = {
        'native': 'لغة أم',
        'fluent': 'طلاقة',
        'excellent': 'ممتاز',
        'very-good': 'جيد جداً',
        'good': 'جيد',
        'intermediate': 'متوسط',
        'beginner': 'مبتدئ',
        'A1': 'A1',
        'A2': 'A2',
        'B1': 'B1',
        'B2': 'B2',
        'C1': 'C1',
        'C2': 'C2'
      };

      const langInfo = `${lang.name} - ${levelMap[lang.level] || lang.level}`;
      doc.setFontSize(10);
      doc.setTextColor(this.COLORS.text);
      doc.text(langInfo, x + width, currentY, { align: 'right' });
      currentY += 5;
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

  // Method to get optimal export settings based on content
  static getOptimalSettings(resume: any): PDFExportOptions {
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

  // Method to validate resume data before export
  static validateResumeData(resumeData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!resumeData?.personalInfo) {
      errors.push('المعلومات الشخصية مطلوبة');
      return { isValid: false, errors };
    }

    if (!resumeData.personalInfo.firstName || resumeData.personalInfo.firstName.trim() === '') {
      errors.push('الاسم الأول مطلوب');
    }

    if (!resumeData.personalInfo.lastName || resumeData.personalInfo.lastName.trim() === '') {
      errors.push('الاسم الأخير مطلوب');
    }

    if (!resumeData.personalInfo.email || resumeData.personalInfo.email.trim() === '') {
      errors.push('البريد الإلكتروني مطلوب');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeData, options }: { resumeData: any; options?: PDFExportOptions } = body;

    // Validate the resume data
    const validation = PDFPreviewService.validateResumeData(resumeData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid resume data', details: validation.errors },
        { status: 400 }
      );
    }

    // Generate PDF buffer
    const pdfUint8Array = await PDFPreviewService.generatePDFBuffer(resumeData, options);

    // Convert to base64 for preview
    const base64PDF = Buffer.from(pdfUint8Array).toString('base64');
    const dataUri = `data:application/pdf;base64,${base64PDF}`;

    // Return PDF as data URI for preview
    return NextResponse.json({
      success: true,
      pdfDataUri: dataUri,
      filename: options?.filename || PDFPreviewService.generateFilename(resumeData.personalInfo as ExtendedPersonalInfo)
    });

  } catch (error: any) {
    console.error('Error generating PDF preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF preview', details: error.message },
      { status: 500 }
    );
  }
}
