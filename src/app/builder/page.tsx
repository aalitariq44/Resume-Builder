'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useFirebaseStore } from '@/store/firebaseStore';
import { useFirebaseResumes } from '@/hooks/useFirebaseResumes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { PersonalInfoStep } from '@/components/forms/PersonalInfoStep';
import EducationStepSimple from '@/components/forms/EducationStepSimple';
import ExperienceStep from '@/components/forms/ExperienceStep';
import SkillsStepSimple from '@/components/forms/SkillsStepSimple';
import LanguagesStep from '@/components/forms/LanguagesStep';
import HobbiesStep from '@/components/forms/HobbiesStep';
import AdditionalInfoStep from '@/components/forms/AdditionalInfoStep';
import ReviewStep from '@/components/forms/ReviewStep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaveStatus } from '@/components/ui';
import { useAutoSaveOnNavigation, usePeriodicAutoSave } from '@/hooks/useAutoSave';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Steps configuration
const STEPS = [
  {
    id: 'personal-info',
    title: 'المعلومات الشخصية',
    description: 'أدخل معلوماتك الأساسية',
    component: PersonalInfoStep,
    icon: '👤'
  },
  {
    id: 'education',
    title: 'المؤهلات الدراسية',
    description: 'أضف تعليمك ومؤهلاتك',
    component: EducationStepSimple,
    icon: '🎓'
  },
  {
    id: 'experience',
    title: 'الخبرة العملية',
    description: 'أضف خبراتك المهنية',
    component: ExperienceStep,
    icon: '💼'
  },
  {
    id: 'skills',
    title: 'المهارات',
    description: 'أضف مهاراتك وقدراتك',
    component: SkillsStepSimple,
    icon: '🛠️'
  },
  {
    id: 'languages',
    title: 'اللغات',
    description: 'أضف اللغات التي تتقنها',
    component: LanguagesStep,
    icon: '🌐'
  },
  {
    id: 'hobbies',
    title: 'الهوايات',
    description: 'أضف هواياتك واهتماماتك',
    component: HobbiesStep,
    icon: '🎯'
  },
  {
    id: 'additional',
    title: 'معلومات إضافية',
    description: 'أضف الدورات والإنجازات',
    component: AdditionalInfoStep,
    icon: '⭐'
  },
  {
    id: 'preview',
    title: 'المعاينة والتصدير',
    description: 'معاينة وتحميل سيرتك الذاتية',
    component: ReviewStep,
    icon: '📄'
  }
];

