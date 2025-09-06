import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeService } from '@/lib/firestore';
import { Resume, PersonalInfo, Education, Experience, Skill, Language, Hobby, Course, Reference, Achievement, CustomSection } from '@/types';
import { useAuthStore } from './authStore';

interface FirebaseStore {
  // الحالة
  currentResumeId: string | null;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingChanges: Record<string, any>;
  syncError: string | null;

  // الأفعال
  setCurrentResumeId: (resumeId: string | null) => void;
  setIsOnline: (isOnline: boolean) => void;
  setIsSyncing: (isSyncing: boolean) => void;
  setSyncError: (error: string | null) => void;
  
  // حفظ الأقسام في Firebase - يستخدم معرف المستخدم من AuthStore
  savePersonalInfoToFirebase: (personalInfo: PersonalInfo) => Promise<void>;
  saveEducationToFirebase: (education: Education[]) => Promise<void>;
  saveExperienceToFirebase: (experience: Experience[]) => Promise<void>;
  saveSkillsToFirebase: (skills: Skill[]) => Promise<void>;
  saveLanguagesToFirebase: (languages: Language[]) => Promise<void>;
  saveHobbiesToFirebase: (hobbies: Hobby[]) => Promise<void>;
  saveCoursesToFirebase: (courses: Course[]) => Promise<void>;
  saveReferencesToFirebase: (references: Reference[]) => Promise<void>;
  saveAchievementsToFirebase: (achievements: Achievement[]) => Promise<void>;
  saveCustomSectionsToFirebase: (customSections: CustomSection[]) => Promise<void>;
  
  // دوال المساعدة
  addPendingChange: (section: string, data: any) => void;
  removePendingChange: (section: string) => void;
  syncPendingChanges: () => Promise<void>;
  handleStepChange: (step: number) => Promise<void>;
}

