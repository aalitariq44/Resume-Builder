import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseResumes } from '@/hooks/useFirebaseResumes';
import { useFirebaseStore } from '@/store/firebaseStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  PlusIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CopyIcon,
  SearchIcon,
  FileTextIcon,
  CalendarIcon,
  GlobeIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from 'sonner';

// مكون كارت السيرة الذاتية
interface ResumeCardProps {
  resume: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onView: (id: string) => void;
}

const ResumeCard = ({ resume, onEdit, onDelete, onDuplicate, onView }: ResumeCardProps) => {
  const createdDate = resume.createdAt?.toDate?.() || new Date(resume.createdAt);
  const updatedDate = resume.updatedAt?.toDate?.() || new Date(resume.updatedAt);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {resume.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              <span>تم الإنشاء: {format(createdDate, 'dd/MM/yyyy', { locale: ar })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <CalendarIcon className="w-4 h-4" />
              <span>آخر تحديث: {format(updatedDate, 'dd/MM/yyyy', { locale: ar })}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant={resume.language === 'ar' ? 'default' : 'secondary'}>
              <GlobeIcon className="w-3 h-3 mr-1" />
              {resume.language === 'ar' ? 'عربي' : 'English'}
            </Badge>
            <Badge variant="outline">
              {resume.template}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileTextIcon className="w-4 h-4" />
            <span>سيرة ذاتية</span>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(resume.id)}
              className="h-8"
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(resume.id)}
              className="h-8"
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDuplicate(resume.id)}
              className="h-8"
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(resume.id)}
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// مكون حوار إنشاء سيرة ذاتية جديدة
const CreateResumeDialog = ({ open, onOpenChange, onCreate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: any) => void;
}) => {
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('classic');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان السيرة الذاتية');
      return;
    }

    onCreate({
      title: title.trim(),
      template,
      language
    });

    // إعادة تعيين النموذج
    setTitle('');
    setTemplate('classic');
    setLanguage('ar');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء سيرة ذاتية جديدة</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان السيرة الذاتية
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: سيرة ذاتية للوظائف التقنية"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              القالب
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="classic">كلاسيكي</option>
              <option value="modern">حديث</option>
              <option value="creative">إبداعي</option>
              <option value="professional">مهني</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اللغة
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleCreate}>
              إنشاء السيرة الذاتية
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// الصفحة الرئيسية لإدارة السير الذاتية
export default function ResumesManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // استخدام userId مؤقت - في التطبيق الحقيقي سيأتي من نظام التوثيق
  const userId = 'temp-user-id'; // سيتم استبداله بنظام التوثيق الحقيقي
  
  const { 
    resumes, 
    loading, 
    error, 
    createResume, 
    deleteResume, 
    duplicateResume,
    fetchResumes 
  } = useFirebaseResumes(userId);
  
  const { setCurrentResumeId, setUserId } = useFirebaseStore();

  // تعيين معرف المستخدم عند التحميل
  useEffect(() => {
    setUserId(userId);
  }, [setUserId, userId]);

  // فلترة السير الذاتية حسب البحث
  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // إنشاء سيرة ذاتية جديدة
  const handleCreateResume = async (data: any) => {
    try {
      const resumeData = {
        title: data.title,
        template: data.template,
        language: data.language,
        personalInfo: {
          id: `personal-${Date.now()}`,
          firstName: '',
          lastName: '',
          jobTitle: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          customFields: []
        },
        education: [],
        experience: [],
        skills: [],
        languages: [],
        hobbies: [],
        courses: [],
        references: [],
        achievements: [],
        customSections: [],
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
            spacing: 'normal' as const,
            margins: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }
          },
          styles: {
            borderRadius: 8,
            shadowLevel: 'low' as const,
            headerStyle: 'minimal' as const
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
        hiddenSections: []
      };

      const resumeId = await createResume(resumeData);
      setCurrentResumeId(resumeId);
      toast.success('تم إنشاء السيرة الذاتية بنجاح');
      router.push(`/builder?resumeId=${resumeId}`);
    } catch (error) {
      console.error('خطأ في إنشاء السيرة الذاتية:', error);
    }
  };

  // تعديل سيرة ذاتية
  const handleEditResume = (resumeId: string) => {
    setCurrentResumeId(resumeId);
    router.push(`/builder?resumeId=${resumeId}`);
  };

  // عرض سيرة ذاتية
  const handleViewResume = (resumeId: string) => {
    router.push(`/preview?resumeId=${resumeId}`);
  };

  // حذف سيرة ذاتية
  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه السيرة الذاتية؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await deleteResume(resumeId);
      } catch (error) {
        console.error('خطأ في حذف السيرة الذاتية:', error);
      }
    }
  };

  // نسخ سيرة ذاتية
  const handleDuplicateResume = async (resumeId: string) => {
    try {
      const originalResume = resumes.find(r => r.id === resumeId);
      const newTitle = `نسخة من ${originalResume?.title || 'سيرة ذاتية'}`;
      await duplicateResume(resumeId, newTitle);
    } catch (error) {
      console.error('خطأ في نسخ السيرة الذاتية:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل السير الذاتية...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchResumes}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* الرأس */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سيرتي الذاتية</h1>
          <p className="text-gray-600">إدارة وتنظيم جميع سيرك الذاتية في مكان واحد</p>
        </div>

        {/* شريط البحث والإجراءات */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="البحث في السير الذاتية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            إنشاء سيرة ذاتية جديدة
          </Button>
        </div>

        {/* قائمة السير الذاتية */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد سير ذاتية'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'جرب البحث بكلمات مختلفة' : 'ابدأ بإنشاء سيرتك الذاتية الأولى'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowCreateDialog(true)}>
                إنشاء سيرة ذاتية جديدة
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={handleEditResume}
                onDelete={handleDeleteResume}
                onDuplicate={handleDuplicateResume}
                onView={handleViewResume}
              />
            ))}
          </div>
        )}

        {/* حوار إنشاء سيرة ذاتية جديدة */}
        <CreateResumeDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreate={handleCreateResume}
        />
      </div>
    </div>
  );
}
