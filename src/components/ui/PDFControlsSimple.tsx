'use client';

import React, { useState } from 'react';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // التحقق من صحة البيانات
  const validation = validateResumeForPDF(resume);

  // دالة مساعدة لمعالجة الأخطاء
  const handleAction = async (action: string, fn: () => Promise<void>) => {
    if (!validation.isValid) {
      setMessage({
        type: 'error',
        text: `خطأ في البيانات: ${validation.errors.join('، ')}`
      });
      return;
    }

    setIsGenerating(true);
    setCurrentAction(action);
    setMessage(null);

    try {
      await fn();
      setMessage({
        type: 'success',
        text: `تم ${action} بنجاح`
      });
    } catch (error) {
      console.error(`خطأ في ${action}:`, error);
      setMessage({
        type: 'error',
        text: `فشل في ${action}. حاول مرة أخرى.`
      });
    } finally {
      setIsGenerating(false);
      setCurrentAction('');
      // إخفاء الرسالة بعد 5 ثواني
      setTimeout(() => setMessage(null), 5000);
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
        });
      } else {
        // نسخ الرابط إلى الحافظة
        await navigator.clipboard.writeText(dataURL);
        setMessage({
          type: 'success',
          text: 'تم نسخ رابط السيرة الذاتية إلى الحافظة'
        });
      }
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* بطاقة التحكم في PDF */}
      <div className="bg-white rounded-lg shadow-md p-6 border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            📄 تصدير السيرة الذاتية
          </h3>
          <p className="text-gray-600 text-sm">
            قم بتحميل أو معاينة أو طباعة سيرتك الذاتية بصيغة PDF
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* زر التحميل */}
          <button
            onClick={handleDownload}
            disabled={isGenerating || !validation.isValid}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating && currentAction === 'تحميل الملف' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>📥</span>
            )}
            تحميل
          </button>

          {/* زر المعاينة */}
          <button
            onClick={handlePreview}
            disabled={isGenerating || !validation.isValid}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating && currentAction === 'فتح المعاينة' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>👁️</span>
            )}
            معاينة
          </button>

          {/* زر الطباعة */}
          <button
            onClick={handlePrint}
            disabled={isGenerating || !validation.isValid}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating && currentAction === 'الطباعة' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>🖨️</span>
            )}
            طباعة
          </button>

          {/* زر المشاركة */}
          <button
            onClick={handleShare}
            disabled={isGenerating || !validation.isValid}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating && currentAction === 'إنشاء رابط المشاركة' ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>📤</span>
            )}
            مشاركة
          </button>
        </div>

        {/* رسائل التحقق */}
        {!validation.isValid && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              يجب إصلاح الأخطاء التالية قبل التصدير:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* رسائل النظام */}
        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className={`flex items-center gap-2 text-sm ${
              message.type === 'success' ? 'text-green-800' :
              message.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              <span>
                {message.type === 'success' ? '✅' :
                 message.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              {message.text}
            </div>
          </div>
        )}

        {/* حالة التحميل */}
        {isGenerating && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <span className="animate-spin">⏳</span>
              جاري {currentAction}...
            </div>
          </div>
        )}
      </div>

      {/* معلومات النظام */}
      {showSystemInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">معلومات نظام PDF</h3>
            <p className="text-gray-600 text-sm">
              تفاصيل تقنية حول نظام إنشاء ملفات PDF
            </p>
          </div>

          <div className="space-y-4">
            {/* المميزات */}
            <div>
              <h4 className="font-medium mb-2">المميزات:</h4>
              <div className="flex flex-wrap gap-2">
                {PDF_SYSTEM_INFO.features.map((feature, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* التفاصيل التقنية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">حجم الصفحة:</span>
                <span className="mr-2 text-gray-600">{PDF_SYSTEM_INFO.pageFormat}</span>
              </div>
              <div>
                <span className="font-medium">الخطوط:</span>
                <span className="mr-2 text-gray-600">{PDF_SYSTEM_INFO.fonts.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium">اللغات المدعومة:</span>
                <span className="mr-2 text-gray-600">{PDF_SYSTEM_INFO.supportedLanguages.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium">حد حجم الملف:</span>
                <span className="mr-2 text-gray-600">{PDF_SYSTEM_INFO.maxFileSize}</span>
              </div>
            </div>

            {/* الإصدار */}
            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                الإصدار {PDF_SYSTEM_INFO.version} - {PDF_SYSTEM_INFO.description}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFControls;
