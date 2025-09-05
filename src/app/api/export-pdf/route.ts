import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
// Use require to avoid missing type definitions for fontkit
const fontkit = require('fontkit');
import { Resume } from '@/types';
import * as fs from 'fs';
import * as path from 'path';

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
  profileImage?: string;
}

export class PDFExportService {
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
      console.log('Starting PDF generation with data:', {
        hasPersonalInfo: !!resumeData?.personalInfo,
        hasExperience: !!(resumeData?.experience?.length),
        hasEducation: !!(resumeData?.education?.length),
        hasSkills: !!(resumeData?.skills?.length),
        hasLanguages: !!(resumeData?.languages?.length)
      }); // Force recompilation      // Create new PDF document
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

      // Enable complex script shaping for Arabic
      (doc as any).registerFontkit(fontkit);
      const arabicFontPath = path.join(process.cwd(), 'public', 'fonts', 'Cairo-Regular.ttf');
      if (fs.existsSync(arabicFontPath)) {
        doc.registerFont('Arabic', arabicFontPath);
        if (finalOptions.language === 'ar') {
          doc.font('Arabic');
        }
      }

      // Generate PDF content
      this.generatePDFContent(doc, resumeData, finalOptions);

      // Return PDF as Uint8Array
      return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
        doc.on('end', () => {
          const result = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
          let offset = 0;
          for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
          }
          console.log('PDF generated successfully, buffer size:', result.length);
          resolve(result);
        });
        doc.on('error', reject);
        doc.end();
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Resume data structure:', JSON.stringify(resumeData, null, 2));
      throw error;
    }
  }

  private static generatePDFContent(
    doc: InstanceType<typeof PDFDocument>,
    resumeData: any,
    options: PDFExportOptions
  ): void {
    try {
      const { margins } = options;
      let currentY = margins?.top || 20;
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const contentWidth = pageWidth - (margins?.left || 20) - (margins?.right || 20);
      const leftMargin = margins?.left || 20;

      console.log('Generating PDF content with dimensions:', { pageWidth, pageHeight, contentWidth });

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

      console.log('PDF content generation completed');
    } catch (error) {
      console.error('Error in generatePDFContent:', error);
      throw error;
    }
  }

  private static addPersonalInfo(
    doc: InstanceType<typeof PDFDocument>,
    personalInfo: ExtendedPersonalInfo,
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Add profile image if available
    if ((personalInfo as any).profileImage) {
      try {
        const profileImage = (personalInfo as any).profileImage;
        
        // If it's a data URL, convert to buffer
        if (profileImage.startsWith('data:image/')) {
          const base64Data = profileImage.split(',')[1];
          const imageBuffer = Buffer.from(base64Data, 'base64');
          
          // Calculate image dimensions (keep aspect ratio, max 80 points)
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
        }
      } catch (error) {
        console.warn('Failed to add profile image to PDF:', error);
      }
    }

    // Name
    const firstName = personalInfo?.firstName || '';
    const lastName = personalInfo?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) {
      doc.fontSize(24);
      doc.fillColor(this.COLORS.text);
      doc.text(fullName, x, currentY, { width, align: 'right' });
      currentY += 12;
    }

    // Job Title
    if (personalInfo?.jobTitle) {
      doc.fontSize(16);
      doc.fillColor(this.COLORS.primary);
      doc.text(personalInfo.jobTitle, x, currentY, { width, align: 'right' });
      currentY += 8;
    }

    // Contact Information
    const contactInfo = [];
    if (personalInfo?.email) contactInfo.push(`📧 ${personalInfo.email}`);
    if (personalInfo?.phone) contactInfo.push(`📱 ${personalInfo.phone}`);
    if (personalInfo?.address) contactInfo.push(`📍 ${personalInfo.address}`);
    if (personalInfo?.website) contactInfo.push(`🌐 ${personalInfo.website}`);

    if (contactInfo.length > 0) {
      doc.fontSize(10);
      doc.fillColor(this.COLORS.secondary);

      contactInfo.forEach(info => {
        doc.text(info, x, currentY, { width, align: 'right' });
        currentY += 5;
      });
    }

    // Add separator line
    doc.strokeColor(this.COLORS.lightGray);
    doc.lineWidth(0.5);
    doc.moveTo(x, currentY + 3).lineTo(x + width, currentY + 3).stroke();

    return currentY + 8;
  }

  private static addSection(
    doc: InstanceType<typeof PDFDocument>,
    title: string,
    content: string,
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.fontSize(14);
    doc.fillColor(this.COLORS.primary);
    doc.text(title, x, currentY, { width, align: 'right' });
    currentY += 7;

    // Content
    doc.fontSize(10);
    doc.fillColor(this.COLORS.text);

    // Split content into lines that fit the width
    const lines = doc.heightOfString(content, { width });
    doc.text(content, x, currentY, { width, align: 'right' });

    const textHeight = lines;
    return currentY + textHeight + 5;
  }

  private static addExperienceSection(
    doc: InstanceType<typeof PDFDocument>,
    experiences: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.fontSize(14);
    doc.fillColor(this.COLORS.primary);
    doc.text('الخبرات المهنية', x, currentY, { width, align: 'right' });
    currentY += 10;

    experiences.forEach(exp => {
      // Job Title and Company
      const jobTitle = exp.jobTitle || exp.position || '';
      const jobInfo = `${jobTitle} - ${exp.company || ''}`;
      doc.fontSize(12);
      doc.fillColor(this.COLORS.text);
      doc.text(jobInfo, x, currentY, { width, align: 'right' });
      currentY += 6;

      // Duration and Location
      const duration = `${exp.startDate || ''} - ${exp.endDate || (exp.isCurrentJob || exp.isCurrentlyWorking) ? 'حتى الآن' : ''}`;
      if (exp.location) {
        doc.fontSize(9);
        doc.fillColor(this.COLORS.secondary);
        doc.text(`${duration} | ${exp.location}`, x, currentY, { width, align: 'right' });
      } else {
        doc.fontSize(9);
        doc.fillColor(this.COLORS.secondary);
        doc.text(duration, x, currentY, { width, align: 'right' });
      }
      currentY += 5;

      // Description
      if (exp.description) {
        doc.fontSize(9);
        doc.fillColor(this.COLORS.text);
        doc.text(exp.description, x, currentY, { width, align: 'right' });
        const textHeight = doc.heightOfString(exp.description, { width });
        currentY += textHeight + 5;
      } else {
        currentY += 3;
      }
    });

    return currentY;
  }

  private static addEducationSection(
    doc: InstanceType<typeof PDFDocument>,
    education: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.fontSize(14);
    doc.fillColor(this.COLORS.primary);
    doc.text('التعليم', x, currentY, { width, align: 'right' });
    currentY += 10;

    education.forEach(edu => {
      // Degree and Institution
      const degree = edu.degree || '';
      const field = edu.field ? ` (${edu.field})` : '';
      const eduInfo = `${degree}${field} - ${edu.institution || ''}`;
      doc.fontSize(12);
      doc.fillColor(this.COLORS.text);
      doc.text(eduInfo, x, currentY, { width, align: 'right' });
      currentY += 6;

      // Duration and Location
      const duration = `${edu.startDate || ''} - ${edu.endDate || (edu.isCurrentlyStudying || edu.current) ? 'حتى الآن' : ''}`;
      if (edu.location) {
        doc.fontSize(9);
        doc.fillColor(this.COLORS.secondary);
        doc.text(`${duration} | ${edu.location}`, x, currentY, { width, align: 'right' });
      } else {
        doc.fontSize(9);
        doc.fillColor(this.COLORS.secondary);
        doc.text(duration, x, currentY, { width, align: 'right' });
      }
      currentY += 5;

      // Grade/GPA
      if (edu.grade || edu.gpa) {
        const gradeInfo = edu.grade ? `التقدير: ${edu.grade}` : `المعدل: ${edu.gpa}`;
        doc.fontSize(9);
        doc.fillColor(this.COLORS.secondary);
        doc.text(gradeInfo, x, currentY, { width, align: 'right' });
        currentY += 5;
      }

      currentY += 3;
    });

    return currentY;
  }

  private static addSkillsSection(
    doc: InstanceType<typeof PDFDocument>,
    skills: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.fontSize(14);
    doc.fillColor(this.COLORS.primary);
    doc.text('المهارات', x, currentY, { width, align: 'right' });
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
        doc.fontSize(11);
        doc.fillColor(this.COLORS.secondary);
        doc.text(category, x, currentY, { width, align: 'right' });
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

      doc.fontSize(10);
      doc.fillColor(this.COLORS.text);
      doc.text(skillNames, x, currentY, { width, align: 'right' });
      const textHeight = doc.heightOfString(skillNames, { width });
      currentY += textHeight + 5;
    });

    return currentY;
  }

  private static addLanguagesSection(
    doc: InstanceType<typeof PDFDocument>,
    languages: any[],
    x: number,
    y: number,
    width: number
  ): number {
    let currentY = y;

    // Section Title
    doc.fontSize(14);
    doc.fillColor(this.COLORS.primary);
    doc.text('اللغات', x, currentY, { width, align: 'right' });
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
      doc.fontSize(10);
      doc.fillColor(this.COLORS.text);
      doc.text(langInfo, x, currentY, { width, align: 'right' });
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
    const validation = PDFExportService.validateResumeData(resumeData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid resume data', details: validation.errors },
        { status: 400 }
      );
    }

    // Generate PDF buffer
    const pdfUint8Array = await PDFExportService.generatePDFBuffer(resumeData, options);

    // Get filename
    const filename = options?.filename || PDFExportService.generateFilename(resumeData.personalInfo as ExtendedPersonalInfo);

    // Return PDF as response
    return new NextResponse(pdfUint8Array as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}
