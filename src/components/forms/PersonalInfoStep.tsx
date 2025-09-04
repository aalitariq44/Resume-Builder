'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useResumeStore } from '@/store/resumeStore';
import { PersonalInfo } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn, isValidEmail, isValidPhone, compressImage, createImageUrl, generateId } from '@/lib/utils';
import { ImageCropModal } from './ImageCropModal';

// قائمة الحقول المخصصة الشائعة
const COMMON_CUSTOM_FIELDS = [
  { label: 'تاريخ الميلاد', type: 'date' as const, key: 'dateOfBirth' },
  { label: 'محل الميلاد', type: 'text' as const, key: 'placeOfBirth' },
  { label: 'الجنس', type: 'select' as const, key: 'gender', options: ['male', 'female', 'prefer-not-to-say'], displayOptions: ['ذكر', 'أنثى', 'أفضل عدم الإفصاح'] },
  { label: 'الجنسية', type: 'text' as const, key: 'nationality' },
  { label: 'الحالة الاجتماعية', type: 'select' as const, key: 'maritalStatus', options: ['single', 'married', 'divorced', 'widowed'], displayOptions: ['أعزب', 'متزوج', 'مطلق', 'أرمل'] },
  { label: 'رخصة القيادة', type: 'select' as const, key: 'drivingLicense', options: ['true', 'false'], displayOptions: ['نعم', 'لا'] }
];

// Schema validation
const personalInfoSchema = yup.object({
  firstName: yup.string().required('الاسم الأول مطلوب'),
  lastName: yup.string().required('اسم العائلة مطلوب'),
  jobTitle: yup.string().required('الوظيفة المطلوبة مطلوبة'),
  email: yup.string().email('صيغة البريد الإلكتروني غير صحيحة').required('البريد الإلكتروني مطلوب'),
  phone: yup.string().required('رقم الهاتف مطلوب').test('valid-phone', 'رقم الهاتف غير صحيح', isValidPhone),
  address: yup.string().required('العنوان مطلوب'),
  city: yup.string().required('المدينة مطلوبة'),
  postalCode: yup.string(),
  profileImage: yup.string()
});

interface ImageCropperProps {
  image: string | null;
  onImageChange: (croppedImage: string | null) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onImageChange }) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [currentShape, setCurrentShape] = useState<'circle' | 'square'>('circle');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صحيح');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      try {
        const compressedFile = await compressImage(file, 0.8);
        const imageUrl = createImageUrl(compressedFile);
        setTempImage(imageUrl);
        setIsCropModalOpen(true);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('حدث خطأ في معالجة الصورة');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = () => {
    onImageChange(null);
  };

  const handleCropComplete = (croppedImage: string, shape: 'circle' | 'square') => {
    setCurrentShape(shape);
    onImageChange(croppedImage);
    setTempImage(null);
  };

  const handleChangeImage = () => {
    // Trigger file input click
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('يرجى اختيار ملف صورة صحيح');
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
          return;
        }

        // Process the file
        compressImage(file, 0.8).then((compressedFile) => {
          const imageUrl = createImageUrl(compressedFile);
          setTempImage(imageUrl);
          setIsCropModalOpen(true);
        }).catch((error) => {
          console.error('Error processing image:', error);
          alert('حدث خطأ في معالجة الصورة');
        });
      }
    };
    fileInput.click();
  };

  const handleEditImage = () => {
    if (image) {
      setTempImage(image);
      setIsCropModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">الصورة الشخصية</label>
      
      {image ? (
        <div className="relative">
          <div className={cn(
            "w-32 h-32 mx-auto overflow-hidden border-4 border-primary/20",
            currentShape === 'circle' ? 'rounded-full' : 'rounded-lg'
          )}>
            <img
              src={image}
              alt="صورة شخصية"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleChangeImage}
            >
              تغيير الصورة
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleEditImage}
            >
              تعديل الصورة
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={removeImage}
            >
              حذف الصورة
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? "اترك الصورة هنا" : "اسحب صورة أو انقر للاختيار"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF حتى 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false);
          setTempImage(null);
        }}
        imageSrc={tempImage || ''}
        onCropComplete={handleCropComplete}
        initialShape={currentShape}
      />
    </div>
  );
};

