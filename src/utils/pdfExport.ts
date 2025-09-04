import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Resume } from '@/types';

export interface PDFExportOptions {
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  filename?: string;
}

export class PDFExportService {
  private static defaultOptions: PDFExportOptions = {
    format: 'A4',
    orientation: 'portrait',
    quality: 1.0,
    filename: 'resume.pdf'
  };

  static async exportResumeToPDF(
    resumeElement: HTMLElement,
    options: PDFExportOptions = {}
  ): Promise<void> {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    try {
      // Show loading indicator
      const loadingElement = this.showLoadingIndicator();
      
      // Configure html2canvas options for better quality
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Calculate PDF dimensions
      const imgWidth = finalOptions.format === 'A4' ? 210 : 216; // mm
      const imgHeight = finalOptions.format === 'A4' ? 297 : 279; // mm
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate scaling to fit the page
      const ratio = Math.min(
        imgWidth / (canvasWidth * 0.264583), // Convert px to mm
        imgHeight / (canvasHeight * 0.264583)
      );
      
      const scaledWidth = (canvasWidth * 0.264583) * ratio;
      const scaledHeight = (canvasHeight * 0.264583) * ratio;

      // Create PDF
      const pdf = new jsPDF({
        orientation: finalOptions.orientation,
        unit: 'mm',
        format: finalOptions.format?.toLowerCase() as 'a4' | 'letter'
      });

      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png', finalOptions.quality);
      
      // Center the image on the page
      const x = (imgWidth - scaledWidth) / 2;
      const y = (imgHeight - scaledHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

      // Add metadata
      pdf.setProperties({
        title: finalOptions.filename?.replace('.pdf', '') || 'Resume',
        subject: 'Resume/CV',
        author: 'Resume Builder',
        creator: 'Resume Builder App'
      });

      // Save the PDF
      pdf.save(finalOptions.filename || 'resume.pdf');
      
      // Hide loading indicator
      this.hideLoadingIndicator(loadingElement);
      
      // Show success message
      this.showSuccessMessage();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.showErrorMessage();
      throw error;
    }
  }

  static async exportMultiPageResumeToPDF(
    resumeElement: HTMLElement,
    options: PDFExportOptions = {}
  ): Promise<void> {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    try {
      const loadingElement = this.showLoadingIndicator();
      
      // Create a clone of the element for manipulation
      const clonedElement = resumeElement.cloneNode(true) as HTMLElement;
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.style.width = '794px'; // A4 width in pixels at 96 DPI
      document.body.appendChild(clonedElement);

      // Create PDF
      const pdf = new jsPDF({
        orientation: finalOptions.orientation,
        unit: 'mm',
        format: finalOptions.format?.toLowerCase() as 'a4' | 'letter'
      });

      const pageHeight = finalOptions.format === 'A4' ? 297 : 279; // mm
      const pageWidth = finalOptions.format === 'A4' ? 210 : 216; // mm
      
      // Calculate how many pages we need
      const elementHeight = clonedElement.scrollHeight;
      const pixelsPerMM = 3.7795275591; // 96 DPI conversion
      const pageHeightPx = pageHeight * pixelsPerMM;
      
      let currentY = 0;
      let pageIndex = 0;

      while (currentY < elementHeight) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Capture the current section
        const canvas = await html2canvas(clonedElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          y: currentY,
          height: Math.min(pageHeightPx, elementHeight - currentY),
          width: clonedElement.scrollWidth,
          scrollX: 0,
          scrollY: currentY,
        });

        const imgData = canvas.toDataURL('image/png', finalOptions.quality);
        const imgHeight = (canvas.height * 0.264583); // Convert px to mm
        
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, Math.min(pageHeight, imgHeight));
        
        currentY += pageHeightPx;
        pageIndex++;
      }

      // Remove the cloned element
      document.body.removeChild(clonedElement);

      // Add metadata
      pdf.setProperties({
        title: finalOptions.filename?.replace('.pdf', '') || 'Resume',
        subject: 'Resume/CV',
        author: 'Resume Builder',
        creator: 'Resume Builder App'
      });

      // Save the PDF
      pdf.save(finalOptions.filename || 'resume.pdf');
      
      this.hideLoadingIndicator(loadingElement);
      this.showSuccessMessage();
      
    } catch (error) {
      console.error('Error generating multi-page PDF:', error);
      this.showErrorMessage();
      throw error;
    }
  }

  static generateFilename(personalInfo: any): string {
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
          <div style="font-size: 18px;">جاري إنشاء ملف PDF...</div>
          <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">
            يرجى الانتظار، قد يستغرق هذا بضع ثوانٍ
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
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-family: Cairo, sans-serif;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
      ">
        ✅ تم تصدير ملف PDF بنجاح!
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
    }, 3000);
  }

  private static showErrorMessage(): void {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-family: Cairo, sans-serif;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
      ">
        ❌ حدث خطأ في تصدير ملف PDF
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
    }, 5000);
  }

  // Helper method to prepare element for PDF export
  static prepareElementForExport(element: HTMLElement): void {
    // Ensure all images are loaded
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        }
      });
    });

    return Promise.all(imagePromises) as any;
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
      quality: hasLongContent ? 0.9 : 1.0,
      filename: this.generateFilename(resume.personalInfo)
    };
  }
}
