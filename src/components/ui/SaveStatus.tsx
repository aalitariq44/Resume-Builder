'use client';

import React, { useEffect, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { cn } from '@/lib/utils';

interface SaveStatusProps {
  className?: string;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ className }) => {
  const { getSaveStatus } = useResumeStore();
  const [saveStatus, setSaveStatus] = useState(() => getSaveStatus());
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = getSaveStatus();
      setSaveStatus(newStatus);
    }, 1000); // تحديث كل ثانية

    return () => clearInterval(interval);
  }, [getSaveStatus]);

  useEffect(() => {
    if (!saveStatus.isDirty && saveStatus.lastSaved) {
      setShowSaveNotification(true);
      const timer = setTimeout(() => {
        setShowSaveNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus.isDirty, saveStatus.lastSaved]);

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

  const getStatusIcon = () => {
    if (saveStatus.isDirty) {
      return (
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      );
    } else {
      return (
        <div className="w-2 h-2 bg-green-500 rounded-full" />
      );
    }
  };

  const getStatusText = () => {
    if (saveStatus.isDirty) {
      return 'تغييرات غير محفوظة';
    } else if (saveStatus.lastSaved) {
      return formatLastSaved(saveStatus.lastSaved);
    } else {
      return 'جاهز للحفظ';
    }
  };

  return (
    <div className={cn("flex items-center space-x-2 space-x-reverse text-sm", className)}>
      {getStatusIcon()}
      <span 
        className={cn(
          "transition-colors duration-200",
          saveStatus.isDirty ? "text-yellow-600" : "text-green-600"
        )}
      >
        {getStatusText()}
      </span>
      
      {/* إشعار الحفظ */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>تم حفظ التغييرات تلقائياً</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveStatus;
