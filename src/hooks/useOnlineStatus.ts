import { useState, useEffect } from 'react';
import { useFirebaseStore } from '@/store/firebaseStore';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { setIsOnline: setFirebaseOnline } = useFirebaseStore();

  useEffect(() => {
    // تحديد الحالة الأولية
    setIsOnline(navigator.onLine);
    setFirebaseOnline(navigator.onLine);

    // مستمعين للأحداث
    const handleOnline = () => {
      setIsOnline(true);
      setFirebaseOnline(true);
      console.log('اتصال الإنترنت متاح');
      
      // محاولة مزامنة التغييرات المعلقة عند العودة للاتصال
      const firebaseStore = useFirebaseStore.getState();
      if (Object.keys(firebaseStore.pendingChanges).length > 0) {
        firebaseStore.syncPendingChanges();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setFirebaseOnline(false);
      console.log('فقدان اتصال الإنترنت');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // تنظيف المستمعين
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setFirebaseOnline]);

  return isOnline;
};
