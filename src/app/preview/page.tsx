'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirebaseResumes } from '@/hooks/useFirebaseResumes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumeId = searchParams.get('resumeId');

  // استخدام userId مؤقت - في التطبيق الحقيقي سيأتي من نظام التوثيق
  const userId = 'temp-user-id';

  const {
    currentResume,
    loading,
    error,
    subscribeToResume
  } = useFirebaseResumes(userId);

  // جلب البيانات عند التحميل
  useEffect(() => {
    if (resumeId) {
      subscribeToResume(resumeId);
    }
  }, [resumeId, subscribeToResume]);

  // إعادة جلب البيانات
  const handleRefresh = () => {
    if (resumeId) {
      subscribeToResume(resumeId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل بيانات السيرة الذاتية...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleRefresh}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">لم يتم العثور على السيرة الذاتية</p>
          <Button onClick={() => router.push('/resumes')}>العودة للسير الذاتية</Button>
        </div>
      </div>
    );
  }

  const { personalInfo, education, experience, skills, languages, hobbies, courses, references, achievements, customSections } = currentResume;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* الرأس */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/resumes')}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              العودة
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className="w-4 h-4" />
              تحديث
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentResume.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>تم الإنشاء: {format(new Date(currentResume.createdAt), 'dd/MM/yyyy', { locale: ar })}</span>
            <span>آخر تحديث: {format(new Date(currentResume.updatedAt), 'dd/MM/yyyy', { locale: ar })}</span>
            <Badge variant={currentResume.language === 'ar' ? 'default' : 'secondary'}>
              {currentResume.language === 'ar' ? 'عربي' : 'English'}
            </Badge>
          </div>
        </div>

        {/* المعلومات الشخصية */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>الاسم الأول:</strong> {personalInfo.firstName || 'غير محدد'}
              </div>
              <div>
                <strong>الاسم الأخير:</strong> {personalInfo.lastName || 'غير محدد'}
              </div>
              <div>
                <strong>المسمى الوظيفي:</strong> {personalInfo.jobTitle || 'غير محدد'}
              </div>
              <div>
                <strong>البريد الإلكتروني:</strong> {personalInfo.email || 'غير محدد'}
              </div>
              <div>
                <strong>الهاتف:</strong> {personalInfo.phone || 'غير محدد'}
              </div>
              <div>
                <strong>العنوان:</strong> {personalInfo.address || 'غير محدد'}
              </div>
              <div>
                <strong>المدينة:</strong> {personalInfo.city || 'غير محدد'}
              </div>
              <div>
                <strong>الرمز البريدي:</strong> {personalInfo.postalCode || 'غير محدد'}
              </div>
            </div>

            {personalInfo.customFields && personalInfo.customFields.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">الحقول المخصصة:</h4>
                <div className="space-y-2">
                  {personalInfo.customFields.map((field) => (
                    <div key={field.id}>
                      <strong>{field.label}:</strong> {field.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* التعليم */}
        {education && education.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">التعليم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="border-b pb-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <strong>الدرجة:</strong> {edu.degree}
                      </div>
                      <div>
                        <strong>التخصص:</strong> {edu.field}
                      </div>
                      <div>
                        <strong>المؤسسة:</strong> {edu.institution}
                      </div>
                      <div>
                        <strong>الموقع:</strong> {edu.location}
                      </div>
                      <div>
                        <strong>تاريخ البداية:</strong> {edu.startDate}
                      </div>
                      <div>
                        <strong>تاريخ النهاية:</strong> {edu.endDate || (edu.isCurrentlyStudying ? 'حتى الآن' : 'غير محدد')}
                      </div>
                      {edu.gpa && (
                        <div>
                          <strong>المعدل:</strong> {edu.gpa}
                        </div>
                      )}
                    </div>
                    {edu.coursework && (
                      <div className="mt-2">
                        <strong>المواد الدراسية:</strong> {edu.coursework}
                      </div>
                    )}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mt-2">
                        <strong>الإنجازات:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {edu.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* الخبرات */}
        {experience && experience.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">الخبرات العملية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-b pb-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <strong>المسمى الوظيفي:</strong> {exp.jobTitle}
                      </div>
                      <div>
                        <strong>الشركة:</strong> {exp.company}
                      </div>
                      <div>
                        <strong>الموقع:</strong> {exp.location}
                      </div>
                      <div>
                        <strong>المدينة:</strong> {exp.city || 'غير محدد'}
                      </div>
                      <div>
                        <strong>تاريخ البداية:</strong> {exp.startDate}
                      </div>
                      <div>
                        <strong>تاريخ النهاية:</strong> {exp.endDate || (exp.isCurrentJob ? 'حتى الآن' : 'غير محدد')}
                      </div>
                      {exp.employmentType && (
                        <div>
                          <strong>نوع التوظيف:</strong> {exp.employmentType}
                        </div>
                      )}
                    </div>
                    {exp.description && (
                      <div className="mt-2">
                        <strong>الوصف:</strong> {exp.description}
                      </div>
                    )}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="mt-2">
                        <strong>المسؤوليات:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {exp.responsibilities.map((responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-2">
                        <strong>الإنجازات:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {exp.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="mt-2">
                        <strong>المهارات:</strong> {exp.skills.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* المهارات */}
        {skills && skills.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">المهارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center">
                    <span><strong>{skill.name}</strong></span>
                    <Badge variant="outline">{skill.level}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* اللغات */}
        {languages && languages.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">اللغات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="flex justify-between items-center mb-2">
                      <strong>{lang.name}</strong>
                      <Badge variant="outline">{lang.level}</Badge>
                    </div>
                    {lang.skills && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {lang.skills.reading && <div>القراءة: {lang.skills.reading}</div>}
                        {lang.skills.writing && <div>الكتابة: {lang.skills.writing}</div>}
                        {lang.skills.speaking && <div>المحادثة: {lang.skills.speaking}</div>}
                        {lang.skills.listening && <div>الاستماع: {lang.skills.listening}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* الهوايات */}
        {hobbies && hobbies.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">الهوايات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hobbies.map((hobby) => (
                  <div key={hobby.id}>
                    <strong>{hobby.name}</strong>
                    {hobby.description && <div className="text-sm text-gray-600">{hobby.description}</div>}
                    <Badge variant="outline" className="mt-1">{hobby.level}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* الدورات */}
        {courses && courses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">الدورات التدريبية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border-b pb-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <strong>اسم الدورة:</strong> {course.name}
                      </div>
                      <div>
                        <strong>الجهة المقدمة:</strong> {course.provider}
                      </div>
                      <div>
                        <strong>تاريخ الإكمال:</strong> {course.dateCompleted}
                      </div>
                      {course.certificateNumber && (
                        <div>
                          <strong>رقم الشهادة:</strong> {course.certificateNumber}
                        </div>
                      )}
                    </div>
                    {course.verificationUrl && (
                      <div className="mt-2">
                        <strong>رابط التحقق:</strong> <a href={course.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{course.verificationUrl}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* الإنجازات */}
        {achievements && achievements.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">الإنجازات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border-b pb-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <strong>العنوان:</strong> {achievement.title}
                      </div>
                      <div>
                        <strong>الجهة المقدمة:</strong> {achievement.provider}
                      </div>
                      <div>
                        <strong>التاريخ:</strong> {achievement.date}
                      </div>
                    </div>
                    {achievement.description && (
                      <div className="mt-2">
                        <strong>الوصف:</strong> {achievement.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* المراجع */}
        {references && references.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">المراجع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {references.map((ref) => (
                  <div key={ref.id} className="border-b pb-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <strong>الاسم:</strong> {ref.name}
                      </div>
                      <div>
                        <strong>المسمى الوظيفي:</strong> {ref.position}
                      </div>
                      <div>
                        <strong>الشركة:</strong> {ref.company}
                      </div>
                      <div>
                        <strong>الهاتف:</strong> {ref.phone}
                      </div>
                      <div>
                        <strong>البريد الإلكتروني:</strong> {ref.email}
                      </div>
                      <div>
                        <strong>العلاقة:</strong> {ref.relationship}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* الأقسام المخصصة */}
        {customSections && customSections.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">الأقسام المخصصة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customSections.map((section) => (
                  <div key={section.id} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-semibold mb-2">{section.title}</h4>
                    {section.type === 'text' && <p>{section.content}</p>}
                    {section.type === 'list' && (
                      <ul className="list-disc list-inside">
                        {section.content.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.type === 'table' && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border">
                          <tbody>
                            {section.content.map((row: any[], rowIndex: number) => (
                              <tr key={rowIndex}>
                                {row.map((cell: string, cellIndex: number) => (
                                  <td key={cellIndex} className="border px-2 py-1">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
