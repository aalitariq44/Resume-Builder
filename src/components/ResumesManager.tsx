'use client';

import { useEffect, useState } from 'react';
import { useResumesManagerStore } from '@/store/resumesManagerStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, LogOutIcon } from 'lucide-react';

export default function ResumesManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  
  const {
    resumes,
    isLoading,
    error,
    loadUserResumes,
    createNewResume,
    deleteResume,
    duplicateResume,
    selectResume
  } = useResumesManagerStore();
  
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    loadUserResumes();
  }, [loadUserResumes]);

  const handleCreateResume = async () => {
    if (!newResumeTitle.trim()) {
      alert('يرجى إدخال عنوان للسيرة الذاتية');
      return;
    }

    const resumeId = await createNewResume(newResumeTitle);
    if (resumeId) {
      setNewResumeTitle('');
      setShowCreateForm(false);
      // الانتقال إلى محرر السيرة الذاتية
      window.location.href = `/builder?resumeId=${resumeId}`;
    }
  };

  const handleEditResume = (resumeId: string) => {
    window.location.href = `/builder?resumeId=${resumeId}`;
  };

  const handlePreviewResume = (resumeId: string) => {
    window.location.href = `/preview?resumeId=${resumeId}`;
  };

  const handleDuplicateResume = async (resumeId: string, title: string) => {
    const newResumeId = await duplicateResume(resumeId, `نسخة من ${title}`);
    if (newResumeId) {
      // تحديث القائمة تلقائياً
      loadUserResumes();
    }
  };

  const handleDeleteResume = async (resumeId: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف السيرة الذاتية "${title}"؟`)) {
      await deleteResume(resumeId);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل السير الذاتية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">سيري الذاتية</h1>
              <p className="mt-1 text-sm text-gray-500">
                مرحباً {user?.displayName || user?.email}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                إنشاء سيرة ذاتية جديدة
              </Button>
              <Button
                variant="outline"
                onClick={signOut}
                className="p-2"
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create Resume Form */}
        {showCreateForm && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">إنشاء سيرة ذاتية جديدة</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان السيرة الذاتية</Label>
                <Input
                  id="title"
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  placeholder="مثال: مطور برمجيات، مصمم جرافيك..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateResume} className="bg-blue-600 hover:bg-blue-700 text-white">
                  إنشاء
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewResumeTitle('');
                  }}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              لا توجد سير ذاتية بعد
            </h3>
            <p className="text-gray-500 mb-6">
              ابدأ بإنشاء سيرتك الذاتية الأولى الآن
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              إنشاء سيرة ذاتية جديدة
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        آخر تحديث: {formatDate(resume.updatedAt)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        تم الإنشاء: {formatDate(resume.createdAt)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {resume.template}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => handlePreviewResume(resume.id)}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      معاينة
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditResume(resume.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      تحرير
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateResume(resume.id, resume.title)}
                    >
                      نسخ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteResume(resume.id, resume.title)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