export const PersonalInfoStep: React.FC = () => {
  const { formData, updatePersonalInfo, addCustomField, updateCustomField, removeCustomField } = useResumeStore();
  const personalInfo = formData.data.personalInfo!;
  const [selectedField, setSelectedField] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: personalInfo
  });

  const watchedImage = watch('profileImage');

  const onImageChange = (imageUrl: string | null) => {
    setValue('profileImage', imageUrl || undefined);
    updatePersonalInfo({ profileImage: imageUrl || undefined });
  };

  const onSubmit = (data: any) => {
    updatePersonalInfo(data);
  };

  const handleAddCustomField = () => {
    addCustomField();
  };

  const handleAddCommonField = (fieldKey: string) => {
    const field = COMMON_CUSTOM_FIELDS.find(f => f.key === fieldKey);
    if (field) {
      const newField = {
        id: generateId(),
        label: field.label,
        value: '',
        type: field.type,
        options: field.options,
        displayOptions: field.displayOptions
      };
      const updatedFields = [...(personalInfo.customFields || []), newField];
      updatePersonalInfo({ customFields: updatedFields });
      setSelectedField('');
    }
  };

  const handleUpdateCustomField = (id: string, field: string, value: any) => {
    updateCustomField(id, { [field]: value });
  };

  const handleRemoveCustomField = (id: string) => {
    removeCustomField(id);
  };

  const getDisplayValue = (field: any) => {
    if (field.type === 'select' && field.options && field.displayOptions) {
      const index = field.options.indexOf(field.value);
      return index >= 0 ? field.displayOptions[index] : field.value;
    }
    return field.value;
  };

  const getDisplayOptions = (field: any) => {
    return field.displayOptions || field.options || [];
  };

  // Watch form changes and update store
  React.useEffect(() => {
    const subscription = watch((value) => {
      updatePersonalInfo(value as Partial<PersonalInfo>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updatePersonalInfo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">المعلومات الشخصية</h2>
        <p className="text-muted-foreground">
          ادخل معلوماتك الشخصية الأساسية لبدء إنشاء سيرتك الذاتية
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image */}
        <Card>
          <CardContent className="p-6">
            <ImageCropper
              image={watchedImage || null}
              onImageChange={onImageChange}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="الاسم الأول"
                placeholder="احمد"
                error={errors.firstName?.message}
                required
                {...register('firstName')}
              />
              <Input
                label="اسم العائلة"
                placeholder="محمد"
                error={errors.lastName?.message}
                required
                {...register('lastName')}
              />
            </div>

            <Input
              label="الوظيفة المطلوبة"
              placeholder="مطور برمجيات"
              error={errors.jobTitle?.message}
              required
              {...register('jobTitle')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="ali@example.com"
                error={errors.email?.message}
                required
                {...register('email')}
              />
              <Input
                label="رقم الهاتف"
                type="tel"
                error={errors.phone?.message}
                required
                {...register('phone')}
              />
            </div>

            <Input
              label="العنوان"
              placeholder="شارع الملك فهد، حي النزهة"
              error={errors.address?.message}
              required
              {...register('address')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="المدينة"
                placeholder="الرياض"
                error={errors.city?.message}
                required
                {...register('city')}
              />
              <Input
                label="الرمز البريدي"
                placeholder="12345"
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              حقول مخصصة
              <div className="flex gap-2">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="flex h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">اختر حقل شائع</option>
                  {COMMON_CUSTOM_FIELDS
                    .filter(field => !personalInfo.customFields?.some(cf => cf.label === field.label))
                    .map((field) => (
                      <option key={field.key} value={field.key}>
                        {field.label}
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => selectedField ? handleAddCommonField(selectedField) : handleAddCustomField()}
                  disabled={!selectedField && false}
                >
                  {selectedField ? 'إضافة الحقل المختار' : 'إضافة حقل مخصص'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalInfo.customFields?.map((field) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3">
                  <Input
                    label="اسم الحقل"
                    value={field.label}
                    onChange={(e) => handleUpdateCustomField(field.id, 'label', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-2 block">النوع</label>
                  <select
                    value={field.type}
                    onChange={(e) => handleUpdateCustomField(field.id, 'type', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="text">نص</option>
                    <option value="number">رقم</option>
                    <option value="date">تاريخ</option>
                    <option value="select">قائمة</option>
                  </select>
                </div>
                <div className="col-span-6">
                  {field.type === 'select' ? (
                    <div>
                      <label className="text-sm font-medium mb-2 block">القيمة</label>
                      <select
                        value={field.value}
                        onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">اختر قيمة</option>
                        {getDisplayOptions(field).map((option: string, index: number) => (
                          <option key={index} value={field.options?.[index] || option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <Input
                      label="القيمة"
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      value={field.value}
                      onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                    />
                  )}
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveCustomField(field.id)}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
            
            {(!personalInfo.customFields || personalInfo.customFields.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>لا توجد حقول مخصصة</p>
                <p className="text-sm">اختر حقل شائع من القائمة أو انقر على "إضافة حقل مخصص" لإضافة معلومات إضافية</p>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
