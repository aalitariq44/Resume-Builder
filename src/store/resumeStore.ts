import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Resume, FormData, Template, ResumeTheme, AppState, PersonalInfo, Education, Experience, Skill, Language, Hobby, Course, Reference, Achievement, CustomSection } from '@/types';
import { generateId } from '@/lib/utils';

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
        base: 14,
        heading: 18,
        small: 12
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
  
  // Actions for Skills
  addSkill: () => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (startIndex: number, endIndex: number) => void;
  
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
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setLanguage: (language: 'ar' | 'en') => void;
  setDirection: (direction: 'rtl' | 'ltr') => void;
  setAppTheme: (theme: 'light' | 'dark') => void;
  
  // Utility Actions
  autoSave: () => void;
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

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial State
      resume: null,
      formData: createDefaultFormData(),
      templates: [],
      currentTemplate: null,
      isLoading: false,
      isSaving: false,
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

      // Personal Info Actions
      updatePersonalInfo: (info) => set((state) => {
        const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
        const updatedPersonalInfo = { ...currentPersonalInfo, ...info };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              personalInfo: updatedPersonalInfo,
              updatedAt: new Date().toISOString()
            },
            isDirty: true
          },
          resume: state.resume ? {
            ...state.resume,
            personalInfo: updatedPersonalInfo,
            updatedAt: new Date().toISOString()
          } : null
        };
      }),

      addCustomField: () => set((state) => {
        const newField = {
          id: generateId(),
          label: 'حقل جديد',
          value: '',
          type: 'text' as const
        };
        const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
        const updatedFields = [...(currentPersonalInfo.customFields || []), newField];
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              personalInfo: {
                ...currentPersonalInfo,
                customFields: updatedFields
              }
            },
            isDirty: true
          }
        };
      }),

      updateCustomField: (id, updates) => set((state) => {
        const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
        const updatedFields = (currentPersonalInfo.customFields || []).map(field =>
          field.id === id ? { ...field, ...updates } : field
        );
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              personalInfo: {
                ...currentPersonalInfo,
                customFields: updatedFields
              }
            },
            isDirty: true
          }
        };
      }),

      removeCustomField: (id) => set((state) => {
        const currentPersonalInfo = state.formData.data.personalInfo || createDefaultPersonalInfo();
        const updatedFields = (currentPersonalInfo.customFields || []).filter(field => field.id !== id);
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              personalInfo: {
                ...currentPersonalInfo,
                customFields: updatedFields
              }
            },
            isDirty: true
          }
        };
      }),

      // Education Actions
      setEducation: (education) => set({ education }),
      
      addEducation: () => set((state) => {
        const newEducation: Education = {
          id: generateId(),
          degree: '',
          field: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrentlyStudying: false,
          achievements: []
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              education: [...(state.formData.data.education || []), newEducation]
            },
            isDirty: true
          }
        };
      }),

      updateEducation: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            education: (state.formData.data.education || []).map(edu =>
              edu.id === id ? { ...edu, ...updates } : edu
            )
          },
          isDirty: true
        }
      })),

      removeEducation: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            education: (state.formData.data.education || []).filter(edu => edu.id !== id)
          },
          isDirty: true
        }
      })),

      reorderEducation: (startIndex, endIndex) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            education: reorder(state.formData.data.education || [], startIndex, endIndex)
          },
          isDirty: true
        }
      })),

      // Experience Actions
      addExperience: () => set((state) => {
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
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              experience: [...(state.formData.data.experience || []), newExperience]
            },
            isDirty: true
          }
        };
      }),

      updateExperience: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            experience: (state.formData.data.experience || []).map(exp =>
              exp.id === id ? { ...exp, ...updates } : exp
            )
          },
          isDirty: true
        }
      })),

      removeExperience: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            experience: (state.formData.data.experience || []).filter(exp => exp.id !== id)
          },
          isDirty: true
        }
      })),

      reorderExperience: (startIndex, endIndex) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            experience: reorder(state.formData.data.experience || [], startIndex, endIndex)
          },
          isDirty: true
        }
      })),

      // Skills Actions
      addSkill: () => set((state) => {
        const newSkill: Skill = {
          id: generateId(),
          name: '',
          level: 'intermediate',
          category: 'technical'
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              skills: [...(state.formData.data.skills || []), newSkill]
            },
            isDirty: true
          }
        };
      }),

      updateSkill: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            skills: (state.formData.data.skills || []).map(skill =>
              skill.id === id ? { ...skill, ...updates } : skill
            )
          },
          isDirty: true
        }
      })),

      removeSkill: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            skills: (state.formData.data.skills || []).filter(skill => skill.id !== id)
          },
          isDirty: true
        }
      })),

      reorderSkills: (startIndex, endIndex) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            skills: reorder(state.formData.data.skills || [], startIndex, endIndex)
          },
          isDirty: true
        }
      })),

      // Languages Actions
      addLanguage: () => set((state) => {
        const newLanguage: Language = {
          id: generateId(),
          name: '',
          level: 'intermediate'
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              languages: [...(state.formData.data.languages || []), newLanguage]
            },
            isDirty: true
          }
        };
      }),

      updateLanguage: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            languages: (state.formData.data.languages || []).map(lang =>
              lang.id === id ? { ...lang, ...updates } : lang
            )
          },
          isDirty: true
        }
      })),

      removeLanguage: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            languages: (state.formData.data.languages || []).filter(lang => lang.id !== id)
          },
          isDirty: true
        }
      })),

      // Hobbies Actions
      addHobby: (initialData = {}) => set((state) => {
        const newHobby: Hobby = {
          id: generateId(),
          name: '',
          level: 'hobby',
          ...initialData
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              hobbies: [...(state.formData.data.hobbies || []), newHobby]
            },
            isDirty: true
          }
        };
      }),

      updateHobby: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            hobbies: (state.formData.data.hobbies || []).map(hobby =>
              hobby.id === id ? { ...hobby, ...updates } : hobby
            )
          },
          isDirty: true
        }
      })),

      removeHobby: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            hobbies: (state.formData.data.hobbies || []).filter(hobby => hobby.id !== id)
          },
          isDirty: true
        }
      })),

      // Courses Actions
      addCourse: () => set((state) => {
        const newCourse: Course = {
          id: generateId(),
          name: '',
          provider: '',
          dateCompleted: ''
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              courses: [...(state.formData.data.courses || []), newCourse]
            },
            isDirty: true
          }
        };
      }),

      updateCourse: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            courses: (state.formData.data.courses || []).map(course =>
              course.id === id ? { ...course, ...updates } : course
            )
          },
          isDirty: true
        }
      })),

      removeCourse: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            courses: (state.formData.data.courses || []).filter(course => course.id !== id)
          },
          isDirty: true
        }
      })),

      // References Actions
      addReference: () => set((state) => {
        const newReference: Reference = {
          id: generateId(),
          name: '',
          position: '',
          company: '',
          phone: '',
          email: '',
          relationship: ''
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              references: [...(state.formData.data.references || []), newReference]
            },
            isDirty: true
          }
        };
      }),

      updateReference: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            references: (state.formData.data.references || []).map(ref =>
              ref.id === id ? { ...ref, ...updates } : ref
            )
          },
          isDirty: true
        }
      })),

      removeReference: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            references: (state.formData.data.references || []).filter(ref => ref.id !== id)
          },
          isDirty: true
        }
      })),

      // Achievements Actions
      addAchievement: () => set((state) => {
        const newAchievement: Achievement = {
          id: generateId(),
          title: '',
          provider: '',
          date: ''
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              achievements: [...(state.formData.data.achievements || []), newAchievement]
            },
            isDirty: true
          }
        };
      }),

      updateAchievement: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            achievements: (state.formData.data.achievements || []).map(achievement =>
              achievement.id === id ? { ...achievement, ...updates } : achievement
            )
          },
          isDirty: true
        }
      })),

      removeAchievement: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            achievements: (state.formData.data.achievements || []).filter(achievement => achievement.id !== id)
          },
          isDirty: true
        }
      })),

      // Custom Sections Actions
      addCustomSection: () => set((state) => {
        const newSection: CustomSection = {
          id: generateId(),
          title: 'قسم جديد',
          type: 'text',
          content: '',
          isVisible: true
        };
        return {
          formData: {
            ...state.formData,
            data: {
              ...state.formData.data,
              customSections: [...(state.formData.data.customSections || []), newSection]
            },
            isDirty: true
          }
        };
      }),

      updateCustomSection: (id, updates) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            customSections: (state.formData.data.customSections || []).map(section =>
              section.id === id ? { ...section, ...updates } : section
            )
          },
          isDirty: true
        }
      })),

      removeCustomSection: (id) => set((state) => ({
        formData: {
          ...state.formData,
          data: {
            ...state.formData.data,
            customSections: (state.formData.data.customSections || []).filter(section => section.id !== id)
          },
          isDirty: true
        }
      })),

      // Form Actions
      setCurrentStep: (step) => set((state) => ({
        formData: { ...state.formData, currentStep: step }
      })),

      nextStep: () => set((state) => ({
        formData: {
          ...state.formData,
          currentStep: Math.min(state.formData.currentStep + 1, state.formData.totalSteps - 1)
        }
      })),

      prevStep: () => set((state) => ({
        formData: {
          ...state.formData,
          currentStep: Math.max(state.formData.currentStep - 1, 0)
        }
      })),

      setFormError: (field, errors) => set((state) => ({
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
      setSaving: (saving) => set({ isSaving: saving }),
      setError: (error) => set({ error }),
      setLanguage: (language) => set({ language, direction: language === 'ar' ? 'rtl' : 'ltr' }),
      setDirection: (direction) => set({ direction }),
      setAppTheme: (theme) => set({ theme }),

      // Utility Actions
      autoSave: () => {
        const state = get();
        if (state.formData.isDirty && !state.isSaving) {
          // هنا يمكن إضافة منطق الحفظ التلقائي
          state.markFormClean();
        }
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
    }),
    {
      name: 'resume-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        language: state.language,
        direction: state.direction,
        theme: state.theme
      })
    }
  )
);
