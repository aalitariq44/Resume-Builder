import { StyleSheet } from '@react-pdf/renderer';
import { ResumeTheme } from '@/types';
import { getFontFamily, getTextDirection, getTextAlign } from './fonts';

// الأنماط الأساسية للصفحة بحجم A4
export const createStyles = (theme: ResumeTheme, language: 'ar' | 'en' = 'ar') => {
  const fontFamily = getFontFamily(language);
  const direction = getTextDirection(language);
  const textAlign = getTextAlign(language);

  return StyleSheet.create({
    // إعدادات الصفحة
    page: {
      size: 'A4',
      paddingTop: theme.layout.margins.top,
      paddingRight: theme.layout.margins.right,
      paddingBottom: theme.layout.margins.bottom,
      paddingLeft: theme.layout.margins.left,
      fontFamily,
      fontSize: theme.fonts.size.base,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      direction: direction,
      textAlign: textAlign,
      lineHeight: 1.4,
    },

    // الحاوي الرئيسي
    container: {
      flex: 1,
      flexDirection: 'column',
      gap: theme.layout.spacing === 'tight' ? 8 : theme.layout.spacing === 'relaxed' ? 16 : 12,
    },

    // رأس الصفحة - المعلومات الشخصية
    header: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: theme.styles.headerStyle === 'minimal' ? 1 : 0,
      borderBottomColor: theme.colors.border,
      borderBottomStyle: 'solid',
      borderWidth: 2,
      borderColor: '#007bff',
      borderStyle: 'solid',
      borderRadius: 8,
      padding: 15,
      backgroundColor: theme.colors.background,
    },

    // محتوى الرأس (تخطيط أفقي)
    headerContent: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 20,
      direction: direction,
    },

    // العمود الأيسر (الصورة)
    headerLeft: {
      width: 140,
      alignItems: 'center',
    },

    // العمود الأيمن (المعلومات)
    headerRight: {
      flex: 1,
      direction: direction,
    },

    // صورة شخصية
    profileImageContainer: {
      alignItems: 'center',
    },

    profileImage: {
      width: 120,
      height: 120,
      borderRadius: theme.styles.borderRadius,
      objectFit: 'cover',
    },

    // Placeholder للصورة الشخصية
    profileImagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: theme.styles.borderRadius,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'dashed',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },

    placeholderText: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.secondary,
      textAlign: 'center',
      fontFamily,
    },

    // الاسم
    fullName: {
      fontSize: theme.fonts.size.heading + 6,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: textAlign,
      marginBottom: 5,
      fontFamily,
    },

    // المسمى الوظيفي
    jobTitle: {
      fontSize: theme.fonts.size.base + 2,
      fontWeight: 'medium',
      color: theme.colors.secondary,
      textAlign: textAlign,
      marginBottom: 15,
      marginTop: 10,
      fontFamily,
    },

    // معلومات الاتصال
    contactInfo: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      justifyContent: direction === 'rtl' ? 'flex-start' : 'flex-start',
      gap: 15,
      marginBottom: 10,
      direction: direction,
    },

    contactItem: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      alignItems: 'center',
      fontSize: theme.fonts.size.small,
      color: theme.colors.text,
      direction: direction,
    },

    contactText: {
      marginRight: direction === 'rtl' ? 0 : 5,
      marginLeft: direction === 'rtl' ? 5 : 0,
      fontFamily,
      textAlign: textAlign,
    },

    // الأقسام
    section: {
      marginBottom: theme.layout.spacing === 'tight' ? 12 : theme.layout.spacing === 'relaxed' ? 20 : 16,
      backgroundColor: 'transparent', // إزالة الخلفية لأن الأعمدة لديها خلفيات
    },

    sectionTitle: {
      fontSize: theme.fonts.size.heading,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 8,
      paddingBottom: 4,
      textAlign: textAlign,
      fontFamily,
    },

    sectionContent: {
      paddingRight: direction === 'rtl' ? 0 : 10,
      paddingLeft: direction === 'rtl' ? 10 : 0,
    },

    // العناصر التفصيلية
    item: {
      marginBottom: 12,
    },

    itemHeader: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },

    itemTitle: {
      fontSize: theme.fonts.size.base + 1,
      fontWeight: 'semibold',
      color: theme.colors.text,
      textAlign: textAlign,
      fontFamily,
    },

    itemSubtitle: {
      fontSize: theme.fonts.size.base,
      fontWeight: 'medium',
      color: theme.colors.secondary,
      textAlign: textAlign,
      fontFamily,
    },

    itemDate: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.secondary,
      textAlign: direction === 'rtl' ? 'left' : 'right',
      fontFamily,
    },

    itemLocation: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.secondary,
      textAlign: textAlign,
      marginBottom: 2,
      fontFamily,
    },

    itemDescription: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.text,
      textAlign: textAlign,
      lineHeight: 1.5,
      marginTop: 4,
      fontFamily,
    },

    // المهارات
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 5,
    },

    skillItem: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: 'solid',
      borderRadius: theme.styles.borderRadius / 2,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginBottom: 4,
    },

    skillName: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.text,
      fontFamily,
    },

    skillLevel: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.secondary,
      fontFamily,
    },

    // شريط المهارة
    skillBar: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 6,
    },

    skillInfo: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 4,
    },

    skillBarLabel: {
      flex: 1,
      fontSize: theme.fonts.size.small,
      color: theme.colors.text,
      textAlign: textAlign,
      fontFamily,
    },

    skillBarContainer: {
      width: '100%',
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      marginTop: 4,
    },

    skillBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },

    // اللغات
    languageItem: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },

    languageName: {
      fontSize: theme.fonts.size.base,
      color: theme.colors.text,
      fontFamily,
    },

    languageLevel: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.secondary,
      fontFamily,
    },

    // القوائم
    list: {
      marginTop: 4,
      marginBottom: 4,
    },

    listItem: {
      flexDirection: direction === 'rtl' ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      marginBottom: 3,
    },

    listBullet: {
      fontSize: theme.fonts.size.small,
      color: theme.colors.primary,
      marginRight: direction === 'rtl' ? 0 : 5,
      marginLeft: direction === 'rtl' ? 5 : 0,
      lineHeight: 1.5,
    },

    listText: {
      flex: 1,
      fontSize: theme.fonts.size.small,
      color: theme.colors.text,
      textAlign: textAlign,
      lineHeight: 1.5,
      fontFamily,
    },

    // التخطيط ذو العمودين
    twoColumnLayout: {
      flexDirection: 'row-reverse',
      gap: 20,
    },

    leftColumn: {
      flex: 0.6,
      backgroundColor: '#ffffff', // أبيض
      borderWidth: 2,
      borderColor: '#1976d2', // أزرق غامق
      borderStyle: 'solid',
      borderRadius: 8,
      padding: 15,
    },

    rightColumn: {
      flex: 0.4,
      backgroundColor: '#e3f2fd', // أزرق فاتح
      borderWidth: 2,
      borderColor: '#1976d2', // أزرق غامق
      borderStyle: 'solid',
      borderRadius: 8,
      padding: 15,
    },

    // الهدف المهني
    objective: {
      fontSize: theme.fonts.size.base,
      color: theme.colors.text,
      textAlign: textAlign,
      lineHeight: 1.6,
      marginBottom: 15,
      fontFamily,
    },

    // التذييل
    footer: {
      marginTop: 'auto',
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderTopStyle: 'solid',
      textAlign: 'center',
    },

    footerText: {
      fontSize: theme.fonts.size.small - 1,
      color: theme.colors.secondary,
      fontFamily,
    },

    // الظلال والحدود
    shadowBox: {
      ...(theme.styles.shadowLevel !== 'none' && {
        elevation: theme.styles.shadowLevel === 'low' ? 2 : theme.styles.shadowLevel === 'medium' ? 4 : 8,
      }),
      borderRadius: theme.styles.borderRadius,
      backgroundColor: theme.colors.background,
      padding: 10,
      marginBottom: 10,
    },

    // للطباعة
    '@media print': {
      page: {
        margin: 0,
        padding: '20mm',
      },
    },
  });
};

