'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Education } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// تمت إزالة الحفظ التلقائي لتقليل عمليات الكتابة على Firebase

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

const yearOptions = Array.from({ length: 75 }, (_, i) => (1950 + i).toString());

const monthOptions = [
  { value: '01', label: 'يناير' },
  { value: '02', label: 'فبراير' },
  { value: '03', label: 'مارس' },
  { value: '04', label: 'أبريل' },
  { value: '05', label: 'مايو' },
  { value: '06', label: 'يونيو' },
  { value: '07', label: 'يوليو' },
  { value: '08', label: 'أغسطس' },
  { value: '09', label: 'سبتمبر' },
  { value: '10', label: 'أكتوبر' },
  { value: '11', label: 'نوفمبر' },
  { value: '12', label: 'ديسمبر' },
];

export default function EducationStep() {
  const { 
    formData, 
    addEducation, 
    updateEducation, 
    removeEducation,
    setEducation
  } = useResumeStore();
  const [newAchievement, setNewAchievement] = useState('');

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<EducationFormData>({
    defaultValues: {
      education: (formData.data.education && formData.data.education.length > 0) ? formData.data.education.map(edu => ({
        ...edu,
        startYear: edu.startYear || (edu.startDate ? edu.startDate.split('-')[0] : ''),
        startMonth: edu.startMonth || (edu.startDate ? edu.startDate.split('-')[1] : ''),
        endYear: edu.endYear || (edu.endDate ? edu.endDate.split('-')[0] : ''),
        endMonth: edu.endMonth || (edu.endDate ? edu.endDate.split('-')[1] : ''),
      })) : [{
        id: Date.now().toString(),
        degree: '',
        field: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        startYear: '',
        startMonth: '',
        endYear: '',
        endMonth: '',
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
  const [isResetting, setIsResetting] = useState(false);

  // تحديث الـ store عند تغيير البيانات
  useEffect(() => {
    if (isResetting) return;
    if (watchedEducation && watchedEducation.length > 0) {
      setEducation(watchedEducation);
    }
  }, [watchedEducation, setEducation, isResetting]);

  // إعادة تهيئة القيم عند تحميل السيرة من Firebase
  useEffect(() => {
    if (formData.data.education) {
      setIsResetting(true);
      reset({ education: formData.data.education as Education[] });
      setTimeout(() => setIsResetting(false), 0);
    }
  }, [formData.data.education, reset]);

  const handleAddEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      field: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      startYear: '',
      startMonth: '',
      endYear: '',
      endMonth: '',
      isCurrentlyStudying: false,
      gpa: '',
      coursework: '',
      achievements: [],
    };
    append(newEdu);
    addEducation();
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
    const updatedAchievements = currentAchievements.filter((_: string, i: number) => i !== achievementIndex);
    setValue(`education.${educationIndex}.achievements`, updatedAchievements);
  };

  const onSubmit = (data: EducationFormData) => {
    const updatedEducation = data.education.map(edu => ({
      ...edu,
      startDate: edu.startMonth && edu.startYear ? `${edu.startYear}-${edu.startMonth}` : '',
      endDate: edu.endMonth && edu.endYear ? `${edu.endYear}-${edu.endMonth}` : '',
    }));
    setEducation(updatedEducation);
    console.log('Education data submitted:', updatedEducation);
  };

  const handleCurrentlyStudyingChange = (index: number, isStudying: boolean) => {
    setValue(`education.${index}.isCurrentlyStudying`, isStudying);
    if (isStudying) {
      setValue(`education.${index}.endYear`, '');
      setValue(`education.${index}.endMonth`, '');
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
                    </div>

                    <Input
                      label="مجال الدراسة *"
                      placeholder="مثل: هندسة الحاسوب"
                      {...register(`education.${index}.field`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="اسم المؤسسة التعليمية *"
                      placeholder="مثل: جامعة الملك سعود"
                      {...register(`education.${index}.institution`)}
                    />

                    <Input
                      label="الموقع *"
                      placeholder="مثل: الرياض، السعودية"
                      {...register(`education.${index}.location`)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ البداية *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={watchedEducation[index]?.startMonth}
                          onValueChange={(value) => setValue(`education.${index}.startMonth`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="الشهر" />
                          </SelectTrigger>
                          <SelectContent>
                            {monthOptions.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={watchedEducation[index]?.startYear}
                          onValueChange={(value) => setValue(`education.${index}.startYear`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="العام" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ النهاية
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={watchedEducation[index]?.endMonth}
                          onValueChange={(value) => setValue(`education.${index}.endMonth`, value)}
                          disabled={watchedEducation[index]?.isCurrentlyStudying}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="الشهر" />
                          </SelectTrigger>
                          <SelectContent>
                            {monthOptions.map((month) => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={watchedEducation[index]?.endYear}
                          onValueChange={(value) => setValue(`education.${index}.endYear`, value)}
                          disabled={watchedEducation[index]?.isCurrentlyStudying}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="العام" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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

                    <div className="flex flex-wrap gap-3">
                      {watchedEducation[index]?.achievements?.map((achievement: string, achievementIndex: number) => (
                        <div key={achievementIndex} className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className="text-sm py-1 px-3"
                          >
                            {achievement}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index, achievementIndex)}
                            className="text-red-500 hover:text-red-700 text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
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

      </form>
    </motion.div>
  );
}
