'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Experience } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ExperienceStep() {
  const { formData, setExperience } = useResumeStore();
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // تحميل البيانات من store عند بدء المكون
  useEffect(() => {
    if (formData.data.experience && formData.data.experience.length > 0) {
      console.log('Loading experience from store:', formData.data.experience);
      setExperienceList(formData.data.experience);
    } else {
      // إنشاء خبرة افتراضية إذا لم تكن موجودة
      const defaultExperience: Experience = {
        id: Date.now().toString(),
        jobTitle: '',
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        isCurrentlyWorking: false,
        description: '',
        responsibilities: [],
        achievements: [],
        skills: []
      };
      setExperienceList([defaultExperience]);
    }
  }, [formData.data.experience]);

  // حفظ البيانات في store عند كل تغيير
  const saveToStore = (updatedList: Experience[]) => {
    console.log('Saving experience to store:', updatedList);
    setExperienceList(updatedList);
    setExperience(updatedList);
  };

  // تحديث حقل معين
  const updateField = (index: number, field: string, value: any) => {
    const updated = [...experienceList];
    updated[index] = { ...updated[index], [field]: value };
    
    if ((field === 'isCurrentJob' || field === 'isCurrentlyWorking') && value) {
      updated[index].endDate = '';
      updated[index].isCurrentJob = true;
      updated[index].isCurrentlyWorking = true;
    }
    
    saveToStore(updated);
  };

  // إضافة خبرة جديدة
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      isCurrentlyWorking: false,
      description: '',
      responsibilities: [],
      achievements: [],
      skills: []
    };
    const updated = [...experienceList, newExperience];
    saveToStore(updated);
  };

  // حذف خبرة
  const removeExperience = (index: number) => {
    const updated = experienceList.filter((_, i) => i !== index);
    saveToStore(updated);
  };

  // إضافة مسؤولية
  const addResponsibility = (index: number) => {
    if (newResponsibility.trim()) {
      const updated = [...experienceList];
      updated[index].responsibilities = [...(updated[index].responsibilities || []), newResponsibility.trim()];
      saveToStore(updated);
      setNewResponsibility('');
    }
  };

  // حذف مسؤولية
  const removeResponsibility = (expIndex: number, respIndex: number) => {
    const updated = [...experienceList];
    updated[expIndex].responsibilities = (updated[expIndex].responsibilities || []).filter((_, i) => i !== respIndex);
    saveToStore(updated);
  };

  // إضافة مهارة
  const addSkill = (index: number) => {
    if (newSkill.trim()) {
      const updated = [...experienceList];
      updated[index].skills = [...(updated[index].skills || []), newSkill.trim()];
      saveToStore(updated);
      setNewSkill('');
    }
  };

  // حذف مهارة
  const removeSkill = (expIndex: number, skillIndex: number) => {
    const updated = [...experienceList];
    updated[expIndex].skills = (updated[expIndex].skills || []).filter((_, i) => i !== skillIndex);
    saveToStore(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">الخبرة العملية</h2>
        <p className="text-gray-600">أضف تفاصيل خبراتك المهنية والوظائف السابقة</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {experienceList.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">
                    {index === 0 ? 'الخبرة الأساسية' : `خبرة ${index + 1}`}
                  </CardTitle>
                  {experienceList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(index)}
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
                        المسمى الوظيفي *
                      </label>
                      <Input
                        placeholder="مثل: مطور ويب، مهندس برمجيات"
                        value={experience.jobTitle}
                        onChange={(e) => updateField(index, 'jobTitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الشركة *
                      </label>
                      <Input
                        placeholder="مثل: شركة التقنية المتقدمة"
                        value={experience.company}
                        onChange={(e) => updateField(index, 'company', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الموقع *
                      </label>
                      <Input
                        placeholder="مثل: الرياض، السعودية"
                        value={experience.location}
                        onChange={(e) => updateField(index, 'location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ البداية *
                      </label>
                      <Input
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => updateField(index, 'startDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          تاريخ النهاية
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`current-job-${experience.id}`}
                            checked={experience.isCurrentJob}
                            onChange={(e) => updateField(index, 'isCurrentJob', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`current-job-${experience.id}`}
                            className="text-sm text-gray-700"
                          >
                            أعمل حالياً
                          </label>
                        </div>
                      </div>
                      <Input
                        type="date"
                        value={experience.endDate}
                        onChange={(e) => updateField(index, 'endDate', e.target.value)}
                        disabled={experience.isCurrentJob}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الوظيفة
                    </label>
                    <Textarea
                      placeholder="اكتب وصفاً موجزاً عن دورك ومسؤولياتك في هذه الوظيفة"
                      value={experience.description}
                      onChange={(e) => updateField(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>

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
                      {experience.responsibilities?.map((responsibility, respIndex) => (
                        <div key={respIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="flex-1 text-sm">{responsibility}</span>
                          <button
                            type="button"
                            onClick={() => removeResponsibility(index, respIndex)}
                            className="text-red-500 hover:text-red-700 text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* المهارات المكتسبة */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      المهارات المكتسبة
                    </label>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="أضف مهارة مكتسبة"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addSkill(index)}
                        variant="outline"
                        size="sm"
                      >
                        إضافة
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {experience.skills?.map((skill, skillIndex) => (
                        <div key={skillIndex} className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className="text-sm py-1 px-3"
                          >
                            {skill}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => removeSkill(index, skillIndex)}
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
            onClick={addExperience}
            className="border-dashed border-2 border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600"
          >
            إضافة خبرة أخرى
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
