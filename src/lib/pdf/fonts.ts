import { Font } from '@react-pdf/renderer';

// تسجيل الخطوط العربية
export const registerFonts = () => {
  try {
    // تسجيل خط Cairo
    Font.register({
      family: 'Cairo',
      fonts: [
        {
          src: '/fonts/Cairo-Regular.ttf',
          fontWeight: 'normal',
        },
        {
          src: '/fonts/Cairo-Medium.ttf',
          fontWeight: 'medium',
        },
        {
          src: '/fonts/Cairo-SemiBold.ttf',
          fontWeight: 'semibold',
        },
        {
          src: '/fonts/Cairo-Bold.ttf',
          fontWeight: 'bold',
        },
        {
          src: '/fonts/Cairo-ExtraBold.ttf',
          fontWeight: 800,
        },
        {
          src: '/fonts/Cairo-Black.ttf',
          fontWeight: 900,
        },
      ],
    });

    // تسجيل خط احتياطي للإنجليزية
    Font.register({
      family: 'Inter',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
          fontWeight: 'normal',
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2',
          fontWeight: 'medium',
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
          fontWeight: 'semibold',
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
          fontWeight: 'bold',
        },
      ],
    });

    console.log('تم تسجيل الخطوط بنجاح');
  } catch (error) {
    console.error('خطأ في تسجيل الخطوط:', error);
  }
};

// تحديد الخط بناءً على اللغة
export const getFontFamily = (language: 'ar' | 'en' = 'ar'): string => {
  return language === 'ar' ? 'Cairo' : 'Inter';
};

// تحديد اتجاه النص
export const getTextDirection = (language: 'ar' | 'en' = 'ar'): 'rtl' | 'ltr' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

// تحديد محاذاة النص
export const getTextAlign = (language: 'ar' | 'en' = 'ar'): 'right' | 'left' | 'center' => {
  return language === 'ar' ? 'right' : 'left';
};
