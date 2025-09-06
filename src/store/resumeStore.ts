import { create } from 'zustand';
import { Resume, FormData, Template, ResumeTheme, AppState, PersonalInfo, Education, Experience, Skill, Language, Hobby, Course, Reference, Achievement, CustomSection } from '@/types';
import { generateId } from '@/lib/utils';
import { useFirebaseStore } from './firebaseStore';
import { useAuthStore } from './authStore';
import { ResumeService } from '@/lib/firestore';

// إنشاء قيم افتراضية
const createDefaultPersonalInfo = (): PersonalInfo => ({
  id: generateId(),
  firstName: '',
  lastName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  customFields: []
});

const createDefaultResume = (): Resume => ({
  id: generateId(),
  title: 'سيرة ذاتية جديدة',
  personalInfo: createDefaultPersonalInfo(),
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
      size: {
        base: 12,
        heading: 16,
        small: 10
      }
    },
    layout: {
      columns: 1,
      spacing: 'normal',
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    },
    styles: {
      borderRadius: 8,
      shadowLevel: 'low',
      headerStyle: 'minimal'
    }
  },
  sectionOrder: [
    'personalInfo',
    'objective',
    'experience',
    'education',
    'skills',
    'languages',
    'courses',
    'achievements',
    'hobbies',
    'references'
  ],
  hiddenSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  language: 'ar'
});

const createDefaultFormData = (): FormData => ({
  currentStep: 0,
  totalSteps: 8,
  data: createDefaultResume(),
  errors: {},
  isDirty: false
});

interface ResumeStore extends AppState {
  // Actions for Resume
  setResume: (resume: Resume) => void;
  updateResume: (updates: Partial<Resume>) => void;
  resetResume: () => void;
  // Hydration from Firebase
  hydrateFromResume: (resume: Resume) => void;
  
  // Actions for Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addCustomField: () => void;
  updateCustomField: (id: string, updates: any) => void;
  removeCustomField: (id: string) => void;
  
  // Actions for Education
  education: Education[];
  setEducation: (education: Education[]) => void;
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (startIndex: number, endIndex: number) => void;
  
  // Actions for Experience
  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (startIndex: number, endIndex: number) => void;
  setExperience: (experience: Experience[]) => void;
  
  // Actions for Skills
  addSkill: () => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;
  setSkills: (skills: Skill[]) => void;
  
