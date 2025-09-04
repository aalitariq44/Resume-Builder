'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Education } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const educationSchema = yup.object().shape({
  education: yup.array().of(
    yup.object().shape({
      degree: yup.string().required('الدرجة العلمية مطلوبة'),
      field: yup.string().required('مجال الدراسة مطلوب'),
      institution: yup.string().required('اسم المؤسسة التعليمية مطلوب'),
      location: yup.string().required('الموقع مطلوب'),
      startDate: yup.string().required('تاريخ البداية مطلوب'),
      endDate: yup.string().when('isCurrentlyStudying', {
        is: false,
        then: (schema) => schema.required('تاريخ النهاية مطلوب'),
        otherwise: (schema) => schema.notRequired(),
      }),
      isCurrentlyStudying: yup.boolean(),
      gpa: yup.string(),
      coursework: yup.string(),
      achievements: yup.array().of(yup.string()),
    })
  ),
});

type EducationFormData = {
  education: Education[];
};

const degreeOptions = [
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه',
  'شهادة مهنية',
  'دورة تدريبية',
];

export default function EducationStep() {
  const { education, setEducation } = useResumeStore();
  const [newAchievement, setNewAchievement] = useState('');

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EducationFormData>({
    resolver: yupResolver(educationSchema),
    defaultValues: {
      education: education.length > 0 ? education : [{
        id: Date.now().toString(),
        degree: '',
        field: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentlyStudying: false,
        gpa: '',
        coursework: '',
        achievements: [],
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const watchedEducation = watch('education');

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      degree: '',
      field: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false,
      gpa: '',
      coursework: '',
      achievements: [],
    });
  };

  const addAchievement = (index: number) => {
    if (newAchievement.trim()) {
      const currentAchievements = watchedEducation[index]?.achievements || [];
      setValue(`education.${index}.achievements`, [...currentAchievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (educationIndex: number, achievementIndex: number) => {
    const currentAchievements = watchedEducation[educationIndex]?.achievements || [];
    const updatedAchievements = currentAchievements.filter((_, i) => i !== achievementIndex);
    setValue(`education.${educationIndex}.achievements`, updatedAchievements);
  };

  const onSubmit = (data: EducationFormData) => {
    setEducation(data.education);
  };

  const handleCurrentlyStudyingChange = (index: number, isStudying: boolean) => {
    setValue(`education.${index}.isCurrentlyStudying`, isStudying);
    if (isStudying) {
      setValue(`education.${index}.endDate`, '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">التعليم والشهادات</h2>
        <p className="text-gray-600">أضف تفاصيل تعليمك والشهادات التي حصلت عليها</p>
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
                    {index === 0 ? 'التعليم الأساسي' : `تعليم إضافي ${index}`}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الدرجة العلمية *
                      </label>
                      <Select
                        value={watchedEducation[index]?.degree}
                        onValueChange={(value) => setValue(`education.${index}.degree`, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الدرجة العلمية" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeOptions.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.education?.[index]?.degree && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.education[index]?.degree?.message}
                        </p>
                      )}
                    </div>

                    <Input
                      label="مجال الدراسة *"
                      placeholder="مثل: هندسة الحاسوب"
                      {...register(`education.${index}.field`)}
                      error={errors.education?.[index]?.field?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="اسم المؤسسة التعليمية *"
                      placeholder="مثل: جامعة الملك سعود"
                      {...register(`education.${index}.institution`)}
                      error={errors.education?.[index]?.institution?.message}
                    />

                    <Input
                      label="الموقع *"
                      placeholder="مثل: الرياض، السعودية"
                      {...register(`education.${index}.location`)}
                      error={errors.education?.[index]?.location?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="تاريخ البداية *"
                      type="month"
                      {...register(`education.${index}.startDate`)}
                      error={errors.education?.[index]?.startDate?.message}
                    />

                    <div>
                      <Input
                        label="تاريخ النهاية"
                        type="month"
                        disabled={watchedEducation[index]?.isCurrentlyStudying}
                        {...register(`education.${index}.endDate`)}
                        error={errors.education?.[index]?.endDate?.message}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <input
                        type="checkbox"
                        id={`isCurrentlyStudying-${index}`}
                        checked={watchedEducation[index]?.isCurrentlyStudying || false}
                        onChange={(e) => handleCurrentlyStudyingChange(index, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`isCurrentlyStudying-${index}`}
                        className="text-sm text-gray-700"
                      >
                        أدرس حالياً
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="المعدل التراكمي (اختياري)"
                      placeholder="مثل: 3.8/4.0"
                      {...register(`education.${index}.gpa`)}
                    />

                    <div>
                      <Textarea
                        label="المواد الدراسية المهمة (اختياري)"
                        placeholder="اذكر المواد المتعلقة بمجال عملك"
                        {...register(`education.${index}.coursework`)}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* الإنجازات والأنشطة */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      الإنجازات والأنشطة الأكاديمية
                    </label>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف إنجازاً أكاديمياً"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAchievement(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addAchievement(index)}
                        variant="outline"
                        size="sm"
                      >
                        إضافة
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {watchedEducation[index]?.achievements?.map((achievement, achievementIndex) => (
                        <Badge
                          key={achievementIndex}
                          variant="secondary"
                          className="text-sm py-1 px-3 cursor-pointer hover:bg-red-100"
                          onClick={() => removeAchievement(index, achievementIndex)}
                        >
                          {achievement}
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
            onClick={addEducation}
            className="border-dashed border-2 border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600"
          >
            إضافة تعليم آخر
          </Button>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" size="lg" className="px-8">
            حفظ والمتابعة
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
