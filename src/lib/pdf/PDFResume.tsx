import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { Resume, ResumeTheme } from '@/types';
import { createStyles, getSkillBarWidth, translateSkillLevel, translateLanguageLevel, translateHobbyLevel } from './styles';
import { registerFonts } from './fonts';

// تسجيل الخطوط عند تحميل المكون
registerFonts();

interface PDFResumeProps {
  resume: Resume;
}

// مكون المعلومات الشخصية
const PersonalInfoSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const { personalInfo } = resume;
  
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* الصورة على اليسار */}
        <View style={styles.headerLeft}>
          {personalInfo.profileImage ? (
            <View style={styles.profileImageContainer}>
              <Image style={styles.profileImage} src={personalInfo.profileImage} />
            </View>
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.placeholderText}>صورة شخصية</Text>
            </View>
          )}
        </View>
        
        {/* المعلومات على اليمين */}
        <View style={styles.headerRight}>
          <Text style={styles.fullName}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Text>
          
          {personalInfo.jobTitle && (
            <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
          )}
          
        </View>
      </View>
    </View>
  );
};

// مكون الهدف المهني
const ObjectiveSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  if (!resume.objective) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الهدف المهني</Text>
      <View style={styles.sectionContent}>
        <Text style={styles.objective}>{resume.objective}</Text>
      </View>
    </View>
  );
};

