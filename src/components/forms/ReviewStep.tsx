'use client';

import { motion } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PDFControlsSimple from '@/components/ui/PDFControlsSimple';

export default function ReviewStep() {
  const { formData } = useResumeStore();

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
        <p className="text-gray-600">راجع معلوماتك وقم بتصدير السيرة الذاتية بصيغة PDF</p>
      </div>

      {/* PDF Export Section */}
      <div className="mb-8">
        <PDFControlsSimple 
          resume={formData.data as any} 
          showSystemInfo={false}
        />
      </div>

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
              <span className="text-2xl">📚</span>
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

      {/* Data Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>�</span>
            بيانات السيرة الذاتية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(formData.data, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💾</span>
            حفظ البيانات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={downloadJSON}
              variant="outline"
              size="lg"
              className="w-full max-w-md h-16 text-lg"
            >
              <span className="text-2xl mr-2">💾</span>
              حفظ البيانات (JSON)
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
            💡 يمكنك حفظ البيانات واستخدامها لاحقاً أو نقلها إلى تطبيقات أخرى
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
            <li>• تأكد من مراجعة جميع المعلومات قبل الحفظ</li>
            <li>• يمكنك العودة لأي خطوة لتعديل المعلومات</li>
            <li>• احفظ نسخة من البيانات لاستخدامها مستقبلاً</li>
            <li>• يمكنك إنشاء عدة سير ذاتية بتنسيقات مختلفة</li>
            <li>• البيانات محفوظة بتنسيق JSON قياسي</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
