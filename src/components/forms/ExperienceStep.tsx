'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Experience } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAutoSave } from '@/hooks/useAutoSave';

type ExperienceFormData = {
  experience: Experience[];
};

export default function ExperienceStep() {
  const { 
    formData, 
    updateResume,
    addExperience, 
    updateExperience, 
    removeExperience 
  } = useResumeStore();
  
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const { register, control, handleSubmit, watch, setValue } = useForm<ExperienceFormData>({
    defaultValues: {
      experience: (formData.data.experience && formData.data.experience.length > 0) ? formData.data.experience : [{
        id: Date.now().toString(),
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: '',
        responsibilities: [],
        achievements: [],
        skills: [],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const watchedExperience = watch('experience');

  // حفظ تلقائي للتغييرات
  useAutoSave(watchedExperience, 500);

  const addExperienceItem = () => {
    append({
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
      responsibilities: [],
      achievements: [],
      skills: [],
    });
  };

  const addResponsibility = (index: number) => {
    if (newResponsibility.trim()) {
      const currentResponsibilities = watchedExperience[index]?.responsibilities || [];
      setValue(`experience.${index}.responsibilities`, [...currentResponsibilities, newResponsibility.trim()]);
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (experienceIndex: number, responsibilityIndex: number) => {
    const currentResponsibilities = watchedExperience[experienceIndex]?.responsibilities || [];
    const updatedResponsibilities = currentResponsibilities.filter((_: string, i: number) => i !== responsibilityIndex);
    setValue(`experience.${experienceIndex}.responsibilities`, updatedResponsibilities);
  };

  const addSkillToExperience = (index: number) => {
    if (newSkill.trim()) {
      const currentSkills = watchedExperience[index]?.skills || [];
      setValue(`experience.${index}.skills`, [...currentSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkillFromExperience = (experienceIndex: number, skillIndex: number) => {
    const currentSkills = watchedExperience[experienceIndex]?.skills || [];
    const updatedSkills = currentSkills.filter((_: string, i: number) => i !== skillIndex);
    setValue(`experience.${experienceIndex}.skills`, updatedSkills);
  };

  const onSubmit = (data: ExperienceFormData) => {
    updateResume({
      experience: data.experience
    });
  };

  const handleCurrentJobChange = (index: number, isCurrent: boolean) => {
    setValue(`experience.${index}.isCurrentJob`, isCurrent);
    if (isCurrent) {
      setValue(`experience.${index}.endDate`, '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">الخبرة المهنية</h2>
        <p className="text-gray-600">أضف تفاصيل خبرتك المهنية والمناصب التي شغلتها</p>
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
                    {index === 0 ? 'الخبرة الأساسية' : `خبرة إضافية ${index}`}
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
                      label="المسمى الوظيفي *"
                      placeholder="مثل: مطور واجهات أمامية"
                      {...register(`experience.${index}.jobTitle`)}
                    />

                    <Input
                      label="اسم الشركة *"
                      placeholder="مثل: شركة التقنية المتقدمة"
                      {...register(`experience.${index}.company`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="الموقع *"
                      placeholder="مثل: الرياض، السعودية"
                      {...register(`experience.${index}.location`)}
                    />

                    <Input
                      label="تاريخ البداية *"
                      type="date"
                      {...register(`experience.${index}.startDate`)}
                    />

                    <div>
                      <Input
                        label="تاريخ النهاية"
                        type="date"
                        disabled={watchedExperience[index]?.isCurrentJob}
                        {...register(`experience.${index}.endDate`)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`isCurrentJob-${index}`}
                      checked={watchedExperience[index]?.isCurrentJob || false}
                      onChange={(e) => handleCurrentJobChange(index, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`isCurrentJob-${index}`}
                      className="text-sm text-gray-700"
                    >
                      أعمل حالياً في هذا المنصب
                    </label>
                  </div>

                  <Textarea
                    label="وصف المنصب"
                    placeholder="اكتب وصفاً مختصراً للمنصب ومسؤولياتك"
                    {...register(`experience.${index}.description`)}
                    rows={3}
                  />

                  {/* المسؤوليات */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      المسؤوليات الرئيسية
                    </label>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف مسؤولية جديدة"
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addResponsibility(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addResponsibility(index)}
                        variant="outline"
                        size="sm"
                      >
                        إضافة
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {watchedExperience[index]?.responsibilities?.map((responsibility: string, responsibilityIndex: number) => (
                        <div
                          key={responsibilityIndex}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm">{responsibility}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResponsibility(index, responsibilityIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            حذف
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* المهارات المستخدمة */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      المهارات والتقنيات المستخدمة
                    </label>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف مهارة أو تقنية"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkillToExperience(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addSkillToExperience(index)}
                        variant="outline"
                        size="sm"
                      >
                        إضافة
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {watchedExperience[index]?.skills?.map((skill: string, skillIndex: number) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="text-sm py-1 px-3 cursor-pointer hover:bg-red-100"
                          onClick={() => removeSkillFromExperience(index, skillIndex)}
                        >
                          {skill}
                          <span className="ml-2 text-red-500">×</span>
                        </Badge>
                      ))}
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
            onClick={addExperienceItem}
            className="border-dashed border-2 border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600"
          >
            إضافة خبرة أخرى
          </Button>
        </div>

      </form>
    </motion.div>
  );
}