// دالة مساعدة لحساب عرض شريط المهارة بناءً على المستوى
export const getSkillBarWidth = (level: string): string => {
  const skillLevels: Record<string, number> = {
    'beginner': 20,
    'intermediate': 40,
    'good': 60,
    'very-good': 80,
    'excellent': 100,
  };
  
  return `${skillLevels[level] || 50}%`;
};

// دالة لترجمة مستويات المهارات
export const translateSkillLevel = (level: string, language: 'ar' | 'en' = 'ar'): string => {
  const translations: Record<string, Record<string, string>> = {
    ar: {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'good': 'جيد',
      'very-good': 'جيد جداً',
      'excellent': 'ممتاز',
    },
    en: {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'good': 'Good',
      'very-good': 'Very Good',
      'excellent': 'Excellent',
    },
  };
  
  return translations[language][level] || level;
};

// دالة لترجمة مستويات اللغات
export const translateLanguageLevel = (level: string, language: 'ar' | 'en' = 'ar'): string => {
  const translations: Record<string, Record<string, string>> = {
    ar: {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'good': 'جيد',
      'very-good': 'جيد جداً',
      'fluent': 'طليق',
      'A1': 'A1 - مبتدئ',
      'A2': 'A2 - أساسي',
      'B1': 'B1 - متوسط',
      'B2': 'B2 - متوسط عالي',
      'C1': 'C1 - متقدم',
      'C2': 'C2 - إتقان',
    },
    en: {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'good': 'Good',
      'very-good': 'Very Good',
      'fluent': 'Fluent',
      'A1': 'A1 - Beginner',
      'A2': 'A2 - Elementary',
      'B1': 'B1 - Intermediate',
      'B2': 'B2 - Upper Intermediate',
      'C1': 'C1 - Advanced',
      'C2': 'C2 - Proficiency',
    },
  };
  
  return translations[language][level] || level;
};
