import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "بناء السيرة الذاتية | Resume Builder",
  description: "قم بإنشاء سيرة ذاتية احترافية باللغة العربية والإنجليزية مع تصاميم حديثة وإمكانية التحميل كـ PDF",
  keywords: ["سيرة ذاتية", "cv", "resume", "وظائف", "عمل", "احترافي"],
  authors: [{ name: "Resume Builder Team" }],
  creator: "Resume Builder",
  publisher: "Resume Builder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    url: "https://resume-builder.com",
    title: "بناء السيرة الذاتية | Resume Builder",
    description: "قم بإنشاء سيرة ذاتية احترافية باللغة العربية والإنجليزية",
    siteName: "Resume Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "بناء السيرة الذاتية | Resume Builder",
    description: "قم بإنشاء سيرة ذاتية احترافية باللغة العربية والإنجليزية",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-arabic antialiased",
          inter.variable,
          cairo.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
