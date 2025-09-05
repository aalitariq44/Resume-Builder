'use client';

import React, { useEffect, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useFirebaseStore } from '@/store/firebaseStore';
import { cn } from '@/lib/utils';
import { CloudIcon, WifiOffIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';

interface SaveStatusProps {
  className?: string;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ className }) => {
  const { getSaveStatus } = useResumeStore();
  const { 
    isSyncing, 
    isOnline, 
    lastSyncTime, 
    syncError, 
    pendingChanges 
  } = useFirebaseStore();
  
  const [saveStatus, setSaveStatus] = useState(() => getSaveStatus());
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = getSaveStatus();
      setSaveStatus(newStatus);
    }, 1000); // تحديث كل ثانية

    return () => clearInterval(interval);
  }, [getSaveStatus]);

  useEffect(() => {
    if (!saveStatus.isDirty && saveStatus.lastSaved && !isSyncing) {
      setShowSaveNotification(true);
      const timer = setTimeout(() => {
        setShowSaveNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus.isDirty, saveStatus.lastSaved, isSyncing]);

  const formatLastSaved = (lastSaved?: string) => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const saved = new Date(lastSaved);
    const diffInMinutes = Math.floor((now.getTime() - saved.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'تم الحفظ الآن';
    } else if (diffInMinutes < 60) {
      return `تم الحفظ منذ ${diffInMinutes} دقيقة`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `تم الحفظ منذ ${diffInHours} ساعة`;
    }
  };

  const getCloudStatus = () => {
    if (!isOnline) {
      return {
        icon: <WifiOffIcon className="w-4 h-4 text-gray-500" />,
        text: 'غير متصل',
        color: 'text-gray-500'
      };
    }

    if (syncError) {
      return {
        icon: <AlertCircleIcon className="w-4 h-4 text-red-500" />,
        text: 'خطأ في المزامنة',
        color: 'text-red-500'
      };
    }

    if (isSyncing) {
      return {
        icon: <CloudIcon className="w-4 h-4 text-blue-500 animate-pulse" />,
        text: 'جارٍ المزامنة...',
        color: 'text-blue-500'
      };
    }

    if (Object.keys(pendingChanges).length > 0) {
      return {
        icon: <CloudIcon className="w-4 h-4 text-yellow-500" />,
        text: 'في انتظار المزامنة',
        color: 'text-yellow-500'
      };
    }

    if (lastSyncTime) {
      return {
        icon: <CheckCircleIcon className="w-4 h-4 text-green-500" />,
        text: 'متزامن مع السحابة',
        color: 'text-green-500'
      };
    }

    return {
      icon: <CloudIcon className="w-4 h-4 text-gray-400" />,
      text: 'جاهز للمزامنة',
      color: 'text-gray-400'
    };
  };

  const getLocalStatus = () => {
    const isDirty = isClient ? saveStatus.isDirty : false;
    
    if (isDirty) {
      return {
        icon: <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />,
        text: 'تغييرات غير محفوظة',
        color: 'text-yellow-600'
      };
    } else if (saveStatus.lastSaved) {
      return {
        icon: <div className="w-2 h-2 bg-green-500 rounded-full" />,
        text: formatLastSaved(saveStatus.lastSaved),
        color: 'text-green-600'
      };
    } else {
      return {
        icon: <div className="w-2 h-2 bg-gray-400 rounded-full" />,
        text: 'جاهز للحفظ',
        color: 'text-gray-500'
      };
    }
  };

  const localStatus = getLocalStatus();
  const cloudStatus = getCloudStatus();

  return (
    <div className={cn("flex items-center space-x-4 space-x-reverse text-sm", className)}>
      {/* حالة الحفظ المحلي */}
      <div className="flex items-center space-x-2 space-x-reverse">
        {localStatus.icon}
        <span className={cn("transition-colors duration-200", localStatus.color)}>
          {localStatus.text}
        </span>
      </div>

      {/* فاصل */}
      <div className="w-px h-4 bg-gray-300" />

      {/* حالة المزامنة مع Firebase */}
      <div className="flex items-center space-x-2 space-x-reverse">
        {cloudStatus.icon}
        <span className={cn("transition-colors duration-200", cloudStatus.color)}>
          {cloudStatus.text}
        </span>
      </div>

      {/* عرض عدد التغييرات المعلقة */}
      {Object.keys(pendingChanges).length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
          {Object.keys(pendingChanges).length} تغيير معلق
        </div>
      )}
      
      {/* إشعار الحفظ */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckCircleIcon className="w-4 h-4" />
            <span>تم حفظ التغييرات تلقائياً</span>
          </div>
        </div>
      )}

      {/* إشعار خطأ المزامنة */}
      {syncError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-center space-x-2 space-x-reverse">
            <AlertCircleIcon className="w-4 h-4" />
            <div>
              <div className="font-medium">خطأ في المزامنة</div>
              <div className="text-sm opacity-90">{syncError}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveStatus;
