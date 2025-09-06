import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { Resume } from '@/types';
import { createStyles, getSkillBarWidth, translateSkillLevel, translateLanguageLevel } from './styles';
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
          
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}> {personalInfo.email}</Text>
              </View>
            )}
            
            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}> {personalInfo.phone}</Text>
              </View>
            )}
            
            {personalInfo.address && (
              <View style={styles.contactItem}>
                <Text style={styles.contactText}> {personalInfo.address}</Text>
              </View>
            )}
          </View>
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
  if (!resume.experience || resume.experience.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الخبرات المهنية</Text>
      <View style={styles.sectionContent}>
        {resume.experience.map((exp, index) => (
          <View key={exp.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.location && (
                  <Text style={styles.itemLocation}>{exp.location}</Text>
                )}
              </View>
              <Text style={styles.itemDate}>
                {exp.startDate} - {exp.isCurrentJob ? 'حتى الآن' : exp.endDate}
              </Text>
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

// مكون التعليم
const EducationSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  if (!resume.education || resume.education.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>التعليم</Text>
      <View style={styles.sectionContent}>
        {resume.education.map((edu, index) => (
          <View key={edu.id} style={styles.item}>
            <View style={styles.educationHeader}>
              <View style={styles.degreeRow}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                <Text style={styles.itemSubtitle}>{edu.field}</Text>
              </View>
              <View style={styles.institutionRow}>
                {edu.location && (
                  <Text style={styles.itemLocation}>{edu.location}</Text>
                )}
                <Text style={styles.itemSubtitle}>({edu.institution})</Text>
              </View>
              <Text style={styles.itemDate}>
                {edu.startDate} - {edu.isCurrentlyStudying ? 'حتى الآن' : edu.endDate}
              </Text>
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
  if (!resume.skills || resume.skills.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>المهارات</Text>
      <View style={styles.sectionContent}>
        {resume.skills.map((skill, index) => (
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
  if (!resume.languages || resume.languages.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>اللغات</Text>
      <View style={styles.sectionContent}>
        {resume.languages.map((language, index) => (
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
  if (!resume.courses || resume.courses.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الدورات التدريبية</Text>
      <View style={styles.sectionContent}>
        {resume.courses.map((course, index) => (
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
  if (!resume.achievements || resume.achievements.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الجوائز والإنجازات</Text>
      <View style={styles.sectionContent}>
        {resume.achievements.map((achievement, index) => (
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
  if (!resume.hobbies || resume.hobbies.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الهوايات والاهتمامات</Text>
      <View style={styles.sectionContent}>
        <View style={styles.skillsContainer}>
          {resume.hobbies.map((hobby, index) => (
            <View key={hobby.id} style={styles.skillItem}>
              <Text style={styles.skillName}>{hobby.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// مكون المراجع
const ReferencesSection: React.FC<{ resume: Resume; styles: any }> = ({ resume, styles }) => {
  if (!resume.references || resume.references.length === 0) return null;
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>المراجع</Text>
      <View style={styles.sectionContent}>
        {resume.references.map((reference, index) => (
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
  const styles = createStyles(resume.theme, resume.language);
  
  // ترتيب الأقسام حسب sectionOrder
  const renderSection = (sectionId: string) => {
    if (resume.hiddenSections?.includes(sectionId)) return null;
    
    switch (sectionId) {
      case 'personalInfo':
        return <PersonalInfoSection key={sectionId} resume={resume} styles={styles} />;
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
      language={resume.language}
    >
      <Page size="A4" style={styles.page} wrap={true}>
        <View style={styles.container}>
          {/* رأس السيرة الذاتية */}
          <PersonalInfoSection resume={resume} styles={styles} />
          
          {/* المحتوى مقسم إلى عمودين */}
          <View style={styles.twoColumnLayout}>
            {/* العمود الأيمن الجديد - 40% */}
            <View style={styles.rightColumn}>
              {resume.sectionOrder?.filter(section => 
                ['objective', 'education', 'skills', 'languages'].includes(section) && 
                !resume.hiddenSections?.includes(section)
              ).map(sectionId => renderSection(sectionId)) || [
                <ObjectiveSection key="objective" resume={resume} styles={styles} />,
                <EducationSection key="education" resume={resume} styles={styles} />,
                <SkillsSection key="skills" resume={resume} styles={styles} />,
                <LanguagesSection key="languages" resume={resume} styles={styles} />,
              ]}
            </View>
            
            {/* العمود الأيسر الجديد - 60% */}
            <View style={styles.leftColumn}>
              {resume.sectionOrder?.filter(section => 
                ['experience', 'courses', 'achievements', 'hobbies', 'references'].includes(section) && 
                !resume.hiddenSections?.includes(section)
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
