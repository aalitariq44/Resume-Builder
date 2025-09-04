'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Hobby } from '@/types';

export default function HobbiesStep() {
  const { formData, addHobby, updateHobby, removeHobby } = useResumeStore();
  const hobbies = formData.data.hobbies || [];

  const hobbyLevelOptions = [
    { value: 'hobby', label: 'هواية شخصية' },
    { value: 'professional', label: 'مستوى احترافي' }
  ];

  const handleAddHobby = () => {
    addHobby();
  };

  const handleUpdateHobby = (id: string, field: keyof Hobby, value: any) => {
    updateHobby(id, { [field]: value });
  };

  const handleRemoveHobby = (id: string) => {
    removeHobby(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">الهوايات والاهتمامات</h2>
        <p className="text-gray-600">أضف هواياتك واهتماماتك الشخصية</p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {hobbies.map((hobby, index) => (
            <motion.div
              key={hobby.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      هواية {index + 1}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveHobby(hobby.id)}
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
                    {/* Hobby Name */}
                    <div className="space-y-2">
                      <Label htmlFor={`hobby-name-${hobby.id}`}>اسم الهواية *</Label>
                      <Input
                        id={`hobby-name-${hobby.id}`}
                        value={hobby.name}
                        onChange={(e) => handleUpdateHobby(hobby.id, 'name', e.target.value)}
                        placeholder="مثال: القراءة، الرياضة، الرسم، البرمجة..."
                      />
                    </div>

                    {/* Hobby Level */}
                    <div className="space-y-2">
                      <Label htmlFor={`hobby-level-${hobby.id}`}>المستوى</Label>
                      <Select
                        value={hobby.level}
                        onValueChange={(value) => handleUpdateHobby(hobby.id, 'level', value)}
                      >
                        {hobbyLevelOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Hobby Description */}
                  <div className="space-y-2">
                    <Label htmlFor={`hobby-description-${hobby.id}`}>وصف الهواية (اختياري)</Label>
                    <Textarea
                      id={`hobby-description-${hobby.id}`}
                      value={hobby.description || ''}
                      onChange={(e) => handleUpdateHobby(hobby.id, 'description', e.target.value)}
                      placeholder="اكتب وصفاً موجزاً عن هوايتك وما تحبه فيها..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Hobby Button */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="flex items-center justify-center py-8">
            <Button
              onClick={handleAddHobby}
              variant="ghost"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة هواية جديدة</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Common Hobbies Suggestions */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm">💡 اقتراحات للهوايات الشائعة:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {[
              'القراءة', 'الكتابة', 'الرياضة', 'السباحة',
              'كرة القدم', 'الرسم', 'التصوير', 'الطبخ',
              'السفر', 'الموسيقى', 'البرمجة', 'التطوع',
              'الألعاب', 'البستنة', 'الشطرنج', 'التدوين'
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  const existingHobbies = formData.data.hobbies || [];
                  const emptyHobby = existingHobbies.find(hobby => !hobby.name || hobby.name.trim() === '');
                  if (emptyHobby) {
                    updateHobby(emptyHobby.id, { name: suggestion });
                  } else {
                    addHobby({ name: suggestion });
                  }
                }}
                className="justify-start text-xs p-2 h-auto"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">💡 نصائح مهمة:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• اختر الهوايات التي تعكس شخصيتك ومهاراتك</li>
            <li>• أضف الهوايات ذات الصلة بالوظيفة المطلوبة</li>
            <li>• تجنب الهوايات المثيرة للجدل</li>
            <li>• اكتب وصفاً موجزاً للهوايات المهمة</li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
