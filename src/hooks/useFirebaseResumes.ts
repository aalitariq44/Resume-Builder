import { useState, useEffect, useCallback } from 'react';
import { ResumeService, ResumeMetadata } from '@/lib/firestore';
import { Resume, PersonalInfo, Education, Experience, Skill, Language, Hobby, Course, Reference, Achievement, CustomSection } from '@/types';
import { useResumeStore } from '@/store/resumeStore';
import { toast } from 'sonner';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Hook لإدارة السير الذاتية مع Firebase
export const useFirebaseResumes = (userId?: string) => {
  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // جلب جميع السير الذاتية للمستخدم
  const fetchResumes = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const userResumes = await ResumeService.getUserResumes(userId);
      setResumes(userResumes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب السير الذاتية';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // جلب سيرة ذاتية واحدة
  const fetchResume = useCallback(async (resumeId: string) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const resume = await ResumeService.getResume(resumeId, userId);
      setCurrentResume(resume);
      return resume;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب السيرة الذاتية';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // الاستماع إلى تغييرات سيرة ذاتية واحدة في real-time
  const subscribeToResume = useCallback((resumeId: string) => {
    if (!userId) return;

    // إلغاء الاشتراك السابق إذا كان موجوداً
    if (unsubscribe) {
      unsubscribe();
    }

    const resumeRef = doc(db, 'resumes', resumeId);
    
    const unsubscribeFn = onSnapshot(
      resumeRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          
          // التحقق من الصلاحية
          if (data.userId !== userId) {
            setError('غير مسموح بعرض هذه السيرة الذاتية');
            return;
          }

          // تحويل البيانات من FirestoreResume إلى Resume
          const { userId: _, createdAt, updatedAt, ...resumeData } = data;
          const resume: Resume = {
            ...resumeData,
            id: docSnapshot.id,
            createdAt: createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
          };

          setCurrentResume(resume);
          setError(null);
        } else {
          setCurrentResume(null);
          setError('السيرة الذاتية غير موجودة');
        }
      },
      (error) => {
        console.error('خطأ في الاستماع للتغييرات:', error);
        setError('خطأ في تحديث البيانات');
      }
    );

    setUnsubscribe(() => unsubscribeFn);
  }, [userId, unsubscribe]);

  // إنشاء سيرة ذاتية جديدة
  const createResume = useCallback(async (resumeData: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) throw new Error('المستخدم غير مسجل الدخول');

    try {
      setSaving(true);
      setError(null);
      const resumeId = await ResumeService.createResume(resumeData, userId);
      toast.success('تم إنشاء السيرة الذاتية بنجاح');
      
      // تحديث قائمة السير الذاتية
      await fetchResumes();
      
      return resumeId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في إنشاء السيرة الذاتية';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [userId, fetchResumes]);

  // تحديث سيرة ذاتية
  const updateResume = useCallback(async (resumeId: string, updates: Partial<Resume>) => {
    if (!userId) throw new Error('المستخدم غير مسجل الدخول');

    try {
      setSaving(true);
      setError(null);
      await ResumeService.updateResume(resumeId, updates, userId);
      
      // تحديث الحالة المحلية
      if (currentResume && currentResume.id === resumeId) {
        setCurrentResume({ ...currentResume, ...updates });
      }
      
      // تحديث قائمة السير الذاتية
      await fetchResumes();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في تحديث السيرة الذاتية';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [userId, currentResume, fetchResumes]);

  // حذف سيرة ذاتية
  const deleteResume = useCallback(async (resumeId: string) => {
    if (!userId) throw new Error('المستخدم غير مسجل الدخول');

    try {
      setLoading(true);
      setError(null);
      await ResumeService.deleteResume(resumeId, userId);
      toast.success('تم حذف السيرة الذاتية بنجاح');
      
      // تحديث قائمة السير الذاتية
      await fetchResumes();
      
      // مسح السيرة الحالية إذا كانت محذوفة
      if (currentResume && currentResume.id === resumeId) {
        setCurrentResume(null);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حذف السيرة الذاتية';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, currentResume, fetchResumes]);

  // نسخ سيرة ذاتية
  const duplicateResume = useCallback(async (resumeId: string, newTitle?: string) => {
    if (!userId) throw new Error('المستخدم غير مسجل الدخول');

    try {
      setSaving(true);
      setError(null);
      const newResumeId = await ResumeService.duplicateResume(resumeId, userId, newTitle);
      toast.success('تم نسخ السيرة الذاتية بنجاح');
      
      // تحديث قائمة السير الذاتية
      await fetchResumes();
      
      return newResumeId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في نسخ السيرة الذاتية';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [userId, fetchResumes]);

  // Load resumes on mount
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // تنظيف الـ listener عند الخروج
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  return {
    resumes,
    currentResume,
    loading,
    error,
    saving,
    fetchResumes,
    fetchResume,
    subscribeToResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    setCurrentResume
  };
};

// Hook للحفظ التلقائي مع Firebase
export const useAutoSaveFirebase = (resumeId?: string, userId?: string) => {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // حفظ المعلومات الشخصية
  const savePersonalInfo = useCallback(async (personalInfo: PersonalInfo) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.savePersonalInfo(resumeId, userId, personalInfo);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ المعلومات الشخصية';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ التعليم
  const saveEducation = useCallback(async (education: Education[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveEducation(resumeId, userId, education);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ التعليم';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ الخبرات
  const saveExperience = useCallback(async (experience: Experience[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveExperience(resumeId, userId, experience);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ الخبرات';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ المهارات
  const saveSkills = useCallback(async (skills: Skill[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveSkills(resumeId, userId, skills);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ المهارات';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ اللغات
  const saveLanguages = useCallback(async (languages: Language[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveLanguages(resumeId, userId, languages);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ اللغات';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ الهوايات
  const saveHobbies = useCallback(async (hobbies: Hobby[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveHobbies(resumeId, userId, hobbies);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ الهوايات';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ الدورات
  const saveCourses = useCallback(async (courses: Course[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveCourses(resumeId, userId, courses);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ الدورات';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ المراجع
  const saveReferences = useCallback(async (references: Reference[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveReferences(resumeId, userId, references);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ المراجع';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ الإنجازات
  const saveAchievements = useCallback(async (achievements: Achievement[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveAchievements(resumeId, userId, achievements);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ الإنجازات';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ الأقسام المخصصة
  const saveCustomSections = useCallback(async (customSections: CustomSection[]) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveCustomSections(resumeId, userId, customSections);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في حفظ الأقسام المخصصة';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  // حفظ متعدد
  const saveBatch = useCallback(async (sections: Record<string, any>) => {
    if (!resumeId || !userId) return;

    try {
      setSaving(true);
      setError(null);
      await ResumeService.saveBatch(resumeId, userId, sections);
      setLastSaved(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في الحفظ';
      setError(errorMessage);
      console.error('Auto-save error:', err);
    } finally {
      setSaving(false);
    }
  }, [resumeId, userId]);

  return {
    saving,
    lastSaved,
    error,
    savePersonalInfo,
    saveEducation,
    saveExperience,
    saveSkills,
    saveLanguages,
    saveHobbies,
    saveCourses,
    saveReferences,
    saveAchievements,
    saveCustomSections,
    saveBatch
  };
};
