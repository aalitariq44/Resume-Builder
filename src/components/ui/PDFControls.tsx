'use client';

import React, { useState } from 'react';
import { Download, Eye, Printer, Share2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Resume } from '@/types';
import { 
  downloadPDF, 
  previewPDF, 
  printPDF, 
  validateResumeForPDF,
  getPDFDataURL,
  PDF_SYSTEM_INFO
} from '@/lib/pdf';

interface PDFControlsProps {
  resume: Resume;
  className?: string;
  showSystemInfo?: boolean;
}

const PDFControls: React.FC<PDFControlsProps> = ({ 
  resume, 
  className = '', 
  showSystemInfo = false 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('');
  const { toast } = useToast();

  // التحقق من صحة البيانات
  const validation = validateResumeForPDF(resume);

  // دالة مساعدة لمعالجة الأخطاء
  const handleAction = async (action: string, fn: () => Promise<void>) => {
    if (!validation.isValid) {
      toast({
        title: 'خطأ في البيانات',
        description: validation.errors.join('، '),
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setCurrentAction(action);

    try {
      await fn();
      toast({
        title: 'تم بنجاح',
        description: `تم ${action} بنجاح`,
        variant: 'success',
      });
    } catch (error) {
      console.error(`خطأ في ${action}:`, error);
      toast({
        title: 'حدث خطأ',
        description: `فشل في ${action}. حاول مرة أخرى.`,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setCurrentAction('');
    }
  };

  // دالة تحميل PDF
  const handleDownload = () => {
    handleAction('تحميل الملف', async () => {
      await downloadPDF(resume);
    });
  };

  // دالة معاينة PDF
  const handlePreview = () => {
    handleAction('فتح المعاينة', async () => {
      await previewPDF(resume);
    });
  };

  // دالة طباعة PDF
  const handlePrint = () => {
    handleAction('الطباعة', async () => {
      await printPDF(resume);
    });
  };

  // دالة مشاركة PDF
  const handleShare = () => {
    handleAction('إنشاء رابط المشاركة', async () => {
      const dataURL = await getPDFDataURL(resume);
      
      if (navigator.share) {
        // استخدام Web Share API إذا كان متاحاً
        await navigator.share({
          title: `${resume.personalInfo.firstName} ${resume.personalInfo.lastName} - سيرة ذاتية`,
          text: 'السيرة الذاتية',
          url: dataURL,
        });
      } else {
        // نسخ الرابط إلى الحافظة
        await navigator.clipboard.writeText(dataURL);
        toast({
          title: 'تم نسخ الرابط',
          description: 'تم نسخ رابط السيرة الذاتية إلى الحافظة',
        });
      }
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* بطاقة التحكم في PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تصدير السيرة الذاتية
          </CardTitle>
          <CardDescription>
            قم بتحميل أو معاينة أو طباعة سيرتك الذاتية بصيغة PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* زر التحميل */}
            <Button
              onClick={handleDownload}
              disabled={isGenerating || !validation.isValid}
              className="flex items-center gap-2"
              variant="default"
            >
              {isGenerating && currentAction === 'تحميل الملف' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              تحميل
            </Button>

            {/* زر المعاينة */}
            <Button
              onClick={handlePreview}
              disabled={isGenerating || !validation.isValid}
              className="flex items-center gap-2"
              variant="outline"
            >
              {isGenerating && currentAction === 'فتح المعاينة' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              معاينة
            </Button>

            {/* زر الطباعة */}
            <Button
              onClick={handlePrint}
              disabled={isGenerating || !validation.isValid}
              className="flex items-center gap-2"
              variant="outline"
            >
              {isGenerating && currentAction === 'الطباعة' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              طباعة
            </Button>

            {/* زر المشاركة */}
            <Button
              onClick={handleShare}
              disabled={isGenerating || !validation.isValid}
              className="flex items-center gap-2"
              variant="outline"
            >
              {isGenerating && currentAction === 'إنشاء رابط المشاركة' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              مشاركة
            </Button>
          </div>

          {/* رسائل التحقق */}
          {!validation.isValid && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <h4 className="text-sm font-medium text-destructive mb-2">
                يجب إصلاح الأخطاء التالية قبل التصدير:
              </h4>
              <ul className="text-sm text-destructive space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-destructive rounded-full" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* حالة التحميل */}
          {isGenerating && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري {currentAction}...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات النظام */}
      {showSystemInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">معلومات نظام PDF</CardTitle>
            <CardDescription>
              تفاصيل تقنية حول نظام إنشاء ملفات PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* المميزات */}
            <div>
              <h4 className="font-medium mb-2">المميزات:</h4>
              <div className="flex flex-wrap gap-2">
                {PDF_SYSTEM_INFO.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* التفاصيل التقنية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">حجم الصفحة:</span>
                <span className="mr-2">{PDF_SYSTEM_INFO.pageFormat}</span>
              </div>
              <div>
                <span className="font-medium">الخطوط:</span>
                <span className="mr-2">{PDF_SYSTEM_INFO.fonts.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium">اللغات المدعومة:</span>
                <span className="mr-2">{PDF_SYSTEM_INFO.supportedLanguages.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium">حد حجم الملف:</span>
                <span className="mr-2">{PDF_SYSTEM_INFO.maxFileSize}</span>
              </div>
            </div>

            {/* الإصدار */}
            <div className="pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                الإصدار {PDF_SYSTEM_INFO.version} - {PDF_SYSTEM_INFO.description}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFControls;