  // Actions for Languages
  addLanguage: () => void;
  updateLanguage: (id: string, updates: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  
  // Actions for Hobbies
  addHobby: (initialData?: Partial<Hobby>) => void;
  updateHobby: (id: string, updates: Partial<Hobby>) => void;
  removeHobby: (id: string) => void;
  
  // Actions for Courses
  addCourse: () => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  
  // Actions for References
  addReference: () => void;
  updateReference: (id: string, updates: Partial<Reference>) => void;
  removeReference: (id: string) => void;
  
  // Actions for Achievements
  addAchievement: () => void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;
  
  // Actions for Custom Sections
  addCustomSection: () => void;
  updateCustomSection: (id: string, updates: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  
  // Actions for Form
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setFormError: (field: string, errors: string[]) => void;
  clearFormErrors: () => void;
  markFormDirty: () => void;
  markFormClean: () => void;
  
  // Actions for Templates
  setTemplates: (templates: Template[]) => void;
  setCurrentTemplate: (template: Template | null) => void;
  
  // Actions for Theme
  updateTheme: (theme: Partial<ResumeTheme>) => void;
  
  // Actions for Sections
  toggleSection: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  
  // Actions for App State
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLanguage: (language: 'ar' | 'en') => void;
  setDirection: (direction: 'rtl' | 'ltr') => void;
  setAppTheme: (theme: 'light' | 'dark') => void;
  
  // Utility Actions
  autoSave: () => void;
  restoreFromBackup: () => boolean;
  getSaveStatus: () => { isDirty: boolean; lastSaved?: string; hasUnsavedChanges: boolean };
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

// Helper function to reorder arrays
const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  if (list.length === 0 || startIndex < 0 || startIndex >= list.length || endIndex < 0 || endIndex >= list.length) {
    return list;
  }
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// موازنة بسيطة لمقارنة عمق الكائنات لتجنب تحديثات غير ضرورية (تكفي لحالتنا هنا)
const deepEqual = (a: any, b: any): boolean => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
};

export const useResumeStore = create<ResumeStore>()((set, get) => ({
  // Initial State
  resume: null,
  formData: createDefaultFormData(),
  templates: [],
  currentTemplate: null,
  isLoading: false,
  error: null,
  language: 'ar',
  direction: 'rtl',
  theme: 'light',
  education: [],

  // Resume Actions
  setResume: (resume) => set({ resume }),
  
  updateResume: (updates) => set((state) => ({
    resume: state.resume ? { ...state.resume, ...updates, updatedAt: new Date().toISOString() } : null,
    formData: {
      ...state.formData,
      data: { ...state.formData.data, ...updates, updatedAt: new Date().toISOString() },
      isDirty: true
    }
  })),
  
  resetResume: () => set({
    resume: createDefaultResume(),
    formData: createDefaultFormData()
  }),

  // Hydration from Firebase (used when loading an existing resume)
  hydrateFromResume: (resume) => set((state) => ({
    resume,
    formData: {
      ...state.formData,
      data: resume,
      isDirty: false,
      lastSaved: new Date().toISOString()
    },
    education: resume.education || []
  })),

  // Personal Info Actions
  updatePersonalInfo: (info) => {
    const state = get();
    const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
    const updatedPersonalInfo = { ...currentPersonalInfo, ...info };
    // لا تحدّث الحالة إن لم تتغير القيم فعلاً لتجنب حلقات إعادة التهيئة
    if (deepEqual(currentPersonalInfo, updatedPersonalInfo)) {
      return;
    }
    set({
      formData: {
        ...state.formData,
        data: {
          ...state.formData.data,
          personalInfo: updatedPersonalInfo,
          updatedAt: new Date().toISOString()
        },
        isDirty: true,
        lastSaved: new Date().toISOString()
      },
      resume: state.resume ? {
        ...state.resume,
        personalInfo: updatedPersonalInfo,
        updatedAt: new Date().toISOString()
      } : null
    });
    
  // لا نحفظ مباشرة في Firebase هنا لتقليل عدد العمليات؛ سيتم الحفظ عند التنقل بين الخطوات
  },

  addCustomField: () => {
    const state = get();
    const newField = {
      id: generateId(),
      label: 'حقل جديد',
      value: '',
      type: 'text' as const
    };
    const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
    const updatedFields = [...(currentPersonalInfo.customFields || []), newField];
    const updatedPersonalInfo = {
      ...currentPersonalInfo,
      customFields: updatedFields
    };
    
    set({
      formData: {
        ...state.formData,
        data: {
          ...state.formData.data,
          personalInfo: updatedPersonalInfo
        },
        isDirty: true,
        lastSaved: new Date().toISOString()
      }
    });
    
  // سيتم الحفظ عند الضغط على التالي/السابق
  },

  updateCustomField: (id, updates) => {
    const state = get();
    const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
    const updatedFields = (currentPersonalInfo.customFields || []).map(field =>
      field.id === id ? { ...field, ...updates } : field
    );
    const updatedPersonalInfo = {
      ...currentPersonalInfo,
      customFields: updatedFields
    };
    
    set({
      formData: {
        ...state.formData,
        data: {
          ...state.formData.data,
          personalInfo: updatedPersonalInfo
        },
        isDirty: true,
        lastSaved: new Date().toISOString()
      }
    });
    
  // سيتم الحفظ عند الضغط على التالي/السابق
  },

  removeCustomField: (id) => {
    const state = get();
    const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
    const updatedFields = (currentPersonalInfo.customFields || []).filter(field => field.id !== id);
    const updatedPersonalInfo = {
      ...currentPersonalInfo,
      customFields: updatedFields
    };
    
    set({
      formData: {
        ...state.formData,
        data: {
          ...state.formData.data,
          personalInfo: updatedPersonalInfo
        },
        isDirty: true,
        lastSaved: new Date().toISOString()
      }
    });
    
  // سيتم الحفظ عند الضغط على التالي/السابق
  },

      // Education Actions
      setEducation: (education) => {
        // لا تحدث إذا لم تتغير البيانات فعلاً
        const current = get().formData.data.education || [];
        if (deepEqual(current, education)) {
          return;
        }
        
        // تحديث البيانات في education و formData
        set((state) => ({
          education: education,
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              education: education,
              updatedAt: new Date().toISOString()
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        }));
      },
      
      // Experience Actions
      setExperience: (experience: Experience[]) => {
        const current = get().formData.data.experience || [];
        if (deepEqual(current, experience)) {
          return;
        }
        set({ 
          formData: {
            ...get().formData,
            data: {
              ...get().formData.data,
              experience: experience
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        
  // سيتم الحفظ عند الضغط على التالي/السابق
      },
      
      addEducation: () => {
        const state = get();
        const newEducation: Education = {
          id: generateId(),
          degree: '',
          field: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          startYear: '',
          startMonth: '',
          endYear: '',
          endMonth: '',
          isCurrentlyStudying: false,
          gpa: '',
          coursework: '',
          achievements: []
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              education: [...(state.formData.data.education || []), newEducation]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateEducation: (id, updates) => {
        const state = get();
        const updatedEducation = (state.formData.data.education || []).map(edu =>
          edu.id === id ? { ...edu, ...updates } : edu
        );
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              education: updatedEducation
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        
  // سيتم الحفظ عند الضغط على التالي/السابق
        
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeEducation: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              education: (state.formData.data.education || []).filter(edu => edu.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      reorderEducation: (startIndex, endIndex) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              education: reorder(state.formData.data.education || [], startIndex, endIndex)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // Experience Actions
      addExperience: () => {
        const state = get();
        const newExperience: Experience = {
          id: generateId(),
          jobTitle: '',
          position: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrentJob: false,
          isCurrentlyWorking: false,
          employmentType: 'full-time',
          responsibilities: [],
          achievements: [],
          skills: []
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              experience: [...(state.formData.data.experience || []), newExperience]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateExperience: (id, updates) => {
        const state = get();
        const updatedExperience = (state.formData.data.experience || []).map(exp =>
          exp.id === id ? { ...exp, ...updates } : exp
        );
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              experience: updatedExperience
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        
  // سيتم الحفظ عند الضغط على التالي/السابق
        
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeExperience: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              experience: (state.formData.data.experience || []).filter(exp => exp.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      reorderExperience: (startIndex, endIndex) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              experience: reorder(state.formData.data.experience || [], startIndex, endIndex)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // Skills Actions
      addSkill: () => {
        const state = get();
        const newSkill: Skill = {
          id: generateId(),
          name: '',
          level: 'intermediate',
          category: 'technical'
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              skills: [...(state.formData.data.skills || []), newSkill]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateSkill: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              skills: (state.formData.data.skills || []).map(skill =>
                skill.id === id ? { ...skill, ...updates } : skill
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeSkill: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              skills: (state.formData.data.skills || []).filter(skill => skill.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      reorderSkills: (startIndex, endIndex) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              skills: reorder(state.formData.data.skills || [], startIndex, endIndex)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      setSkills: (skills: Skill[]) => {
        const current = get().formData.data.skills || [];
        if (deepEqual(current, skills)) {
          return;
        }
        set({ 
          formData: {
            ...get().formData,
            data: {
              ...get().formData.data,
              skills: skills
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        
  // سيتم الحفظ عند الضغط على التالي/السابق
      },

      // Languages Actions
      addLanguage: () => {
        const state = get();
        const newLanguage: Language = {
          id: generateId(),
          name: '',
          level: 'intermediate'
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              languages: [...(state.formData.data.languages || []), newLanguage]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateLanguage: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              languages: (state.formData.data.languages || []).map(lang =>
                lang.id === id ? { ...lang, ...updates } : lang
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeLanguage: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              languages: (state.formData.data.languages || []).filter(lang => lang.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // Hobbies Actions
      addHobby: (initialData = {}) => {
        const state = get();
        const newHobby: Hobby = {
          id: generateId(),
          name: '',
          level: 'hobby',
          ...initialData
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              hobbies: [...(state.formData.data.hobbies || []), newHobby]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateHobby: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              hobbies: (state.formData.data.hobbies || []).map(hobby =>
                hobby.id === id ? { ...hobby, ...updates } : hobby
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeHobby: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              hobbies: (state.formData.data.hobbies || []).filter(hobby => hobby.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // Courses Actions
      addCourse: () => {
        const state = get();
        const newCourse: Course = {
          id: generateId(),
          name: '',
          provider: '',
          dateCompleted: ''
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              courses: [...(state.formData.data.courses || []), newCourse]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateCourse: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              courses: (state.formData.data.courses || []).map(course =>
                course.id === id ? { ...course, ...updates } : course
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeCourse: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              courses: (state.formData.data.courses || []).filter(course => course.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // References Actions
      addReference: () => {
        const state = get();
        const newReference: Reference = {
          id: generateId(),
          name: '',
          position: '',
          company: '',
          phone: '',
          email: '',
          relationship: ''
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              references: [...(state.formData.data.references || []), newReference]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateReference: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              references: (state.formData.data.references || []).map(ref =>
                ref.id === id ? { ...ref, ...updates } : ref
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeReference: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              references: (state.formData.data.references || []).filter(ref => ref.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // Achievements Actions
      addAchievement: () => {
        const state = get();
        const newAchievement: Achievement = {
          id: generateId(),
          title: '',
          provider: '',
          date: ''
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              achievements: [...(state.formData.data.achievements || []), newAchievement]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateAchievement: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              achievements: (state.formData.data.achievements || []).map(achievement =>
                achievement.id === id ? { ...achievement, ...updates } : achievement
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeAchievement: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              achievements: (state.formData.data.achievements || []).filter(achievement => achievement.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      // Custom Sections Actions
      addCustomSection: () => {
        const state = get();
        const newSection: CustomSection = {
          id: generateId(),
          title: 'قسم جديد',
          type: 'text',
          content: '',
          isVisible: true
        };
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              customSections: [...(state.formData.data.customSections || []), newSection]
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      updateCustomSection: (id, updates) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              customSections: (state.formData.data.customSections || []).map(section =>
                section.id === id ? { ...section, ...updates } : section
              )
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

      removeCustomSection: (id) => {
        const state = get();
        set({
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              customSections: (state.formData.data.customSections || []).filter(section => section.id !== id)
            },
            isDirty: true,
            lastSaved: new Date().toISOString()
          }
        });
        // حفظ تلقائي
        setTimeout(() => state.autoSave(), 100);
      },

  // Form Actions
  setCurrentStep: (step) => {
    const state = get();
    set({
      formData: { 
        ...state.formData, 
        currentStep: step,
        lastSaved: new Date().toISOString()
      }
    });
    
    // حفظ في Firebase عند تغيير الخطوة
    const firebaseStore = useFirebaseStore.getState();
    firebaseStore.handleStepChange(step).catch(console.error);
    
    // حفظ تلقائي عند تغيير الخطوة
    state.autoSave();
  },

  nextStep: () => {
    const state = get();
    const newStep = Math.min(state.formData.currentStep + 1, state.formData.totalSteps - 1);
    set({
      formData: {
        ...state.formData,
        currentStep: newStep,
        lastSaved: new Date().toISOString()
      }
    });
    
    // حفظ في Firebase عند الانتقال للخطوة التالية
    const firebaseStore = useFirebaseStore.getState();
    firebaseStore.handleStepChange(newStep).catch(console.error);
    
    // حفظ تلقائي عند الانتقال للخطوة التالية
    state.autoSave();
  },

  prevStep: () => {
    const state = get();
    const newStep = Math.max(state.formData.currentStep - 1, 0);
    set({
      formData: {
        ...state.formData,
        currentStep: newStep,
        lastSaved: new Date().toISOString()
      }
    });
    
    // حفظ في Firebase عند الرجوع للخطوة السابقة
    const firebaseStore = useFirebaseStore.getState();
    firebaseStore.handleStepChange(newStep).catch(console.error);
    
    // حفظ تلقائي عند الرجوع للخطوة السابقة
    state.autoSave();
  },      setFormError: (field, errors) => set((state) => ({
        formData: {
          ...state.formData,
          errors: { ...state.formData.errors, [field]: errors }
        }
      })),

      clearFormErrors: () => set((state) => ({
        formData: { ...state.formData, errors: {} }
      })),

      markFormDirty: () => set((state) => ({
        formData: { ...state.formData, isDirty: true }
      })),

      markFormClean: () => set((state) => ({
        formData: { ...state.formData, isDirty: false, lastSaved: new Date().toISOString() }
      })),

      // Templates Actions
      setTemplates: (templates) => set({ templates }),
      setCurrentTemplate: (template) => set({ currentTemplate: template }),

      // Theme Actions
      updateTheme: (theme) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            theme: { ...createDefaultResume().theme, ...(state.formData.data.theme || {}), ...theme }
          },
          isDirty: true
        }
      })),

      // Sections Actions
      toggleSection: (sectionId) => set((state) => {
        const hiddenSections = state.formData.data.hiddenSections || [];
        const newHiddenSections = hiddenSections.includes(sectionId)
          ? hiddenSections.filter(id => id !== sectionId)
          : [...hiddenSections, sectionId];
        
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              hiddenSections: newHiddenSections
            },
            isDirty: true
          }
        };
      }),

      reorderSections: (startIndex, endIndex) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            sectionOrder: reorder(state.formData.data.sectionOrder || [], startIndex, endIndex)
          },
          isDirty: true
        }
      })),

      // App State Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setLanguage: (language: 'ar' | 'en') => set({ language, direction: language === 'ar' ? 'rtl' : 'ltr' }),
      setDirection: (direction) => set({ direction }),
      setAppTheme: (theme) => set({ theme }),

  // Utility Actions
  autoSave: () => {
    // لا نحتاج localStorage بعد الآن - سنحفظ في Firebase فقط
    console.log('حفظ تلقائي: تم تحديث البيانات');
  },

  restoreFromBackup: () => {
    // لا نحتاج استعادة من localStorage
    console.log('استعادة: لا يوجد نسخ احتياطية محلية');
    return false;
  },

  getSaveStatus: () => {
    const state = get();
    return {
      isDirty: state.formData.isDirty,
      lastSaved: state.formData.lastSaved,
      hasUnsavedChanges: state.formData.isDirty
    };
  },

  exportToJSON: () => {
    const state = get();
    return JSON.stringify(state.formData.data, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json);
      set({
        formData: {
          ...get().formData,
          data,
          isDirty: true
        }
      });
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  }
}));
