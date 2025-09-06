'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course, Achievement, Reference } from '@/types';

export default function AdditionalInfoStep() {
  const { 
    formData, 
    addCourse, 
    updateCourse, 
    removeCourse,
    addAchievement,
    updateAchievement,
    removeAchievement,
    addReference,
    updateReference,
    removeReference
  } = useResumeStore();

  const courses = formData.data.courses || [];
  const achievements = formData.data.achievements || [];
  const references = formData.data.references || [];

  // إعادة التصيير عند التهيئة من Firebase
  useEffect(() => {}, [formData.data.courses, formData.data.achievements, formData.data.references]);

  // Course Handlers
  const handleAddCourse = () => {
    addCourse();
  };

  const handleUpdateCourse = (id: string, field: keyof Course, value: any) => {
    updateCourse(id, { [field]: value });
  };

  const handleRemoveCourse = (id: string) => {
    removeCourse(id);
  };

  // Achievement Handlers
  const handleAddAchievement = () => {
    addAchievement();
  };

  const handleUpdateAchievement = (id: string, field: keyof Achievement, value: any) => {
    updateAchievement(id, { [field]: value });
  };

  const handleRemoveAchievement = (id: string) => {
    removeAchievement(id);
  };

  // Reference Handlers
  const handleAddReference = () => {
    addReference();
  };

  const handleUpdateReference = (id: string, field: keyof Reference, value: any) => {
    updateReference(id, { [field]: value });
  };

  const handleRemoveReference = (id: string) => {
    removeReference(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">معلومات إضافية</h2>
        <p className="text-gray-600">أضف الدورات والإنجازات والمراجع</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">الدورات التدريبية</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات والجوائز</TabsTrigger>
          <TabsTrigger value="references">المراجع</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <AnimatePresence>
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        دورة تدريبية {index + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveCourse(course.id)}
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
                      {/* Course Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`course-name-${course.id}`}>اسم الدورة *</Label>
                        <Input
                          id={`course-name-${course.id}`}
                          value={course.name}
                          onChange={(e) => handleUpdateCourse(course.id, 'name', e.target.value)}
                          placeholder="مثال: دورة إدارة المشاريع، تطوير الويب..."
                        />
                      </div>

                      {/* Provider */}
                      <div className="space-y-2">
                        <Label htmlFor={`course-provider-${course.id}`}>مقدم الدورة *</Label>
                        <Input
                          id={`course-provider-${course.id}`}
                          value={course.provider}
                          onChange={(e) => handleUpdateCourse(course.id, 'provider', e.target.value)}
                          placeholder="مثال: جامعة، معهد، منصة إلكترونية..."
                        />
                      </div>

                      {/* Date Completed */}
                      <div className="space-y-2">
                        <Label htmlFor={`course-date-${course.id}`}>تاريخ الإنجاز *</Label>
                        <Input
                          id={`course-date-${course.id}`}
                          type="date"
                          value={course.dateCompleted}
                          onChange={(e) => handleUpdateCourse(course.id, 'dateCompleted', e.target.value)}
                        />
                      </div>

                      {/* Verification URL */}
                      <div className="space-y-2">
                        <Label htmlFor={`course-url-${course.id}`}>رابط التحقق</Label>
                        <Input
                          id={`course-url-${course.id}`}
                          value={course.verificationUrl || ''}
                          onChange={(e) => handleUpdateCourse(course.id, 'verificationUrl', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor={`course-description-${course.id}`}>الوصف (اختياري)</Label>
                      <Textarea
                        id={`course-description-${course.id}`}
                        value={course.description || ''}
                        onChange={(e) => handleUpdateCourse(course.id, 'description', e.target.value)}
                        placeholder="اكتب وصفاً موجزاً عن الدورة التدريبية..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Course Button */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="flex items-center justify-center py-8">
              <Button
                onClick={handleAddCourse}
                variant="ghost"
                className="flex items-center space-x-2 space-x-reverse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>إضافة دورة تدريبية</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <AnimatePresence>
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        إنجاز {index + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAchievement(achievement.id)}
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
                      {/* Achievement Title */}
                      <div className="space-y-2">
                        <Label htmlFor={`achievement-title-${achievement.id}`}>عنوان الإنجاز *</Label>
                        <Input
                          id={`achievement-title-${achievement.id}`}
                          value={achievement.title}
                          onChange={(e) => handleUpdateAchievement(achievement.id, 'title', e.target.value)}
                          placeholder="مثال: جائزة أفضل موظف، شهادة تقدير..."
                        />
                      </div>

                      {/* Provider */}
                      <div className="space-y-2">
                        <Label htmlFor={`achievement-provider-${achievement.id}`}>الجهة المانحة *</Label>
                        <Input
                          id={`achievement-provider-${achievement.id}`}
                          value={achievement.provider}
                          onChange={(e) => handleUpdateAchievement(achievement.id, 'provider', e.target.value)}
                          placeholder="اسم الشركة أو المؤسسة..."
                        />
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor={`achievement-date-${achievement.id}`}>التاريخ *</Label>
                        <Input
                          id={`achievement-date-${achievement.id}`}
                          type="date"
                          value={achievement.date}
                          onChange={(e) => handleUpdateAchievement(achievement.id, 'date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor={`achievement-description-${achievement.id}`}>وصف الإنجاز (اختياري)</Label>
                      <Textarea
                        id={`achievement-description-${achievement.id}`}
                        value={achievement.description || ''}
                        onChange={(e) => handleUpdateAchievement(achievement.id, 'description', e.target.value)}
                        placeholder="اكتب وصفاً موجزاً عن الإنجاز وأهميته..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Achievement Button */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="flex items-center justify-center py-8">
              <Button
                onClick={handleAddAchievement}
                variant="ghost"
                className="flex items-center space-x-2 space-x-reverse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>إضافة إنجاز جديد</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="references" className="space-y-4">
          <AnimatePresence>
            {references.map((reference, index) => (
              <motion.div
                key={reference.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        مرجع {index + 1}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveReference(reference.id)}
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
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`reference-name-${reference.id}`}>الاسم الكامل *</Label>
                        <Input
                          id={`reference-name-${reference.id}`}
                          value={reference.name}
                          onChange={(e) => handleUpdateReference(reference.id, 'name', e.target.value)}
                          placeholder="اسم الشخص المرجع"
                        />
                      </div>

                      {/* Position */}
                      <div className="space-y-2">
                        <Label htmlFor={`reference-position-${reference.id}`}>المنصب *</Label>
                        <Input
                          id={`reference-position-${reference.id}`}
                          value={reference.position}
                          onChange={(e) => handleUpdateReference(reference.id, 'position', e.target.value)}
                          placeholder="المنصب الوظيفي"
                        />
                      </div>

                      {/* Company */}
                      <div className="space-y-2">
                        <Label htmlFor={`reference-company-${reference.id}`}>الشركة *</Label>
                        <Input
                          id={`reference-company-${reference.id}`}
                          value={reference.company}
                          onChange={(e) => handleUpdateReference(reference.id, 'company', e.target.value)}
                          placeholder="اسم الشركة أو المؤسسة"
                        />
                      </div>

                      {/* Relationship */}
                      <div className="space-y-2">
                        <Label htmlFor={`reference-relationship-${reference.id}`}>صلة القرابة/العمل *</Label>
                        <Input
                          id={`reference-relationship-${reference.id}`}
                          value={reference.relationship}
                          onChange={(e) => handleUpdateReference(reference.id, 'relationship', e.target.value)}
                          placeholder="مثال: مدير سابق، زميل عمل..."
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor={`reference-phone-${reference.id}`}>رقم الهاتف *</Label>
                        <Input
                          id={`reference-phone-${reference.id}`}
                          value={reference.phone}
                          onChange={(e) => handleUpdateReference(reference.id, 'phone', e.target.value)}
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor={`reference-email-${reference.id}`}>البريد الإلكتروني *</Label>
                        <Input
                          id={`reference-email-${reference.id}`}
                          type="email"
                          value={reference.email}
                          onChange={(e) => handleUpdateReference(reference.id, 'email', e.target.value)}
                          placeholder="reference@company.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Reference Button */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="flex items-center justify-center py-8">
              <Button
                onClick={handleAddReference}
                variant="ghost"
                className="flex items-center space-x-2 space-x-reverse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>إضافة مرجع جديد</span>
              </Button>
            </CardContent>
          </Card>

          {/* Tips for References */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-yellow-900 mb-2">⚠️ تنبيه مهم:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• تأكد من موافقة الأشخاص قبل إضافتهم كمراجع</li>
                <li>• اختر أشخاص يعرفونك مهنياً ويمكنهم التحدث عن قدراتك</li>
                <li>• أبلغ المراجع مسبقاً عند التقدم للوظائف</li>
                <li>• تأكد من صحة معلومات الاتصال</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
