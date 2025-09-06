'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    setIsInitialized(true);
    
    return unsubscribe;
  }, [initializeAuth]);

  // عرض شاشة التحميل أثناء التهيئة
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // عرض شاشة تسجيل الدخول إذا لم يكن المستخدم مسجلاً
  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  // عرض التطبيق إذا كان المستخدم مسجل الدخول
  return <>{children}</>;
}
