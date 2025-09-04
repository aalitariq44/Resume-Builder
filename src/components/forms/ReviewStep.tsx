'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReviewStep() {
  const { formData } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Here we would implement PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      console.log('PDF generated successfully');
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

      {/* Personal Info Summary */}
      {formData.data.personalInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>👤</span>
              المعلومات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>الاسم:</strong> {formData.data.personalInfo.firstName} {formData.data.personalInfo.lastName}
              </div>
              <div>
                <strong>المسمى الوظيفي:</strong> {formData.data.personalInfo.jobTitle}
              </div>
              <div>
                <strong>البريد الإلكتروني:</strong> {formData.data.personalInfo.email}
              </div>
              <div>
                <strong>الهاتف:</strong> {formData.data.personalInfo.phone}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education Summary */}
      {formData.data.education && formData.data.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎓</span>
              التعليم ({formData.data.education.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.data.education.map((edu, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{edu.degree} في {edu.field || edu.institution}</div>
                  <div className="text-sm text-gray-600">{edu.institution}</div>
                  <div className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || 'الحاضر'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience Summary */}
      {formData.data.experience && formData.data.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💼</span>
              الخبرة المهنية ({formData.data.experience.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.data.experience.map((exp, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">{exp.position || exp.jobTitle} - {exp.company}</div>
                  <div className="text-sm text-gray-600">{exp.city || exp.location}</div>
                  <div className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'الحاضر'}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Summary */}
      {formData.data.skills && formData.data.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🛠️</span>
              المهارات ({formData.data.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.data.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill.name} ({skill.level})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري إنشاء PDF...
                </>
              ) : (
                <>
                  📄 تحميل PDF
                </>
              )}
            </Button>
            
            <Button
              onClick={downloadJSON}
              variant="outline"
              size="lg"
              className="w-full"
            >
              💾 حفظ البيانات (JSON)
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 text-center">
            يمكنك تحميل سيرتك الذاتية بصيغة PDF أو حفظ البيانات لاستخدامها لاحقاً
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
            <li>• احفظ نسخة من البيانات لاستخدامها مستقبلاً</li>
            <li>• يمكنك إنشاء عدة سير ذاتية بقوالب مختلفة</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