export const useFirebaseStore = create<FirebaseStore>()(
  persist(
    (set, get) => ({
      // الحالة الأولية
      currentResumeId: null,
      isOnline: true,
      isSyncing: false,
      lastSyncTime: null,
      pendingChanges: {},
      syncError: null,

      // الأفعال الأساسية
      setCurrentResumeId: (resumeId) => set({ currentResumeId: resumeId }),
      setIsOnline: (isOnline) => set({ isOnline }),
      setIsSyncing: (isSyncing) => set({ isSyncing }),
      setSyncError: (error) => set({ syncError: error }),

      // حفظ المعلومات الشخصية
      savePersonalInfoToFirebase: async (personalInfo: PersonalInfo) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) {
          console.warn('معرف السيرة الذاتية أو المستخدم مفقود');
          return;
        }

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.savePersonalInfo(state.currentResumeId, authStore.user.uid, personalInfo);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('personalInfo');
        } catch (error: any) {
          console.error('خطأ في حفظ المعلومات الشخصية:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('personalInfo');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ المعلومات الشخصية',
            isSyncing: false 
          });
          get().addPendingChange('personalInfo', personalInfo);
        }
      },

      // حفظ التعليم
      saveEducationToFirebase: async (education: Education[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveEducation(state.currentResumeId, authStore.user.uid, education);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('education');
        } catch (error: any) {
          console.error('خطأ في حفظ التعليم:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('education');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ التعليم',
            isSyncing: false 
          });
          get().addPendingChange('education', education);
        }
      },

      // حفظ الخبرات
      saveExperienceToFirebase: async (experience: Experience[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveExperience(state.currentResumeId, authStore.user.uid, experience);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('experience');
        } catch (error: any) {
          console.error('خطأ في حفظ الخبرات:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('experience');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ الخبرات',
            isSyncing: false 
          });
          get().addPendingChange('experience', experience);
        }
      },

      // حفظ المهارات
      saveSkillsToFirebase: async (skills: Skill[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveSkills(state.currentResumeId, authStore.user.uid, skills);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('skills');
        } catch (error: any) {
          console.error('خطأ في حفظ المهارات:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('skills');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ المهارات',
            isSyncing: false 
          });
          get().addPendingChange('skills', skills);
        }
      },

      // حفظ اللغات
      saveLanguagesToFirebase: async (languages: Language[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveLanguages(state.currentResumeId, authStore.user.uid, languages);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('languages');
        } catch (error: any) {
          console.error('خطأ في حفظ اللغات:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('languages');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ اللغات',
            isSyncing: false 
          });
          get().addPendingChange('languages', languages);
        }
      },

      // حفظ الهوايات
      saveHobbiesToFirebase: async (hobbies: Hobby[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveHobbies(state.currentResumeId, authStore.user.uid, hobbies);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('hobbies');
        } catch (error: any) {
          console.error('خطأ في حفظ الهوايات:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('hobbies');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ الهوايات',
            isSyncing: false 
          });
          get().addPendingChange('hobbies', hobbies);
        }
      },

      // حفظ الدورات
      saveCoursesToFirebase: async (courses: Course[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveCourses(state.currentResumeId, authStore.user.uid, courses);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('courses');
        } catch (error: any) {
          console.error('خطأ في حفظ الدورات:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('courses');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ الدورات',
            isSyncing: false 
          });
          get().addPendingChange('courses', courses);
        }
      },

      // حفظ المراجع
      saveReferencesToFirebase: async (references: Reference[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveReferences(state.currentResumeId, authStore.user.uid, references);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('references');
        } catch (error: any) {
          console.error('خطأ في حفظ المراجع:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('references');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ المراجع',
            isSyncing: false 
          });
          get().addPendingChange('references', references);
        }
      },

      // حفظ الإنجازات
      saveAchievementsToFirebase: async (achievements: Achievement[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveAchievements(state.currentResumeId, authStore.user.uid, achievements);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('achievements');
        } catch (error: any) {
          console.error('خطأ في حفظ الإنجازات:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('achievements');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ الإنجازات',
            isSyncing: false 
          });
          get().addPendingChange('achievements', achievements);
        }
      },

      // حفظ الأقسام المخصصة
      saveCustomSectionsToFirebase: async (customSections: CustomSection[]) => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user) return;

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveCustomSections(state.currentResumeId, authStore.user.uid, customSections);
          set({ 
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          get().removePendingChange('customSections');
        } catch (error: any) {
          console.error('خطأ في حفظ الأقسام المخصصة:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف',
              isSyncing: false 
            });
            get().removePendingChange('customSections');
            return;
          }
          
          set({ 
            syncError: 'فشل في حفظ الأقسام المخصصة',
            isSyncing: false 
          });
          get().addPendingChange('customSections', customSections);
        }
      },

      // إضافة تغيير للانتظار
      addPendingChange: (section: string, data: any) => {
        const state = get();
        set({
          pendingChanges: {
            ...state.pendingChanges,
            [section]: data
          }
        });
      },

      // إزالة تغيير من الانتظار
      removePendingChange: (section: string) => {
        const state = get();
        const newPendingChanges = { ...state.pendingChanges };
        delete newPendingChanges[section];
        set({ pendingChanges: newPendingChanges });
      },

      // مزامنة التغييرات المعلقة
      syncPendingChanges: async () => {
        const state = get();
        const authStore = useAuthStore.getState();
        
        if (!state.currentResumeId || !authStore.user || Object.keys(state.pendingChanges).length === 0) {
          return;
        }

        try {
          set({ isSyncing: true, syncError: null });
          await ResumeService.saveBatch(state.currentResumeId, authStore.user.uid, state.pendingChanges);
          set({ 
            pendingChanges: {},
            lastSyncTime: new Date().toISOString(),
            isSyncing: false 
          });
          console.log('تم مزامنة التغييرات المعلقة بنجاح');
        } catch (error: any) {
          console.error('خطأ في مزامنة التغييرات المعلقة:', error);
          
          // التحقق من خطأ السيرة الذاتية غير موجودة
          if (error.message?.includes('السيرة الذاتية غير موجودة')) {
            set({ 
              currentResumeId: null,
              pendingChanges: {},
              syncError: 'السيرة الذاتية غير موجودة - تم مسح المعرف والتغييرات المعلقة',
              isSyncing: false 
            });
            return;
          }
          
          set({ 
            syncError: 'فشل في المزامنة',
            isSyncing: false 
          });
        }
      },

      // التعامل مع تغيير الخطوة
      handleStepChange: async (step: number) => {
        const state = get();
        
        // حفظ التغييرات المعلقة قبل الانتقال للخطوة التالية
        if (Object.keys(state.pendingChanges).length > 0) {
          await get().syncPendingChanges();
        }
        
        console.log(`تم الانتقال للخطوة: ${step}`);
      }
    }),
    {
      name: 'firebase-store',
      partialize: (state) => ({
        currentResumeId: state.currentResumeId,
        pendingChanges: state.pendingChanges,
        lastSyncTime: state.lastSyncTime
      })
    }
  )
);
