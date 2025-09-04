'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { PersonalInfoStep } from '@/components/forms/PersonalInfoStep';
import EducationStepSimple from '@/components/forms/EducationStepSimple';
import ExperienceStep from '@/components/forms/ExperienceStep';
import SkillsStepSimple from '@/components/forms/SkillsStepSimple';
import ReviewStep from '@/components/forms/ReviewStep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    component: () => <div className="p-8 text-center">قريباً - قسم اللغات</div>,
    icon: '🌐'
  },
  {
    id: 'hobbies',
    title: 'الهوايات',
    description: 'أضف هواياتك واهتماماتك',
    component: () => <div className="p-8 text-center">قريباً - قسم الهوايات</div>,
    icon: '🎯'
  },
  {
    id: 'additional',
    title: 'معلومات إضافية',
    description: 'أضف الدورات والإنجازات',
    component: () => <div className="p-8 text-center">قريباً - قسم المعلومات الإضافية</div>,
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

// Resume Preview component (placeholder)
const ResumePreview: React.FC = () => {
  const { formData } = useResumeStore();
  const personalInfo = formData.data.personalInfo;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <span>معاينة السيرة الذاتية</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mock CV Preview */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center border-b pb-4">
                {personalInfo?.profileImage && (
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                    <img 
                      src={personalInfo.profileImage} 
                      alt="صورة شخصية" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900">
                  {personalInfo?.firstName || 'الاسم الأول'} {personalInfo?.lastName || 'اسم العائلة'}
                </h1>
                <p className="text-gray-600">
                  {personalInfo?.jobTitle || 'الوظيفة المطلوبة'}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h2 className="font-semibold text-gray-900">معلومات الاتصال</h2>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  {personalInfo?.email && (
                    <div>📧 {personalInfo.email}</div>
                  )}
                  {personalInfo?.phone && (
                    <div>📱 {personalInfo.phone}</div>
                  )}
                  {personalInfo?.address && (
                    <div>📍 {personalInfo.address}</div>
                  )}
                  {personalInfo?.city && (
                    <div>🏙️ {personalInfo.city}</div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {(personalInfo?.dateOfBirth || personalInfo?.nationality || personalInfo?.maritalStatus) && (
                <div className="space-y-2">
                  <h2 className="font-semibold text-gray-900">معلومات شخصية</h2>
                  <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                    {personalInfo?.dateOfBirth && (
                      <div>🎂 تاريخ الميلاد: {personalInfo.dateOfBirth}</div>
                    )}
                    {personalInfo?.nationality && (
                      <div>🏁 الجنسية: {personalInfo.nationality}</div>
                    )}
                    {personalInfo?.maritalStatus && (
                      <div>💍 الحالة الاجتماعية: {personalInfo.maritalStatus}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {personalInfo?.customFields && personalInfo.customFields.length > 0 && (
                <div className="space-y-2">
                  <h2 className="font-semibold text-gray-900">معلومات إضافية</h2>
                  <div className="space-y-1">
                    {personalInfo.customFields.map((field) => (
                      <div key={field.id} className="text-sm text-gray-600">
                        <span className="font-medium">{field.label}:</span> {field.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BuilderPage() {
  const { formData, setCurrentStep, nextStep, prevStep } = useResumeStore();
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const currentStep = formData.currentStep;
  const totalSteps = STEPS.length;
  const CurrentStepComponent = STEPS[currentStep]?.component;

  // Auto-save functionality
  useEffect(() => {
    if (formData.isDirty) {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        // Here you would save to localStorage or API
        setIsAutoSaving(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [formData.isDirty]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      prevStep();
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

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
            {isAutoSaving && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>جاري الحفظ...</span>
              </div>
            )}
            <div className="hidden md:flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>تم الحفظ</span>
            </div>
            <Button variant="outline" size="sm">
              حفظ ومتابعة لاحقاً
            </Button>
            <Button size="sm">
              تصدير PDF
            </Button>
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

                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="outline">
                        حفظ كمسودة
                      </Button>
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

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