// مكون الخبرات
const ExperienceSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const experiences = resume.experience || [];
  if (experiences.length === 0) return null;
  
  const validExperiences = experiences.filter(exp => exp && exp.id);
  
  if (validExperiences.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الخبرات المهنية</Text>
      <View style={styles.sectionContent}>
        {validExperiences.map((exp, index) => (
          <View key={exp.id} style={styles.item}>
            <View style={styles.educationHeader}>
              <View style={styles.degreeRow}>
                <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                {exp.position && <Text style={styles.itemSubtitle}>{exp.position}</Text>}
              </View>
              <View style={styles.institutionRow}>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.location && <Text style={styles.itemLocation}>({exp.location})</Text>}
              </View>
              <View style={styles.itemDate}>
                <Text style={styles.dateText}>{exp.startDate}</Text>
                <Text style={styles.dateText}>{exp.isCurrentJob ? 'حتى الآن' : exp.endDate}</Text>
              </View>
            </View>
            
            {exp.description && (
              <Text style={styles.itemDescription}>{exp.description}</Text>
            )}
            
            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <View style={styles.list}>
                {exp.responsibilities.map((responsibility, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={styles.listText}>{responsibility}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {exp.achievements && exp.achievements.length > 0 && (
              <View style={styles.list}>
                <Text style={[styles.itemSubtitle, { marginBottom: 4 }]}>الإنجازات:</Text>
                {exp.achievements.map((achievement, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listBullet}>⭐</Text>
                    <Text style={styles.listText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون المعلومات الشخصية الإضافية
const AdditionalPersonalInfoSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const { personalInfo } = resume;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
      <View style={styles.sectionContent}>
        <View style={styles.item}>
          <View style={styles.educationHeader}>
            <View style={styles.degreeRow}>
              <Text style={styles.itemTitle}>الاسم الكامل: {personalInfo.firstName} {personalInfo.lastName}</Text>
            </View>
          </View>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>{personalInfo.email} :البريد</Text>
              </View>
            )}
            
            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>الهاتف: {personalInfo.phone}</Text>
              </View>
            )}
            
            {personalInfo.address && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>العنوان: {personalInfo.address}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// مكون التعليم
const EducationSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const educations = resume.education || [];
  if (educations.length === 0) return null;
  
  const validEducations = educations.filter(edu => edu && edu.id);
  
  if (validEducations.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>التعليم</Text>
      <View style={styles.sectionContent}>
        {validEducations.map((edu, index) => (
          <View key={edu.id} style={styles.item}>
            <View style={styles.educationHeader}>
              <View style={styles.degreeRow}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemSubtitle}>{edu.field}</Text>
              </View>
              <View style={styles.institutionRow}>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                {edu.location && (
                  <Text style={styles.itemLocation}>({edu.location})</Text>
                )}
              </View>
              <View style={styles.itemDate}>
                <Text style={styles.dateText}>{edu.startDate}</Text>
                <Text style={styles.dateText}>{edu.isCurrentlyStudying ? 'حتى الآن' : edu.endDate}</Text>
              </View>
              {edu.gpa && (
                <View style={styles.gpaContainer}>
                  <Text style={styles.gpaText}>المعدل التراكمي: {edu.gpa}</Text>
                </View>
              )}
            </View>
            
            {edu.achievements && edu.achievements.length > 0 && (
              <View style={styles.list}>
                {edu.achievements.map((achievement, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listBullet}>•</Text>
                    <Text style={styles.listText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون المهارات
const SkillsSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const skills = resume.skills || [];
  if (skills.length === 0) return null;
  
  const validSkills = skills.filter(skill => skill && skill.id);
  
  if (validSkills.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>المهارات</Text>
      <View style={styles.sectionContent}>
        {validSkills.map((skill, index) => (
          <View key={skill.id} style={styles.skillBar}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>{translateSkillLevel(skill.level, resume.language)}</Text>
            </View>
            <View style={styles.skillBarContainer}>
              <View style={[
                styles.skillBarFill,
                { width: getSkillBarWidth(skill.level) }
              ]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون اللغات
const LanguagesSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const languages = resume.languages || [];
  if (languages.length === 0) return null;
  
  const validLanguages = languages.filter(language => language && language.id);
  
  if (validLanguages.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>اللغات</Text>
      <View style={styles.sectionContent}>
        {validLanguages.map((language, index) => (
          <View key={language.id} style={styles.languageItem}>
            <Text style={styles.languageName}>{language.name}</Text>
            <Text style={styles.languageLevel}>
              {translateLanguageLevel(language.level, resume.language)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون الدورات
const CoursesSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const courses = resume.courses || [];
  if (courses.length === 0) return null;
  
  const validCourses = courses.filter(course => course && course.id);
  
  if (validCourses.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الدورات التدريبية</Text>
      <View style={styles.sectionContent}>
        {validCourses.map((course, index) => (
          <View key={course.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemTitle}>{course.name}</Text>
                <Text style={styles.itemSubtitle}>{course.provider}</Text>
              </View>
              <Text style={styles.itemDate}>{course.dateCompleted}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون الإنجازات
const AchievementsSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const achievements = resume.achievements || [];
  if (achievements.length === 0) return null;
  
  const validAchievements = achievements.filter(achievement => achievement && achievement.id);
  
  if (validAchievements.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الجوائز والإنجازات</Text>
      <View style={styles.sectionContent}>
        {validAchievements.map((achievement, index) => (
          <View key={achievement.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemTitle}>{achievement.title}</Text>
                <Text style={styles.itemSubtitle}>{achievement.provider}</Text>
              </View>
              <Text style={styles.itemDate}>{achievement.date}</Text>
            </View>
            {achievement.description && (
              <Text style={styles.itemDescription}>{achievement.description}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون الهوايات
const HobbiesSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const hobbies = resume.hobbies || [];
  if (hobbies.length === 0) return null;
  
  const validHobbies = hobbies.filter(hobby => hobby && hobby.id);
  
  if (validHobbies.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الهوايات والاهتمامات</Text>
      <View style={styles.sectionContent}>
        {validHobbies.map((hobby, index) => (
          <View key={hobby.id} style={styles.item}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{hobby.name}</Text>
              <Text style={styles.skillLevel}>{translateHobbyLevel(hobby.level, resume.language)}</Text>
            </View>
            {hobby.description && (
              <Text style={styles.itemDescription}>{hobby.description}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

// مكون المراجع
const ReferencesSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  const references = resume.references || [];
  if (references.length === 0) return null;
  
  const validReferences = references.filter(reference => reference && reference.id);
  
  if (validReferences.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>المراجع</Text>
      <View style={styles.sectionContent}>
        {validReferences.map((reference, index) => (
          <View key={reference.id} style={styles.item}>
            <Text style={styles.itemTitle}>{reference.name}</Text>
            <Text style={styles.itemSubtitle}>{reference.position}</Text>
            <Text style={styles.itemSubtitle}>{reference.company}</Text>
            <View style={styles.contactInfo}>
              {reference.email && (
                <Text style={styles.contactText}>📧 {reference.email}</Text>
              )}
              {reference.phone && (
                <Text style={styles.contactText}>📞 {reference.phone}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// المكون الرئيسي للـ PDF
const PDFResume: React.FC<PDFResumeProps> = ({ resume }) => {
  // التحقق من صحة البيانات الأساسية
  if (!resume || !resume.id || !resume.personalInfo) {
    console.error('البيانات غير صالحة لإنشاء PDF:', resume);
    return null;
  }
  
  // التحقق من وجود theme افتراضي
  const defaultTheme: ResumeTheme = {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      text: '#212529',
      background: '#ffffff',
      border: '#dee2e6',
      accent: '#007bff',
    },
    fonts: {
      heading: 'Cairo',
      body: 'Cairo',
      size: {
        base: 12,
        heading: 16,
        small: 10,
      },
    },
    layout: {
      columns: 1,
      spacing: 'normal',
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    },
    styles: {
      borderRadius: 4,
      shadowLevel: 'none',
      headerStyle: 'minimal',
    },
  };
  
  const theme = resume.theme || defaultTheme;
  const language = resume.language || 'ar';
  const sectionOrder = resume.sectionOrder || [];
  const hiddenSections = resume.hiddenSections || [];
  const styles = createStyles(theme, language);
  
  // ترتيب الأقسام حسب sectionOrder
  const renderSection = (sectionId: string) => {
    if (hiddenSections.includes(sectionId)) return null;
    
    switch (sectionId) {
      case 'personalInfo':
        return <PersonalInfoSection key={sectionId} resume={resume} styles={styles} />;
      case 'additionalPersonalInfo':
        return <AdditionalPersonalInfoSection key={sectionId} resume={resume} styles={styles} />;
      case 'objective':
        return <ObjectiveSection key={sectionId} resume={resume} styles={styles} />;
      case 'experience':
        return <ExperienceSection key={sectionId} resume={resume} styles={styles} />;
      case 'education':
        return <EducationSection key={sectionId} resume={resume} styles={styles} />;
      case 'skills':
        return <SkillsSection key={sectionId} resume={resume} styles={styles} />;
      case 'languages':
        return <LanguagesSection key={sectionId} resume={resume} styles={styles} />;
      case 'courses':
        return <CoursesSection key={sectionId} resume={resume} styles={styles} />;
      case 'achievements':
        return <AchievementsSection key={sectionId} resume={resume} styles={styles} />;
      case 'hobbies':
        return <HobbiesSection key={sectionId} resume={resume} styles={styles} />;
      case 'references':
        return <ReferencesSection key={sectionId} resume={resume} styles={styles} />;
      default:
        return null;
    }
  };
  
  return (
    <Document
      title={`${resume.personalInfo.firstName} ${resume.personalInfo.lastName} - سيرة ذاتية`}
      author={`${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`}
      subject="السيرة الذاتية"
      creator="منشئ السير الذاتية"
      producer="React PDF"
      language={language}
    >
      <Page size="A4" style={styles.page} wrap={true}>
        <View style={styles.container}>
          {/* رأس السيرة الذاتية */}
          <PersonalInfoSection resume={resume} styles={styles} />
          
          {/* المحتوى مقسم إلى عمودين */}
          <View style={styles.twoColumnLayout}>
            {/* العمود الأيمن الجديد - 40% */}
            <View style={styles.rightColumn}>
              {/* مكون المعلومات الشخصية الإضافية يظهر دائماً */}
              {!hiddenSections.includes('additionalPersonalInfo') && (
                <AdditionalPersonalInfoSection resume={resume} styles={styles} />
              )}
              {sectionOrder.filter(section => 
                ['objective', 'additionalPersonalInfo', 'education', 'skills', 'languages'].includes(section) && 
                !hiddenSections.includes(section)
              ).map(sectionId => renderSection(sectionId)) || [
                <ObjectiveSection key="objective" resume={resume} styles={styles} />,
                <AdditionalPersonalInfoSection key="additionalPersonalInfo" resume={resume} styles={styles} />,
                <EducationSection key="education" resume={resume} styles={styles} />,
                <SkillsSection key="skills" resume={resume} styles={styles} />,
                <LanguagesSection key="languages" resume={resume} styles={styles} />,
              ]}
            </View>
            
            {/* العمود الأيسر الجديد - 60% */}
            <View style={styles.leftColumn}>
              {sectionOrder.filter(section => 
                ['experience', 'courses', 'achievements', 'hobbies', 'references'].includes(section) && 
                !hiddenSections.includes(section)
              ).map(sectionId => renderSection(sectionId)) || [
                <ExperienceSection key="experience" resume={resume} styles={styles} />,
                <CoursesSection key="courses" resume={resume} styles={styles} />,
                <AchievementsSection key="achievements" resume={resume} styles={styles} />,
                <HobbiesSection key="hobbies" resume={resume} styles={styles} />,
                <ReferencesSection key="references" resume={resume} styles={styles} />,
              ]}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFResume;
