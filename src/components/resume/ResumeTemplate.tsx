'use client';

import React from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Resume } from '@/types';

interface ResumeTemplateProps {
  resume?: Resume;
  className?: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long' 
  };
  return date.toLocaleDateString('ar-SA', options);
};

// Helper function to get level label
const getLevelLabel = (level: string) => {
  const levels: Record<string, string> = {
    'beginner': 'مبتدئ',
    'intermediate': 'متوسط',
    'good': 'جيد',
    'very-good': 'جيد جداً',
    'excellent': 'ممتاز',
    'fluent': 'طليق',
    'A1': 'A1',
    'A2': 'A2',
    'B1': 'B1',
    'B2': 'B2',
    'C1': 'C1',
    'C2': 'C2',
    'poor': 'ضعيف',
    'fair': 'مقبول',
    'hobby': 'هواية',
    'professional': 'احترافي'
  };
  return levels[level] || level;
};

export default function ResumeTemplate({ resume: propResume, className = '' }: ResumeTemplateProps) {
  const { formData } = useResumeStore();
  const resume = propResume || formData.data;

  if (!resume || !resume.personalInfo) {
    return (
      <div className={`bg-white p-8 shadow-lg ${className}`}>
        <div className="text-center text-gray-500">
          لا توجد بيانات لعرضها
        </div>
      </div>
    );
  }

  const {
    personalInfo,
    education = [],
    experience = [],
    skills = [],
    languages = [],
    hobbies = [],
    courses = [],
    achievements = [],
    references = []
  } = resume;

  return (
    <div className={`bg-white shadow-lg ${className}`} style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Header Section */}
      <div className="bg-gray-50 p-6 text-center border-b">
        {personalInfo.profileImage && (
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-4 border-white shadow-md">
            <img 
              src={personalInfo.profileImage} 
              alt="صورة شخصية" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        {personalInfo.jobTitle && (
          <p className="text-lg text-gray-600 mb-3">{personalInfo.jobTitle}</p>
        )}

        {/* Contact Information */}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span>📧</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span>📱</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.city && (
            <div className="flex items-center gap-1">
              <span>🏙️</span>
              <span>{personalInfo.city}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Personal Information */}
        {(personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.maritalStatus || 
          (personalInfo.customFields && personalInfo.customFields.length > 0)) && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              المعلومات الشخصية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.dateOfBirth && (
                <div>
                  <span className="font-medium">تاريخ الميلاد:</span> {personalInfo.dateOfBirth}
                </div>
              )}
              {personalInfo.nationality && (
                <div>
                  <span className="font-medium">الجنسية:</span> {personalInfo.nationality}
                </div>
              )}
              {personalInfo.maritalStatus && (
                <div>
                  <span className="font-medium">الحالة الاجتماعية:</span> {personalInfo.maritalStatus}
                </div>
              )}
              {personalInfo.customFields?.map((field) => (
                <div key={field.id}>
                  <span className="font-medium">{field.label}:</span> {field.value}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              الخبرة المهنية
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.position || exp.jobTitle}
                  </h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {exp.location && `${exp.location} • `}
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'الحاضر'}
                  </p>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-3">{exp.description}</p>
                  )}
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">المسؤوليات:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.responsibilities.map((responsibility, idx) => (
                          <li key={idx}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">الإنجازات:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              التعليم
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.degree} {edu.field && `في ${edu.field}`}
                  </h3>
                  <p className="text-gray-700 font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {edu.location && `${edu.location} • `}
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'الحاضر'}
                  </p>
                  
                  {edu.gpa && (
                    <p className="text-gray-700">المعدل: {edu.gpa}</p>
                  )}
                  
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-2">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {edu.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              المهارات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                    {getLevelLabel(skill.level)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              اللغات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((language, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                      {getLevelLabel(language.level)}
                    </span>
                  </div>
                  
                  {language.skills && (
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      {language.skills.reading && (
                        <div>القراءة: {getLevelLabel(language.skills.reading)}</div>
                      )}
                      {language.skills.writing && (
                        <div>الكتابة: {getLevelLabel(language.skills.writing)}</div>
                      )}
                      {language.skills.speaking && (
                        <div>التحدث: {getLevelLabel(language.skills.speaking)}</div>
                      )}
                      {language.skills.listening && (
                        <div>الاستماع: {getLevelLabel(language.skills.listening)}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              الدورات التدريبية
            </h2>
            <div className="space-y-3">
              {courses.map((course, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-gray-700">{course.provider}</p>
                  <p className="text-sm text-gray-600">{formatDate(course.dateCompleted)}</p>
                  {course.certificateNumber && (
                    <p className="text-xs text-gray-500">رقم الشهادة: {course.certificateNumber}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              الإنجازات والجوائز
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                  <p className="text-gray-700">{achievement.provider}</p>
                  <p className="text-sm text-gray-600">{formatDate(achievement.date)}</p>
                  {achievement.description && (
                    <p className="text-gray-700 mt-1">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hobbies */}
        {hobbies.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              الهوايات والاهتمامات
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hobbies.map((hobby, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium">{hobby.name}</div>
                  {hobby.description && (
                    <div className="text-xs text-gray-600 mt-1">{hobby.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
              المراجع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((reference, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{reference.name}</h3>
                  <p className="text-gray-700">{reference.position}</p>
                  <p className="text-gray-700">{reference.company}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {reference.relationship}
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>📧 {reference.email}</div>
                    <div>📱 {reference.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
