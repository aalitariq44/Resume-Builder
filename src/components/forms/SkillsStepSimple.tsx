'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// تمت إزالة الحفظ التلقائي لتقليل عمليات الكتابة على Firebase

type SimpleSkill = {
  id: string;
  name: string;
  level: string;
  category: string;
  yearsOfExperience?: number;
};

type SkillsFormData = {
  skills: SimpleSkill[];
};

const skillCategories = [
  'technical',
  'communication',
  'leadership',
  'personal',
  'custom'
];

const skillLevels = [
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'good', label: 'جيد' },
  { value: 'very-good', label: 'جيد جداً' },
  { value: 'excellent', label: 'ممتاز' }
];

export default function SkillsStepSimple() {
  const { 
    formData, 
    addSkill, 
    updateSkill, 
    removeSkill,
    setSkills
  } = useResumeStore();

  const { register, control, handleSubmit, watch, setValue, reset } = useForm<SkillsFormData>({
    defaultValues: {
      skills: (formData.data.skills && formData.data.skills.length > 0)
        ? (formData.data.skills as any)
        : [{
            id: Date.now().toString(),
            name: '',
            category: 'technical',
            level: 'intermediate',
            yearsOfExperience: 1,
          }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const watchedSkills = watch('skills');

  // مزامنة بيانات المهارات مع حالة التطبيق حتى تُحفظ عند التنقل
  React.useEffect(() => {
    if (watchedSkills) {
      // تحديث المتجر بالقيم الحالية للنموذج
      setSkills(watchedSkills as any);
    }
  }, [watchedSkills, setSkills]);

  // إعادة تهيئة القيم عند تحميل السيرة من Firebase
  React.useEffect(() => {
    if (formData.data.skills) {
      reset({ skills: formData.data.skills as any });
    }
  }, [formData.data.skills, reset]);

  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      category: 'technical',
      level: 'intermediate',
      yearsOfExperience: 1,
    };
    append(newSkill);
    addSkill();
  };

  const onSubmit = (data: SkillsFormData) => {
    console.log('Skills data:', data);
    // البيانات تُحفظ تلقائياً عبر الـ store
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">المهارات والقدرات</h2>
        <p className="text-gray-600">أضف مهاراتك وحدد مستوى إتقانك لكل منها</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">
                    مهارة {index + 1}
                  </CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      حذف
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="اسم المهارة *"
                      placeholder="مثل: JavaScript, إدارة المشاريع"
                      {...register(`skills.${index}.name`)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الفئة *
                      </label>
                      <Select
                        value={watchedSkills[index]?.category}
                        onValueChange={(value) => setValue(`skills.${index}.category`, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر فئة المهارة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">تقنية</SelectItem>
                          <SelectItem value="communication">تواصل</SelectItem>
                          <SelectItem value="leadership">قيادية</SelectItem>
                          <SelectItem value="personal">شخصية</SelectItem>
                          <SelectItem value="custom">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مستوى الإتقان *
                      </label>
                      <Select
                        value={watchedSkills[index]?.level}
                        onValueChange={(value) => setValue(`skills.${index}.level`, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الإتقان" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Input
                      label="سنوات الخبرة"
                      type="number"
                      min="0"
                      max="50"
                      placeholder="عدد السنوات"
                      {...register(`skills.${index}.yearsOfExperience`, {
                        valueAsNumber: true
                      })}
                    />
                  </div>

                  {/* مؤشر مستوى المهارة */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      مؤشر المستوى
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const currentLevel = watchedSkills[index]?.level;
                        const levelNumber = 
                          currentLevel === 'beginner' ? 1 :
                          currentLevel === 'intermediate' ? 2 :
                          currentLevel === 'good' ? 3 :
                          currentLevel === 'very-good' ? 4 :
                          currentLevel === 'excellent' ? 5 : 2;
                        
                        return (
                          <div
                            key={level}
                            className={`h-3 w-8 rounded ${
                              level <= levelNumber 
                                ? 'bg-blue-500' 
                                : 'bg-gray-200'
                            } transition-colors`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSkill}
            className="border-dashed border-2 border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600"
          >
            إضافة مهارة أخرى
          </Button>
        </div>

      </form>
    </motion.div>
  );
}
