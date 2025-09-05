'use client';

import React from 'react';
import { useResumeStore } from '@/store/resumeStore';
import PDFControlsSimple from '@/components/ui/PDFControlsSimple';

const PDFTestPage: React.FC = () => {
  const { formData } = useResumeStore();
  const resume = formData.data;

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">لا توجد بيانات سيرة ذاتية</h1>
          <p className="text-gray-600">يرجى إنشاء سيرة ذاتية أولاً لاختبار نظام PDF</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            اختبار نظام PDF
          </h1>
          <p className="text-gray-600">
            معاينة وتحميل السيرة الذاتية بصيغة PDF
          </p>
        </div>

        {/* معلومات السيرة الذاتية */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">معلومات السيرة الذاتية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">الاسم:</span>
              <span className="mr-2 text-gray-600">
                {resume.personalInfo?.firstName} {resume.personalInfo?.lastName}
              </span>
            </div>
            <div>
              <span className="font-medium">المسمى الوظيفي:</span>
              <span className="mr-2 text-gray-600">
                {resume.personalInfo?.jobTitle || 'غير محدد'}
              </span>
            </div>
            <div>
              <span className="font-medium">البريد الإلكتروني:</span>
              <span className="mr-2 text-gray-600">
                {resume.personalInfo?.email || 'غير محدد'}
              </span>
            </div>
            <div>
              <span className="font-medium">الهاتف:</span>
              <span className="mr-2 text-gray-600">
                {resume.personalInfo?.phone || 'غير محدد'}
              </span>
            </div>
            <div>
              <span className="font-medium">عدد الخبرات:</span>
              <span className="mr-2 text-gray-600">
                {resume.experience?.length || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">عدد المؤهلات:</span>
              <span className="mr-2 text-gray-600">
                {resume.education?.length || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">عدد المهارات:</span>
              <span className="mr-2 text-gray-600">
                {resume.skills?.length || 0}
              </span>
            </div>
            <div>
              <span className="font-medium">عدد اللغات:</span>
              <span className="mr-2 text-gray-600">
                {resume.languages?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* أدوات التحكم في PDF */}
        <PDFControlsSimple 
          resume={resume as any} 
          showSystemInfo={true}
        />

        {/* معاينة البيانات */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border">
          <h2 className="text-xl font-semibold mb-4">معاينة البيانات</h2>
          <div className="max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(resume, null, 2)}
            </pre>
          </div>
        </div>

        {/* ملاحظات للمطور */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📝 ملاحظات للمطور
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• تأكد من وجود خطوط Cairo في مجلد public/fonts</li>
            <li>• يتم تحميل الخطوط تلقائياً عند إنشاء PDF</li>
            <li>• النظام يدعم اتجاه RTL للعربية بشكل كامل</li>
            <li>• حجم الصفحة A4 (210 × 297 مم)</li>
            <li>• يمكن معاينة PDF في نافذة جديدة</li>
            <li>• يتم التحقق من صحة البيانات قبل التصدير</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PDFTestPage;
