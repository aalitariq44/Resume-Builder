# نظام Firebase للسير الذاتية المتعددة

## ملخص التحديث

تم ربط التطبيق بـ Firebase وإضافة إمكانية إنشاء وإدارة سير ذاتية متعددة مع الحفظ التلقائي في Firestore.

## الميزات الجديدة

### 1. إدارة السير الذاتية المتعددة
- إنشاء سير ذاتية متعددة لكل مستخدم
- عرض قائمة بجميع السير الذاتية
- نسخ وحذف السير الذاتية
- البحث في السير الذاتية

### 2. الحفظ التلقائي في Firebase
- حفظ تلقائي عند تغيير أي معلومة
- حفظ عند التنقل بين الخطوات (التالي/السابق)
- مزامنة فورية مع Firestore
- العمل في وضع عدم الاتصال مع التزامن عند العودة

### 3. تتبع حالة الحفظ
- عرض حالة الحفظ المحلي
- عرض حالة المزامنة مع Firebase
- إشعارات عند نجاح أو فشل الحفظ
- عرض التغييرات المعلقة عند عدم وجود إنترنت

## الملفات الجديدة

### 1. Firebase Configuration
```
src/lib/firebase.ts - إعداد Firebase
src/lib/firestore.ts - خدمات Firestore
```

### 2. Firebase Store
```
src/store/firebaseStore.ts - إدارة حالة Firebase
```

### 3. Hooks
```
src/hooks/useFirebaseResumes.ts - إدارة السير الذاتية
src/hooks/useOnlineStatus.ts - تتبع حالة الإنترنت
```

### 4. Components
```
src/components/ResumesManagement.tsx - صفحة إدارة السير الذاتية
src/app/resumes/page.tsx - صفحة قائمة السير الذاتية
```

## كيفية الاستخدام

### 1. إنشاء سيرة ذاتية جديدة
1. انتقل إلى `/resumes`
2. اضغط على "إنشاء سيرة ذاتية جديدة"
3. أدخل العنوان والقالب واللغة
4. سيتم توجيهك لمنشئ السيرة الذاتية

### 2. تعديل سيرة ذاتية موجودة
1. من صفحة السير الذاتية `/resumes`
2. اضغط على أيقونة التعديل
3. سيتم فتح منشئ السيرة الذاتية مع البيانات المحفوظة

### 3. الحفظ التلقائي
- يتم الحفظ تلقائياً عند:
  - تغيير أي معلومة في النموذج
  - الانتقال بين الخطوات
  - الضغط على التالي أو السابق
- يمكن رؤية حالة الحفظ في الزاوية العلوية

## البنية التقنية

### 1. Firestore Collections
```
resumes/
  - id: string (auto-generated)
  - title: string
  - userId: string
  - personalInfo: object
  - education: array
  - experience: array
  - skills: array
  - languages: array
  - hobbies: array
  - courses: array
  - references: array
  - achievements: array
  - customSections: array
  - template: string
  - theme: object
  - sectionOrder: array
  - hiddenSections: array
  - createdAt: timestamp
  - updatedAt: timestamp
  - language: string
```

### 2. State Management
- **Local Store (Zustand)**: للحالة المحلية والحفظ السريع
- **Firebase Store**: لإدارة المزامنة مع Firestore
- **Automatic Sync**: مزامنة تلقائية بين الاثنين

### 3. Offline Support
- العمل في وضع عدم الاتصال
- حفظ التغييرات محلياً
- مزامنة تلقائية عند العودة للاتصال

## API Functions

### ResumeService
```typescript
// إنشاء سيرة ذاتية
ResumeService.createResume(resumeData, userId)

// تحديث سيرة ذاتية
ResumeService.updateResume(resumeId, updates, userId)

// جلب سيرة ذاتية
ResumeService.getResume(resumeId, userId)

// جلب جميع السير الذاتية للمستخدم
ResumeService.getUserResumes(userId)

// حفظ قسم محدد
ResumeService.savePersonalInfo(resumeId, userId, personalInfo)
ResumeService.saveEducation(resumeId, userId, education)
// ... إلخ
```

### Hooks
```typescript
// إدارة السير الذاتية
const { resumes, createResume, updateResume, deleteResume } = useFirebaseResumes(userId)

// الحفظ التلقائي
const { saving, savePersonalInfo, saveEducation } = useAutoSaveFirebase(resumeId, userId)

// حالة الإنترنت
const isOnline = useOnlineStatus()
```

## التحديثات على الملفات الموجودة

### 1. resumeStore.ts
- إضافة تكامل مع Firebase Store
- حفظ تلقائي في Firebase عند تحديث البيانات
- مزامنة عند تغيير الخطوات

### 2. SaveStatus.tsx
- عرض حالة الحفظ المحلي والسحابي
- إشعارات المزامنة
- عرض أخطاء المزامنة

### 3. builder/page.tsx
- دعم تحميل السيرة الذاتية من URL parameter
- تكامل مع Firebase للجلب والحفظ
- تحسين تجربة المستخدم

## الاستخدام في البيئة الحقيقية

### 1. نظام التوثيق
حالياً يتم استخدام `temp-user-id` كمعرف مؤقت. في البيئة الحقيقية:
```typescript
// استبدال
const userId = 'temp-user-id';

// بـ
const { user } = useAuth(); // من نظام التوثيق الحقيقي
const userId = user?.uid;
```

### 2. Security Rules
يجب إضافة قواعد الأمان في Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 3. التحسينات المقترحة
- إضافة مشاركة السير الذاتية
- نظام النسخ الاحتياطية
- تصدير متعدد الأشكال
- قوالب مخصصة
- تعاون متعدد المستخدمين

## الاختبار

للاختبار المحلي:
1. تأكد من إعداد Firebase Config صحيح
2. تشغيل المشروع: `npm run dev`
3. انتقل إلى `/resumes` لإدارة السير الذاتية
4. انتقل إلى `/builder` لإنشاء سيرة ذاتية جديدة
5. اختبر الحفظ التلقائي بتعديل المعلومات

## المساعدة والدعم

لأي مشاكل أو أسئلة، تحقق من:
- Console logs للأخطاء
- Network tab في Developer Tools للتحقق من طلبات Firebase
- Firebase Console لرؤية البيانات المحفوظة
