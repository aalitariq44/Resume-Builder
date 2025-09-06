import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
  setDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Resume, PersonalInfo, Education, Experience, Skill, Language, Hobby, Course, Reference, Achievement, CustomSection } from '@/types';
import { generateId } from '@/lib/utils';

// أنواع البيانات لـ Firestore
export interface FirestoreResume extends Omit<Resume, 'createdAt' | 'updatedAt'> {
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ResumeMetadata {
  id: string;
  title: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  template: string;
  language: 'ar' | 'en';
}

// خدمات السير الذاتية
export class ResumeService {
  private static readonly COLLECTION_NAME = 'resumes';

  // إنشاء سيرة ذاتية جديدة
  static async createResume(resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> {
    try {
      const now = Timestamp.now();
      const resumeData: Omit<FirestoreResume, 'id'> = {
        ...resume,
        userId,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), resumeData);
      console.log('تم إنشاء السيرة الذاتية بنجاح:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('خطأ في إنشاء السيرة الذاتية:', error);
      throw new Error('فشل في إنشاء السيرة الذاتية');
    }
  }

  // تحديث سيرة ذاتية موجودة
  static async updateResume(resumeId: string, updates: Partial<Resume>, userId: string): Promise<void> {
    try {
      const resumeRef = doc(db, this.COLLECTION_NAME, resumeId);
      
      // التحقق من وجود السيرة الذاتية والصلاحية
      const resumeSnap = await getDoc(resumeRef);
      if (!resumeSnap.exists()) {
        throw new Error('السيرة الذاتية غير موجودة');
      }

      const resumeData = resumeSnap.data() as FirestoreResume;
      if (resumeData.userId !== userId) {
        throw new Error('غير مسموح بتعديل هذه السيرة الذاتية');
      }

      // إزالة القيم undefined قبل التحديث
      const cleanUpdates = this.removeUndefinedValues(updates);

      const updateData = {
        ...cleanUpdates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(resumeRef, updateData);
      console.log('تم تحديث السيرة الذاتية بنجاح:', resumeId);
    } catch (error) {
      console.error('خطأ في تحديث السيرة الذاتية:', error);
      throw error;
    }
  }

  // حذف سيرة ذاتية
  static async deleteResume(resumeId: string, userId: string): Promise<void> {
    try {
      const resumeRef = doc(db, this.COLLECTION_NAME, resumeId);
      
      // التحقق من الصلاحية
      const resumeSnap = await getDoc(resumeRef);
      if (!resumeSnap.exists()) {
        throw new Error('السيرة الذاتية غير موجودة');
      }

      const resumeData = resumeSnap.data() as FirestoreResume;
      if (resumeData.userId !== userId) {
        throw new Error('غير مسموح بحذف هذه السيرة الذاتية');
      }

      await deleteDoc(resumeRef);
      console.log('تم حذف السيرة الذاتية بنجاح:', resumeId);
    } catch (error) {
      console.error('خطأ في حذف السيرة الذاتية:', error);
      throw error;
    }
  }

  // جلب سيرة ذاتية واحدة
  static async getResume(resumeId: string, userId: string): Promise<Resume | null> {
    try {
      const resumeRef = doc(db, this.COLLECTION_NAME, resumeId);
      const resumeSnap = await getDoc(resumeRef);

      if (!resumeSnap.exists()) {
        return null;
      }

      const resumeData = resumeSnap.data() as FirestoreResume;
      if (resumeData.userId !== userId) {
        throw new Error('غير مسموح بعرض هذه السيرة الذاتية');
      }

      // تحويل Timestamp إلى string
      return {
        ...resumeData,
        id: resumeSnap.id,
        createdAt: resumeData.createdAt.toDate().toISOString(),
        updatedAt: resumeData.updatedAt.toDate().toISOString()
      };
    } catch (error) {
      console.error('خطأ في جلب السيرة الذاتية:', error);
      throw error;
    }
  }

  // جلب جميع السير الذاتية للمستخدم
  static async getUserResumes(userId: string, limitCount = 20): Promise<ResumeMetadata[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const resumes: ResumeMetadata[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreResume;
        resumes.push({
          id: doc.id,
          title: data.title,
          userId: data.userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          template: data.template,
          language: data.language
        });
      });

      return resumes;
    } catch (error) {
      console.error('خطأ في جلب السير الذاتية:', error);
      throw error;
    }
  }

  // نسخ سيرة ذاتية
  static async duplicateResume(resumeId: string, userId: string, newTitle?: string): Promise<string> {
    try {
      const originalResume = await this.getResume(resumeId, userId);
      if (!originalResume) {
        throw new Error('السيرة الذاتية غير موجودة');
      }

      const duplicatedResume = {
        ...originalResume,
        title: newTitle || `نسخة من ${originalResume.title}`,
        id: generateId() // معرف جديد
      };

      // حذف المعرف والتواريخ لأنها ستُنشأ تلقائياً
      const { id, createdAt, updatedAt, ...resumeData } = duplicatedResume;

      return await this.createResume(resumeData, userId);
    } catch (error) {
      console.error('خطأ في نسخ السيرة الذاتية:', error);
      throw error;
    }
  }

