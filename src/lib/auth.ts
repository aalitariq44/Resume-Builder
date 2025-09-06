import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  resumesCount: number;
}

// تسجيل دخول بالبريد الإلكتروني وكلمة المرور
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await updateLastLogin(result.user.uid);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// إنشاء حساب جديد
export const createAccount = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // تحديث الملف الشخصي
    await updateProfile(result.user, { displayName });
    
    // إنشاء مستند المستخدم في Firestore
    const userProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      displayName,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      resumesCount: 0
    };
    
    await setDoc(doc(db, 'users', result.user.uid), userProfile);
    
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// تسجيل دخول بـ Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // التحقق من وجود المستخدم في قاعدة البيانات
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // إنشاء مستند المستخدم إذا لم يكن موجوداً
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || 'مستخدم',
        photoURL: result.user.photoURL || undefined,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        resumesCount: 0
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
    } else {
      await updateLastLogin(result.user.uid);
    }
    
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// تسجيل خروج
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// إعادة تعيين كلمة المرور
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// تحديث وقت آخر تسجيل دخول
const updateLastLogin = async (uid: string) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('خطأ في تحديث وقت آخر تسجيل دخول:', error);
  }
};

// الحصول على ملف المستخدم
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('خطأ في الحصول على ملف المستخدم:', error);
    return null;
  }
};

// مراقبة حالة تسجيل الدخول
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
