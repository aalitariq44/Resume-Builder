import { create } from 'zustand';
import { User } from 'firebase/auth';
import { 
  signInWithEmail, 
  createAccount, 
  signInWithGoogle, 
  signOutUser, 
  resetPassword, 
  getUserProfile, 
  onAuthStateChange,
  UserProfile 
} from '@/lib/auth';

interface AuthStore {
  // الحالة
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // الأفعال
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // دوال المصادقة
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  
  // دوال مساعدة
  initializeAuth: () => void;
  loadUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // الحالة الأولية
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // الأفعال الأساسية
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  setUserProfile: (userProfile) => set({ userProfile }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // تسجيل الدخول
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    const { user, error } = await signInWithEmail(email, password);
    
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
      await get().loadUserProfile();
      return true;
    } else {
      set({ error, isLoading: false });
      return false;
    }
  },

  // إنشاء حساب
  signUp: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    
    const { user, error } = await createAccount(email, password, displayName);
    
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
      await get().loadUserProfile();
      return true;
    } else {
      set({ error, isLoading: false });
      return false;
    }
  },

  // تسجيل الدخول بـ Google
  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    
    const { user, error } = await signInWithGoogle();
    
    if (user) {
      set({ user, isAuthenticated: true, isLoading: false });
      await get().loadUserProfile();
      return true;
    } else {
      set({ error, isLoading: false });
      return false;
    }
  },

  // تسجيل الخروج
  signOut: async () => {
    set({ isLoading: true });
    
    await signOutUser();
    
    set({ 
      user: null, 
      userProfile: null, 
      isAuthenticated: false, 
      isLoading: false,
      error: null
    });
  },

  // إعادة تعيين كلمة المرور
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      set({ isLoading: false });
      return true;
    } else {
      set({ error, isLoading: false });
      return false;
    }
  },

  // تهيئة المصادقة
  initializeAuth: () => {
    return onAuthStateChange(async (user) => {
      set({ user, isAuthenticated: !!user, isLoading: false });
      
      if (user) {
        await get().loadUserProfile();
      } else {
        set({ userProfile: null });
      }
    });
  },

  // تحميل ملف المستخدم
  loadUserProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const profile = await getUserProfile(user.uid);
      set({ userProfile: profile });
    } catch (error) {
      console.error('خطأ في تحميل ملف المستخدم:', error);
    }
  }
}));