// Progress component
const Progress: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  return (
    <div className={cn("w-full bg-secondary rounded-full h-2", className)}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

// Step navigation component
const StepNavigation: React.FC<{
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}> = ({ currentStep, totalSteps, onStepChange }) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>الخطوة {currentStep + 1} من {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
        </div>
        <Progress value={((currentStep + 1) / totalSteps) * 100} />
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepChange(index)}
            className={cn(
              "w-full text-right p-3 rounded-lg transition-all duration-200",
              "border border-transparent hover:border-border",
              index === currentStep 
                ? "bg-primary text-primary-foreground" 
                : index < currentStep
                ? "bg-muted text-muted-foreground"
                : "bg-background text-foreground hover:bg-muted"
            )}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-xl">{step.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{step.title}</div>
                <div className="text-xs opacity-75">{step.description}</div>
              </div>
              {index < currentStep && (
                <div className="text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Simple Resume Info Display component
const ResumeInfo: React.FC = () => {
  const { formData } = useResumeStore();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <span>📊</span>
          <span>ملخص البيانات</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Personal Info */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">المعلومات الشخصية</span>
            <span className="text-2xl">
              {formData.data.personalInfo ? '✅' : '❌'}
            </span>
          </div>

          {/* Experience */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">الخبرة العملية</span>
            <span className="text-lg font-bold text-blue-600">
              {formData.data.experience?.length || 0}
            </span>
          </div>

          {/* Education */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">المؤهلات الدراسية</span>
            <span className="text-lg font-bold text-green-600">
              {formData.data.education?.length || 0}
            </span>
          </div>

          {/* Skills */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">المهارات</span>
            <span className="text-lg font-bold text-purple-600">
              {formData.data.skills?.length || 0}
            </span>
          </div>

          {/* Languages */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">اللغات</span>
            <span className="text-lg font-bold text-orange-600">
              {formData.data.languages?.length || 0}
            </span>
          </div>

          {/* Additional sections summary */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-700 mb-3">أقسام إضافية:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>الهوايات</span>
                <span>{formData.data.hobbies?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>الدورات التدريبية</span>
                <span>{formData.data.courses?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>الإنجازات</span>
                <span>{formData.data.achievements?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">💡 نصائح</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• أكمل المعلومات الشخصية أولاً</li>
              <li>• أضف خبراتك العملية بالتفصيل</li>
              <li>• لا تنس إضافة مهاراتك</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// BuilderPage Component with Firebase integration
function BuilderPageContent() {
  const { formData, setCurrentStep, nextStep, prevStep, autoSave, restoreFromBackup } = useResumeStore();
  const { currentResumeId, setCurrentResumeId, setUserId } = useFirebaseStore();
  
  // استخدام hooks الحفظ التلقائي
  useAutoSaveOnNavigation(); // حفظ عند التنقل
  usePeriodicAutoSave(30000); // حفظ كل 30 ثانية
  
  // تتبع حالة الاتصال
  const isOnline = useOnlineStatus();
  
  // معرف المستخدم المؤقت - سيتم استبداله بنظام التوثيق الحقيقي
  const userId = 'temp-user-id';
  
  // الحصول على resumeId من URL
  const searchParams = useSearchParams();
  const resumeIdFromURL = searchParams.get('resumeId');
  
  // استخدام Firebase hooks
  const { fetchResume, currentResume } = useFirebaseResumes(userId);

  const currentStep = formData.currentStep;
  const totalSteps = STEPS.length;
  const CurrentStepComponent = STEPS[currentStep]?.component;

  // تعيين معرف المستخدم ومعرف السيرة الذاتية عند التحميل
  useEffect(() => {
    setUserId(userId);
    
    if (resumeIdFromURL) {
      setCurrentResumeId(resumeIdFromURL);
      // جلب السيرة الذاتية من Firebase
      fetchResume(resumeIdFromURL);
    }
  }, [setUserId, setCurrentResumeId, resumeIdFromURL, fetchResume, userId]);

  // تحديث store المحلي عند جلب السيرة الذاتية من Firebase
  useEffect(() => {
    if (currentResume) {
      // هنا يمكنك تحديث الـ store المحلي بالبيانات من Firebase
      console.log('تم جلب السيرة الذاتية من Firebase:', currentResume);
      // يمكنك إضافة لوجيك تحديث الـ store هنا
    }
  }, [currentResume]);

  // استعادة البيانات عند تحميل الصفحة
  useEffect(() => {
    if (!resumeIdFromURL) {
      const restored = restoreFromBackup();
      if (restored) {
        console.log('تم استعادة البيانات من النسخة الاحتياطية');
      }
    }
  }, [restoreFromBackup, resumeIdFromURL]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      // حفظ تلقائي قبل الانتقال
      autoSave();
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      // حفظ تلقائي قبل الانتقال
      autoSave();
      prevStep();
    }
  };

  const handleStepChange = (step: number) => {
    // حفظ تلقائي قبل تغيير الخطوة
    autoSave();
    setCurrentStep(step);
  };

  // حفظ تلقائي عند إغلاق النافذة أو إعادة التحميل
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      autoSave();
      const saveStatus = formData.isDirty;
      if (saveStatus) {
        e.preventDefault();
        e.returnValue = 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [autoSave, formData.isDirty]);

  // عرض رسالة إذا لم يتم العثور على السيرة الذاتية
  if (resumeIdFromURL && !currentResume) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل السيرة الذاتية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <a href="/" className="flex items-center space-x-2 space-x-reverse hover:opacity-80">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">📄</span>
              </div>
              <span className="font-bold text-xl">بناء السيرة الذاتية</span>
            </a>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <SaveStatus />
            <span className="text-sm text-gray-600">معاينة مباشرة للبيانات</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar - Steps Navigation */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>خطوات إنشاء السيرة الذاتية</CardTitle>
              </CardHeader>
              <CardContent>
                <StepNavigation
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onStepChange={handleStepChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-6">
            <Card className="h-full overflow-y-auto">
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    {CurrentStepComponent && <CurrentStepComponent />}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="border-t p-6">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                    >
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      السابق
                    </Button>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={currentStep === totalSteps - 1}
                      >
                        {currentStep === totalSteps - 1 ? 'إنهاء' : 'التالي'}
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-3 hidden lg:block">
            <ResumeInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper for useSearchParams
export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جارٍ تحميل منشئ السيرة الذاتية...</p>
        </div>
      </div>
    }>
      <BuilderPageContent />
    </Suspense>
  );
}
