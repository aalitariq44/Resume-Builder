'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Education } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const degreeOptions = [
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه',
  'شهادة مهنية',
  'دورة تدريبية',
];

const yearOptions = Array.from({ length: 76 }, (_, i) => (2025 - i).toString());

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
  const { formData, setEducation } = useResumeStore();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [newAchievement, setNewAchievement] = useState('');

  // تحميل البيانات من store عند بدء المكون
  useEffect(() => {
    if (formData.data.education && formData.data.education.length > 0) {
      console.log('Loading education from store:', formData.data.education);
      setEducationList(formData.data.education);
    } else {
      // إنشاء تعليم افتراضي إذا لم يكن موجود
      const defaultEducation: Education = {
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
        description: '',
        achievements: []
      };
      setEducationList([defaultEducation]);
    }
  }, [formData.data.education]);

  // حفظ البيانات في store عند كل تغيير
  const saveToStore = (updatedList: Education[]) => {
    console.log('Saving education to store:', updatedList);
    setEducationList(updatedList);
    setEducation(updatedList);
  };

  // تحديث حقل معين
  const updateField = (index: number, field: string, value: any) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    
    // تحديث التواريخ تلقائياً
    if (field === 'startYear' || field === 'startMonth') {
      const startMonth = field === 'startMonth' ? value : updated[index].startMonth;
      const startYear = field === 'startYear' ? value : updated[index].startYear;
      if (startMonth && startYear) {
        updated[index].startDate = `${startYear}-${startMonth}`;
      }
    }
    
    if (field === 'endYear' || field === 'endMonth') {
      const endMonth = field === 'endMonth' ? value : updated[index].endMonth;
      const endYear = field === 'endYear' ? value : updated[index].endYear;
      if (endMonth && endYear && !updated[index].isCurrentlyStudying) {
        updated[index].endDate = `${endYear}-${endMonth}`;
      }
    }

    if (field === 'isCurrentlyStudying' && value) {
      updated[index].endDate = '';
      updated[index].endYear = '';
      updated[index].endMonth = '';
    }
    
    saveToStore(updated);
  };

  // إضافة تعليم جديد
  const addEducation = () => {
    const newEducation: Education = {
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
      description: '',
      achievements: [],
    };
    const updated = [...educationList, newEducation];
    saveToStore(updated);
  };

  // حذف تعليم
  const removeEducation = (index: number) => {
    const updated = educationList.filter((_, i) => i !== index);
    saveToStore(updated);
  };

  // إضافة إنجاز
  const addAchievement = (index: number) => {
    if (newAchievement.trim()) {
      const updated = [...educationList];
      updated[index].achievements = [...(updated[index].achievements || []), newAchievement.trim()];
      saveToStore(updated);
      setNewAchievement('');
    }
  };

  // حذف إنجاز
  const removeAchievement = (eduIndex: number, achIndex: number) => {
    const updated = [...educationList];
    updated[eduIndex].achievements = (updated[eduIndex].achievements || []).filter((_, i) => i !== achIndex);
    saveToStore(updated);
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

      <div className="space-y-6">
        <AnimatePresence>
          {educationList.map((education, index) => (
            <motion.div
              key={education.id}
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
                  {educationList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(index)}
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
                        value={education.degree}
                        onValueChange={(value) => updateField(index, 'degree', value)}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مجال الدراسة *
                      </label>
                      <Input
                        placeholder="مثل: هندسة الحاسوب"
                        value={education.field}
                        onChange={(e) => updateField(index, 'field', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم المؤسسة التعليمية *
                      </label>
                      <Input
                        placeholder="مثل: جامعة الملك سعود"
                        value={education.institution}
                        onChange={(e) => updateField(index, 'institution', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الموقع *
                      </label>
                      <Input
                        placeholder="مثل: الرياض، السعودية"
                        value={education.location}
                        onChange={(e) => updateField(index, 'location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ البداية *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={education.startMonth}
                          onValueChange={(value) => updateField(index, 'startMonth', value)}
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
                          value={education.startYear}
                          onValueChange={(value) => updateField(index, 'startYear', value)}
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
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          تاريخ النهاية
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`studying-${education.id}`}
                            checked={education.isCurrentlyStudying}
                            onChange={(e) => updateField(index, 'isCurrentlyStudying', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`studying-${education.id}`}
                            className="text-sm text-gray-700"
                          >
                            أدرس حالياً
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={education.endMonth}
                          onValueChange={(value) => updateField(index, 'endMonth', value)}
                          disabled={education.isCurrentlyStudying}
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
                          value={education.endYear}
                          onValueChange={(value) => updateField(index, 'endYear', value)}
                          disabled={education.isCurrentlyStudying}
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المعدل التراكمي (اختياري)
                      </label>
                      <Input
                        placeholder="مثل: 3.8/4.0"
                        value={education.gpa}
                        onChange={(e) => updateField(index, 'gpa', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف
                      </label>
                      <Textarea
                        placeholder="أضف وصفاً للتعليم"
                        value={education.description}
                        onChange={(e) => updateField(index, 'description', e.target.value)}
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
                      {education.achievements?.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className="text-sm py-1 px-3"
                          >
                            {achievement}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => removeAchievement(index, achIndex)}
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
      </div>
    </motion.div>
  );
}
