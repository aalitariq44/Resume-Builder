import { create } from 'zustand';
import { ResumeService, ResumeMetadata } from '@/lib/firestore';
import { Resume } from '@/types';
import { useAuthStore } from './authStore';

interface ResumesManagerStore {
  // الحالة
  resumes: ResumeMetadata[];
  currentResume: Resume | null;
  currentResumeId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // الأفعال
  setResumes: (resumes: ResumeMetadata[]) => void;
  setCurrentResume: (resume: Resume | null) => void;
  setCurrentResumeId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // دوال إدارة السير الذاتية
  loadUserResumes: () => Promise<void>;
  createNewResume: (title: string) => Promise<string | null>;
  loadResume: (resumeId: string) => Promise<Resume | null>;
  updateResume: (resumeId: string, updates: Partial<Resume>) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  duplicateResume: (resumeId: string, newTitle?: string) => Promise<string | null>;
  
  // دوال مساعدة
  refreshResumes: () => Promise<void>;
  selectResume: (resumeId: string) => Promise<void>;
}

export const useResumesManagerStore = create<ResumesManagerStore>((set, get) => ({
  // الحالة الأولية
  resumes: [],
  currentResume: null,
  currentResumeId: null,
  isLoading: false,
  error: null,

  // الأفعال الأساسية
  setResumes: (resumes) => set({ resumes }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  setCurrentResumeId: (id) => set({ currentResumeId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // تحميل جميع السير الذاتية للمستخدم
  loadUserResumes: async () => {
    const authStore = useAuthStore.getState();
    if (!authStore.user) {
      set({ error: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const resumes = await ResumeService.getUserResumes(authStore.user.uid);
      set({ resumes, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'فشل في تحميل السير الذاتية',
        isLoading: false 
      });
    }
  },

  // إنشاء سيرة ذاتية جديدة
  createNewResume: async (title: string) => {
    const authStore = useAuthStore.getState();
    if (!authStore.user) {
      set({ error: 'يجب تسجيل الدخول أولاً' });
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      // إنشاء سيرة ذاتية فارغة
      const newResume = {
        title,
        personalInfo: {
          id: crypto.randomUUID(),
          firstName: '',
          lastName: '',
          jobTitle: '',
          email: authStore.user.email || '',
          phone: '',
          address: '',
          city: '',
          customFields: []
        },
        education: [],
        experience: [],
        skills: [],
        languages: [],
        hobbies: [],
        courses: [],
        references: [],
        achievements: [],
        customSections: [],
        template: 'classic',
        theme: {
          id: 'default',
          name: 'الافتراضي',
          colors: {
            primary: '#3b82f6',
            secondary: '#6b7280',
            text: '#1f2937',
            background: '#ffffff',
            border: '#e5e7eb'
          },
          fonts: {
            heading: 'Cairo',
            body: 'Cairo',
            size: { base: 14, heading: 18, small: 12 }
          },
          layout: {
            columns: 1,
            spacing: 'normal' as const,
            margins: { top: 20, right: 20, bottom: 20, left: 20 }
          },
          styles: {
            borderRadius: 8,
            shadowLevel: 'low' as const,
            headerStyle: 'minimal' as const
          }
        },
        sectionOrder: [
          'personalInfo', 'objective', 'experience', 'education',
          'skills', 'languages', 'courses', 'achievements', 'hobbies', 'references'
        ],
        hiddenSections: [],
        language: 'ar' as const
      };

      const resumeId = await ResumeService.createResume(newResume, authStore.user.uid);
      
      // تحديث قائمة السير الذاتية
      await get().refreshResumes();
      
      set({ isLoading: false });
      return resumeId;
    } catch (error: any) {
      set({ 
        error: error.message || 'فشل في إنشاء السيرة الذاتية',
        isLoading: false 
      });
      return null;
    }
  },

  // تحميل سيرة ذاتية محددة
  loadResume: async (resumeId: string) => {
    const authStore = useAuthStore.getState();
    if (!authStore.user) {
      set({ error: 'يجب تسجيل الدخول أولاً' });
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const resume = await ResumeService.getResume(resumeId, authStore.user.uid);
      set({ currentResume: resume, currentResumeId: resumeId, isLoading: false });
      return resume;
    } catch (error: any) {
      console.error('خطأ في تحميل السيرة الذاتية:', error);
      
      // التحقق من خطأ السيرة الذاتية غير موجودة
      if (error.message?.includes('السيرة الذاتية غير موجودة')) {
        set({ 
          currentResume: null, 
          currentResumeId: null, 
          error: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
          isLoading: false 
        });
        return null;
      }
      
      set({ 
        error: error.message || 'فشل في تحميل السيرة الذاتية',
        isLoading: false 
      });
      return null;
    }
  },

  // تحديث سيرة ذاتية
  updateResume: async (resumeId: string, updates: Partial<Resume>) => {
    const authStore = useAuthStore.getState();
    if (!authStore.user) {
      set({ error: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    try {
      await ResumeService.updateResume(resumeId, updates, authStore.user.uid);
      
      // تحديث السيرة الذاتية الحالية إذا كانت هي نفسها
      const state = get();
      if (state.currentResumeId === resumeId && state.currentResume) {
        set({
          currentResume: { ...state.currentResume, ...updates }
        });
      }
      
      // تحديث قائمة السير الذاتية
      await get().refreshResumes();
    } catch (error: any) {
      console.error('خطأ في تحديث السيرة الذاتية:', error);
      
      // التحقق من خطأ السيرة الذاتية غير موجودة
      if (error.message?.includes('السيرة الذاتية غير موجودة')) {
        set({ 
          currentResume: null, 
          currentResumeId: null, 
          error: 'السيرة الذاتية غير موجودة - تم مسح المعرف' 
        });
        return;
      }
      
      set({ error: error.message || 'فشل في تحديث السيرة الذاتية' });
    }
  },

  // حذف سيرة ذاتية
  deleteResume: async (resumeId: string) => {
    const authStore = useAuthStore.getState();
    if (!authStore.user) {
      set({ error: 'يجب تسجيل الدخول أولاً' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await ResumeService.deleteResume(resumeId, authStore.user.uid);
      
      // إذا كانت السيرة المحذوفة هي الحالية، امسحها
      const state = get();
      if (state.currentResumeId === resumeId) {
        set({ currentResume: null, currentResumeId: null });
      }
      
      // تحديث قائمة السير الذاتية
      await get().refreshResumes();
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error('خطأ في حذف السيرة الذاتية:', error);
      
      // التحقق من خطأ السيرة الذاتية غير موجودة
      if (error.message?.includes('السيرة الذاتية غير موجودة')) {
        set({ 
          currentResume: null, 
          currentResumeId: null, 
          error: 'السيرة الذاتية غير موجودة بالفعل',
          isLoading: false 
        });
        return;
      }
      
      set({ 
        error: error.message || 'فشل في حذف السيرة الذاتية',
        isLoading: false 
      });
    }
  },

  // نسخ سيرة ذاتية
  duplicateResume: async (resumeId: string, newTitle?: string) => {
    const authStore = useAuthStore.getState();
    if (!authStore.user) {
      set({ error: 'يجب تسجيل الدخول أولاً' });
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const newResumeId = await ResumeService.duplicateResume(
        resumeId, 
        authStore.user.uid, 
        newTitle
      );
      
      // تحديث قائمة السير الذاتية
      await get().refreshResumes();
      
      set({ isLoading: false });
      return newResumeId;
    } catch (error: any) {
      console.error('خطأ في نسخ السيرة الذاتية:', error);
      
      // التحقق من خطأ السيرة الذاتية غير موجودة
      if (error.message?.includes('السيرة الذاتية غير موجودة')) {
        set({ 
          currentResume: null, 
          currentResumeId: null, 
          error: 'السيرة الذاتية الأصلية غير موجودة - تم مسح المعرف',
          isLoading: false 
        });
        return null;
      }
      
      set({ 
        error: error.message || 'فشل في نسخ السيرة الذاتية',
        isLoading: false 
      });
      return null;
    }
  },

  // تحديث قائمة السير الذاتية
  refreshResumes: async () => {
    await get().loadUserResumes();
  },

  // اختيار سيرة ذاتية للعمل عليها
  selectResume: async (resumeId: string) => {
    await get().loadResume(resumeId);
  }
}));