  // حفظ تلقائي للقسم المحدد
  static async autoSaveSection(
    resumeId: string, 
    userId: string, 
    sectionName: string, 
    sectionData: any
  ): Promise<void> {
    try {
      const resumeRef = doc(db, this.COLLECTION_NAME, resumeId);
      
      // التحقق من وجود السيرة الذاتية والصلاحية
      const resumeSnap = await getDoc(resumeRef);
      if (!resumeSnap.exists()) {
        throw new Error('السيرة الذاتية غير موجودة');
      }

      const resumeData = resumeSnap.data() as FirestoreResume;
      if (resumeData.userId !== userId) {
        throw new Error('غير مسموح بتعديل هذه السيرة الذاتية');
      }

      // إزالة القيم undefined قبل الحفظ
      const cleanSectionData = this.removeUndefinedValues(sectionData);

      const updates = {
        [sectionName]: cleanSectionData,
        updatedAt: Timestamp.now()
      };

      await updateDoc(resumeRef, updates);
      console.log(`تم حفظ قسم ${sectionName} تلقائياً`);
    } catch (error) {
      console.error(`خطأ في الحفظ التلقائي لقسم ${sectionName}:`, error);
      throw error;
    }
  }

  // حفظ المعلومات الشخصية
  static async savePersonalInfo(resumeId: string, userId: string, personalInfo: PersonalInfo): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'personalInfo', personalInfo);
  }

  // حفظ التعليم
  static async saveEducation(resumeId: string, userId: string, education: Education[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'education', education);
  }

  // حفظ الخبرات
  static async saveExperience(resumeId: string, userId: string, experience: Experience[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'experience', experience);
  }

  // حفظ المهارات
  static async saveSkills(resumeId: string, userId: string, skills: Skill[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'skills', skills);
  }

  // حفظ اللغات
  static async saveLanguages(resumeId: string, userId: string, languages: Language[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'languages', languages);
  }

  // حفظ الهوايات
  static async saveHobbies(resumeId: string, userId: string, hobbies: Hobby[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'hobbies', hobbies);
  }

  // حفظ الدورات
  static async saveCourses(resumeId: string, userId: string, courses: Course[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'courses', courses);
  }

  // حفظ المراجع
  static async saveReferences(resumeId: string, userId: string, references: Reference[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'references', references);
  }

  // حفظ الإنجازات
  static async saveAchievements(resumeId: string, userId: string, achievements: Achievement[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'achievements', achievements);
  }

  // حفظ الأقسام المخصصة
  static async saveCustomSections(resumeId: string, userId: string, customSections: CustomSection[]): Promise<void> {
    return this.autoSaveSection(resumeId, userId, 'customSections', customSections);
  }

  // إزالة القيم undefined من الكائن
  private static removeUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeUndefinedValues(item));
    }
    
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = this.removeUndefinedValues(value);
      }
    }
    return cleaned;
  }

  // حفظ متعدد للعديد من الأقسام معاً
  static async saveBatch(resumeId: string, userId: string, sections: Record<string, any>): Promise<void> {
    try {
      const batch = writeBatch(db);
      const resumeRef = doc(db, this.COLLECTION_NAME, resumeId);

      // التحقق من الصلاحية أولاً
      const resumeSnap = await getDoc(resumeRef);
      if (!resumeSnap.exists()) {
        throw new Error('السيرة الذاتية غير موجودة');
      }

      const resumeData = resumeSnap.data() as FirestoreResume;
      if (resumeData.userId !== userId) {
        throw new Error('غير مسموح بتعديل هذه السيرة الذاتية');
      }

      // إزالة القيم undefined من جميع الأقسام
      const cleanSections = this.removeUndefinedValues(sections);

      const updates = {
        ...cleanSections,
        updatedAt: Timestamp.now()
      };

      batch.update(resumeRef, updates);
      await batch.commit();

      console.log('تم حفظ الأقسام المتعددة بنجاح');
    } catch (error) {
      console.error('خطأ في الحفظ المتعدد:', error);
      throw error;
    }
  }
}

// خدمة إدارة المستخدمين (للمستقبل)
export class UserService {
  private static readonly COLLECTION_NAME = 'users';

  // إنشاء ملف شخصي للمستخدم
  static async createUserProfile(userId: string, profileData: any): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      await updateDoc(userRef, {
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('خطأ في إنشاء الملف الشخصي:', error);
      throw error;
    }
  }

  // جلب ملف شخصي للمستخدم
  static async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = doc(db, this.COLLECTION_NAME, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('خطأ في جلب الملف الشخصي:', error);
      throw error;
    }
  }
}
