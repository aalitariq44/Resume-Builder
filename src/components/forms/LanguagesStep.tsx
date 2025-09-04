'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Language } from '@/types';

export default function LanguagesStep() {
  const { formData, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const languages = formData.data.languages || [];

  const languageLevelOptions = [
    { value: 'beginner', label: 'مبتدئ' },
    { value: 'intermediate', label: 'متوسط' },
    { value: 'good', label: 'جيد' },
    { value: 'very-good', label: 'جيد جداً' },
    { value: 'fluent', label: 'طليق' },
    { value: 'A1', label: 'A1 - مستوى أساسي' },
    { value: 'A2', label: 'A2 - مستوى ابتدائي' },
    { value: 'B1', label: 'B1 - مستوى متوسط' },
    { value: 'B2', label: 'B2 - مستوى متوسط-عالي' },
    { value: 'C1', label: 'C1 - مستوى متقدم' },
    { value: 'C2', label: 'C2 - مستوى متقن' }
  ];

  const skillLevelOptions = [
    { value: 'poor', label: 'ضعيف' },
    { value: 'fair', label: 'مقبول' },
    { value: 'good', label: 'جيد' },
    { value: 'excellent', label: 'ممتاز' }
  ];

  const handleAddLanguage = () => {
    addLanguage();
  };

  const handleUpdateLanguage = (id: string, field: keyof Language, value: any) => {
    updateLanguage(id, { [field]: value });
  };

  const handleUpdateSkill = (id: string, skillType: string, value: string) => {
    const language = languages.find(lang => lang.id === id);
    if (language) {
      const updatedSkills = {
        ...language.skills,
        [skillType]: value
      };
      updateLanguage(id, { skills: updatedSkills });
    }
  };

  const handleRemoveLanguage = (id: string) => {
    removeLanguage(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">اللغات</h2>
        <p className="text-gray-600">أضف اللغات التي تتقنها ومستوى إتقانك لها</p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {languages.map((language, index) => (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      لغة {index + 1}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveLanguage(language.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Language Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`language-name-${language.id}`}>اسم اللغة *</Label>
                      <Input
                        id={`language-name-${language.id}`}
                        value={language.name}
                        onChange={(e) => handleUpdateLanguage(language.id, 'name', e.target.value)}
                        placeholder="مثال: الإنجليزية، الفرنسية، الألمانية..."
                      />
                    </div>

                    {/* Language Level */}
                    <div className="space-y-2">
                      <Label htmlFor={`language-level-${language.id}`}>مستوى الإتقان *</Label>
                      <Select
                        value={language.level}
                        onValueChange={(value) => handleUpdateLanguage(language.id, 'level', value)}
                      >
                        <option value="">اختر المستوى</option>
                        {languageLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Detailed Skills (Optional) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">تفاصيل المهارات (اختياري)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Reading */}
                      <div className="space-y-1">
                        <Label className="text-xs">القراءة</Label>
                        <Select
                          value={language.skills?.reading || ''}
                          onValueChange={(value) => handleUpdateSkill(language.id, 'reading', value)}
                        >
                          <option value="">غير محدد</option>
                          {skillLevelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Writing */}
                      <div className="space-y-1">
                        <Label className="text-xs">الكتابة</Label>
                        <Select
                          value={language.skills?.writing || ''}
                          onValueChange={(value) => handleUpdateSkill(language.id, 'writing', value)}
                        >
                          <option value="">غير محدد</option>
                          {skillLevelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Speaking */}
                      <div className="space-y-1">
                        <Label className="text-xs">التحدث</Label>
                        <Select
                          value={language.skills?.speaking || ''}
                          onValueChange={(value) => handleUpdateSkill(language.id, 'speaking', value)}
                        >
                          <option value="">غير محدد</option>
                          {skillLevelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      {/* Listening */}
                      <div className="space-y-1">
                        <Label className="text-xs">الاستماع</Label>
                        <Select
                          value={language.skills?.listening || ''}
                          onValueChange={(value) => handleUpdateSkill(language.id, 'listening', value)}
                        >
                          <option value="">غير محدد</option>
                          {skillLevelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Language Button */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="flex items-center justify-center py-8">
            <Button
              onClick={handleAddLanguage}
              variant="ghost"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة لغة جديدة</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">💡 نصائح مهمة:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• أضف لغتك الأم أولاً</li>
            <li>• استخدم المستويات المعيارية (A1-C2) للغات الأجنبية</li>
            <li>• كن صادقاً في تقييم مستواك</li>
            <li>• يمكنك إضافة تفاصيل المهارات للغات المهمة فقط</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
