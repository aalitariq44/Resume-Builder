// أنواع البيانات الأساسية للسيرة الذاتية

export interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  profileImage?: string;
  
  // معلومات إضافية اختيارية
  dateOfBirth?: string;
  placeOfBirth?: string;
  drivingLicense?: boolean;
  gender?: 'male' | 'female' | 'prefer-not-to-say';
  nationality?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  
  // حقول مخصصة
  customFields?: CustomField[];
}

export interface CustomField {
  id: string;
  key?: string; // للحقول الشائعة
  label: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[]; // للحقول من نوع select
  displayOptions?: string[]; // لعرض الخيارات باللغة المحلية
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isCurrentlyStudying: boolean;
  gpa?: string;
  description?: string;
  achievements?: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  position?: string;
  company: string;
  location: string;
  city?: string;
  startDate: string;
  endDate: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isCurrentJob: boolean;
  isCurrentlyWorking?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  skills?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'good' | 'very-good' | 'excellent';
  category: 'technical' | 'communication' | 'time-management' | 'problem-solving' | 'critical-thinking' | 'leadership' | 'personal' | 'custom';
  customCategory?: string;
  yearsOfExperience?: number;
}

export interface Language {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'good' | 'very-good' | 'fluent' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  skills?: {
    reading?: 'poor' | 'fair' | 'good' | 'excellent';
    writing?: 'poor' | 'fair' | 'good' | 'excellent';
    speaking?: 'poor' | 'fair' | 'good' | 'excellent';
    listening?: 'poor' | 'fair' | 'good' | 'excellent';
  };
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
  level: 'hobby' | 'professional';
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  dateCompleted: string;
  certificateNumber?: string;
  verificationUrl?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface Achievement {
  id: string;
  title: string;
  provider: string;
  date: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'table';
  content: any; // يختلف حسب النوع
  isVisible: boolean;
}

export interface Resume {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  objective?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  hobbies: Hobby[];
  courses: Course[];
  extracurricularActivities?: string;
  references: Reference[];
  achievements: Achievement[];
  customSections: CustomSection[];
  
  // إعدادات التصميم
  template: string;
  theme: ResumeTheme;
  
  // إعدادات العرض
  sectionOrder: string[];
  hiddenSections: string[];
  
  // بيانات التعريف
  createdAt: string;
  updatedAt: string;
  language: 'ar' | 'en';
}

export interface ResumeTheme {
  id: string;
  name: string;
  
  // الألوان
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    border: string;
    accent?: string;
  };
  
  // الخطوط
  fonts: {
    heading: string;
    body: string;
    size: {
      base: number;
      heading: number;
      small: number;
    };
  };
  
  // التخطيط
  layout: {
    columns: number;
    spacing: 'tight' | 'normal' | 'relaxed';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  
  // الأنماط
  styles: {
    borderRadius: number;
    shadowLevel: 'none' | 'low' | 'medium' | 'high';
    headerStyle: 'minimal' | 'banner' | 'sidebar';
  };
}

export interface Template {
  id: string;
  name: string;
  category: 'classic' | 'modern' | 'creative' | 'technical' | 'medical' | 'executive';
  description: string;
  preview: string;
  isPopular?: boolean;
  isNew?: boolean;
  isFree: boolean;
  defaultTheme: ResumeTheme;
  supportedLanguages: ('ar' | 'en')[];
  features: string[];
}

// أنواع للنماذج
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: string;
  isCompleted: boolean;
  isOptional?: boolean;
  validationSchema?: any;
}

export interface FormData {
  currentStep: number;
  totalSteps: number;
  data: Partial<Resume>;
  errors: Record<string, string[]>;
  isDirty: boolean;
  lastSaved?: string;
}

// أنواع للحالة العامة
export interface AppState {
  resume: Resume | null;
  formData: FormData;
  templates: Template[];
  currentTemplate: Template | null;
  isLoading: boolean;
  error: string | null;
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  theme: 'light' | 'dark';
}



// أنواع للأخطاء
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

// أنواع للـ Drag & Drop
export interface DragItem {
  id: string;
  type: 'section' | 'field' | 'skill' | 'language';
  index: number;
}

export interface DropResult {
  dragIndex: number;
  hoverIndex: number;
}

// أنواع للبحث والفلترة
export interface SearchFilter {
  query?: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// أنواع للإشعارات
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// أنواع للإعدادات
export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  autoSaveInterval: number; // بالثواني
  defaultTemplate: string;
  emailNotifications: boolean;
  keyboardShortcuts: boolean;
}

export interface AppSettings {
  version: string;
  buildNumber: string;
  environment: 'development' | 'production' | 'staging';
  features: {
    cloudSync: boolean;
    templates: boolean;
    aiSuggestions: boolean;
    collaboration: boolean;
  };
  limits: {
    maxResumes: number;
    maxFileSize: number; // بالبايت
    maxSections: number;
  };
}

// تصدير كل الأنواع - تم التصدير مع كل interface
