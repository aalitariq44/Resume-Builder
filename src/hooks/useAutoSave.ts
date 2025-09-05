'use client';

import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';

/**
 * Hook لحفظ التغييرات تلقائياً مع debounce
 * @param data البيانات المراد حفظها
 * @param delay تأخير الحفظ بالميلي ثانية (افتراضي: 1000)
 */
export const useAutoSave = (data: any, delay: number = 1000) => {
  const { autoSave, markFormDirty } = useResumeStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef(data);

  useEffect(() => {
    // مقارنة البيانات الجديدة مع القديمة
    if (JSON.stringify(data) !== JSON.stringify(dataRef.current)) {
      dataRef.current = data;
      
      // تمييز النموذج كمحتوى على تغييرات
      markFormDirty();
      
      // إلغاء الحفظ السابق
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // جدولة حفظ جديد
      timeoutRef.current = setTimeout(() => {
        autoSave();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, autoSave, markFormDirty]);

  // حفظ فوري عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        autoSave();
      }
    };
  }, [autoSave]);
};

/**
 * Hook لحفظ البيانات عند التنقل بين الصفحات
 */
export const useAutoSaveOnNavigation = () => {
  const { autoSave } = useResumeStore();

  useEffect(() => {
    const handleBeforeUnload = () => {
      autoSave();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        autoSave();
      }
    };

    // حفظ عند إغلاق النافذة أو إعادة التحميل
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // حفظ عند تغيير حالة الرؤية (التبديل بين التبويبات)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoSave]);
};

/**
 * Hook لحفظ تلقائي دوري
 * @param interval فترة الحفظ بالميلي ثانية (افتراضي: 30 ثانية)
 */
export const usePeriodicAutoSave = (interval: number = 30000) => {
  const { autoSave, getSaveStatus } = useResumeStore();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const status = getSaveStatus();
      if (status.isDirty) {
        autoSave();
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [autoSave, getSaveStatus, interval]);
};
