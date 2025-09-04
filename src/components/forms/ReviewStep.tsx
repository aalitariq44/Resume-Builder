'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ResumeTemplate from '@/components/resume/ResumeTemplate';
import { PDFExportService } from '@/utils/pdfExport';

export default function ReviewStep() {
  const { formData } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!resumeRef.current) {
      console.error('Resume reference not found');
      return;
    }

    setIsGenerating(true);
    try {
      // Prepare the element for export
      await PDFExportService.prepareElementForExport(resumeRef.current);
      
      // Get optimal settings
      const settings = PDFExportService.getOptimalSettings(formData.data as any);
      
      // Export to PDF
      await PDFExportService.exportResumeToPDF(resumeRef.current, settings);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'resume-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">مراجعة السيرة الذاتية</h2>
        <p className="text-gray-600">راجع معلوماتك وقم بتصدير سيرتك الذاتية</p>
      </div>

      {/* Live Resume Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>�️</span>
            معاينة حية للسيرة الذاتية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden bg-white">
            <div ref={resumeRef} style={{ transform: 'scale(0.8)', transformOrigin: 'top left', width: '125%' }}>
              <ResumeTemplate resume={formData.data as any} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Personal Info Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">👤</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.personalInfo ? '✓' : '✗'}
                </div>
                <p className="text-xs text-gray-600">المعلومات الشخصية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experience Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">💼</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.experience?.length || 0}
                </div>
                <p className="text-xs text-gray-600">خبرة مهنية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">🎓</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.education?.length || 0}
                </div>
                <p className="text-xs text-gray-600">مؤهل دراسي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">🛠️</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.skills?.length || 0}
                </div>
                <p className="text-xs text-gray-600">مهارة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Languages */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">🌐</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.languages?.length || 0}
                </div>
                <p className="text-xs text-gray-600">لغة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hobbies */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.hobbies?.length || 0}
                </div>
                <p className="text-xs text-gray-600">هواية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">�</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.courses?.length || 0}
                </div>
                <p className="text-xs text-gray-600">دورة تدريبية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.data.achievements?.length || 0}
                </div>
                <p className="text-xs text-gray-600">إنجاز</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📄</span>
            تصدير السيرة الذاتية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              size="lg"
              className="w-full h-16 text-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  جاري إنشاء PDF...
                </>
              ) : (
                <>
                  <span className="text-2xl mr-2">📄</span>
                  تحميل PDF عالي الجودة
                </>
              )}
            </Button>
            
            <Button
              onClick={downloadJSON}
              variant="outline"
              size="lg"
              className="w-full h-16 text-lg"
            >
              <span className="text-2xl mr-2">💾</span>
              حفظ البيانات (JSON)
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
            💡 يمكنك تحميل سيرتك الذاتية بصيغة PDF عالية الجودة أو حفظ البيانات لاستخدامها لاحقاً
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💡</span>
            نصائح مهمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• تأكد من مراجعة جميع المعلومات قبل التصدير</li>
            <li>• يمكنك العودة لأي خطوة لتعديل المعلومات</li>
            <li>• ملف PDF سيكون بجودة عالية ومناسب للطباعة</li>
            <li>• احفظ نسخة من البيانات لاستخدامها مستقبلاً</li>
            <li>• يمكنك إنشاء عدة سير ذاتية بقوالب مختلفة</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
