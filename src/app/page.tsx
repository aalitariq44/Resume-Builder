'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: "📝",
      title: "نماذج متعددة الخطوات",
      description: "إنشاء السيرة الذاتية خطوة بخطوة مع إرشادات واضحة"
    },
    {
      icon: "🎨",
      title: "تصاميم احترافية",
      description: "اختر من مجموعة متنوعة من القوالب الحديثة والأنيقة"
    },
    {
      icon: "🌐",
      title: "دعم متعدد اللغات",
      description: "إنشاء السيرة الذاتية باللغة العربية والإنجليزية"
    },
    {
      icon: "📄",
      title: "تصدير عالي الجودة",
      description: "تحميل السيرة الذاتية بصيغة PDF عالية الجودة"
    },
    {
      icon: "💾",
      title: "حفظ تلقائي",
      description: "حفظ تلقائي لبياناتك أثناء العمل"
    },
    {
      icon: "🎯",
      title: "تخصيص كامل",
      description: "تخصيص الألوان والخطوط والتخطيط حسب ذوقك"
    }
  ];

  const templates = [
    {
      id: "classic",
      name: "كلاسيكي",
      description: "تصميم تقليدي وأنيق",
      preview: "/templates/classic-preview.jpg",
      popular: true
    },
    {
      id: "modern",
      name: "حديث",
      description: "تصميم عصري ونظيف",
      preview: "/templates/modern-preview.jpg",
      popular: true
    },
    {
      id: "creative",
      name: "إبداعي",
      description: "تصميم ملون ومبتكر",
      preview: "/templates/creative-preview.jpg",
      popular: false
    },
    {
      id: "technical",
      name: "تقني",
      description: "مناسب للمطورين والمهندسين",
      preview: "/templates/technical-preview.jpg",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">📄</span>
              </div>
              <span className="font-bold text-xl">بناء السيرة الذاتية</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link href="#templates" className="text-sm font-medium hover:text-primary transition-colors">
              القوالب
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              المميزات
            </Link>
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              حول
            </Link>
          </nav>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="outline" size="sm">
              تسجيل الدخول
            </Button>
            <Button size="sm">
              إنشاء حساب
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              أنشئ سيرة ذاتية
              <span className="text-primary"> احترافية </span>
              في دقائق
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              قم بإنشاء سيرة ذاتية مميزة باللغة العربية والإنجليزية مع تصاميم حديثة 
              وأدوات احترافية لضمان حصولك على الوظيفة المناسبة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/builder">
                <Button size="lg" className="text-lg px-8 py-6">
                  ابدأ الآن مجاناً
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                شاهد العرض التوضيحي
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نقدم لك أفضل الأدوات والمميزات لإنشاء سيرة ذاتية احترافية ومتميزة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              قوالب احترافية متنوعة
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اختر من مجموعة واسعة من القوالب المصممة بعناية لتناسب مختلف المجالات والأذواق
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative overflow-hidden">
                    {template.popular && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          الأكثر شعبية
                        </span>
                      </div>
                    )}
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-4xl text-gray-400">📄</div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      معاينة القالب
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/builder">
              <Button size="lg" className="text-lg px-8 py-6">
                ابدأ إنشاء سيرتك الذاتية
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز لإنشاء سيرتك الذاتية؟
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              انضم إلى آلاف المستخدمين الذين حصلوا على وظائف أحلامهم
            </p>
            <Link href="/builder">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                ابدأ مجاناً الآن
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">📄</span>
                </div>
                <span className="font-bold">بناء السيرة الذاتية</span>
              </div>
              <p className="text-muted-foreground">
                منصة احترافية لإنشاء السير الذاتية باللغة العربية والإنجليزية
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">المنتج</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">القوالب</Link></li>
                <li><Link href="#" className="hover:text-foreground">المميزات</Link></li>
                <li><Link href="#" className="hover:text-foreground">الأسعار</Link></li>
                <li><Link href="#" className="hover:text-foreground">التحديثات</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">الدعم</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">مركز المساعدة</Link></li>
                <li><Link href="#" className="hover:text-foreground">الأسئلة الشائعة</Link></li>
                <li><Link href="#" className="hover:text-foreground">تواصل معنا</Link></li>
                <li><Link href="#" className="hover:text-foreground">البلاغات</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">الشركة</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">من نحن</Link></li>
                <li><Link href="#" className="hover:text-foreground">المدونة</Link></li>
                <li><Link href="#" className="hover:text-foreground">الوظائف</Link></li>
                <li><Link href="#" className="hover:text-foreground">الشركاء</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2025 بناء السيرة الذاتية. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4 space-x-reverse mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                سياسة الخصوصية
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
