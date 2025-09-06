'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Skill } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const skillLevels = [
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'good', label: 'جيد' },
  { value: 'very-good', label: 'جيد جداً' },
  { value: 'excellent', label: 'ممتاز' }
];

const skillCategories = [
  { value: 'technical', label: 'مهارات تقنية' },
  { value: 'communication', label: 'مهارات التواصل' },
  { value: 'leadership', label: 'مهارات القيادة' },
  { value: 'personal', label: 'مهارات شخصية' },
  { value: 'custom', label: 'أخرى' }
];

export default function SkillsStepSimple() {
  const { formData, setSkills } = useResumeStore();
  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  // تحميل البيانات من store عند بدء المكون
  useEffect(() => {
    if (formData.data.skills && formData.data.skills.length > 0) {
      console.log('Loading skills from store:', formData.data.skills);
      setSkillsList(formData.data.skills);
    } else {
      // إنشاء مهارة افتراضية إذا لم تكن موجودة
      const defaultSkill: Skill = {
        id: Date.now().toString(),
        name: '',
        level: 'intermediate',
        category: 'technical'
      };
      setSkillsList([defaultSkill]);
    }
  }, [formData.data.skills]);

  // حفظ البيانات في store عند كل تغيير
  const saveToStore = (updatedList: Skill[]) => {
    console.log('Saving skills to store:', updatedList);
    setSkillsList(updatedList);
    setSkills(updatedList);
  };

  // تحديث حقل معين
  const updateField = (index: number, field: string, value: any) => {
    const updated = [...skillsList];
    updated[index] = { ...updated[index], [field]: value };
    saveToStore(updated);
  };

  // إضافة مهارة جديدة
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'intermediate',
      category: 'technical'
    };
    const updated = [...skillsList, newSkill];
    saveToStore(updated);
  };

  // حذف مهارة
  const removeSkill = (index: number) => {
    const updated = skillsList.filter((_, i) => i !== index);
    saveToStore(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">المهارات</h2>
        <p className="text-gray-600">أضف مهاراتك وحدد مستوى إتقانك لكل منها</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {skillsList.map((skill, index) => (
            <motion.div
              key={skill.id}
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
                  {skillsList.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      حذف
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم المهارة *
                      </label>
                      <Input
                        placeholder="مثل: JavaScript, تصميم جرافيك"
                        value={skill.name}
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مستوى الإتقان *
                      </label>
                      <Select
                        value={skill.level}
                        onValueChange={(value) => updateField(index, 'level', value)}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        فئة المهارة *
                      </label>
                      <Select
                        value={skill.category}
                        onValueChange={(value) => updateField(index, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر فئة المهارة" />
                        </SelectTrigger>
                        <SelectContent>
                          {skillCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            onClick={addSkill}
            className="border-dashed border-2 border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600"
          >
            إضافة مهارة جديدة
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
