'use client';

import AuthProvider from '@/components/auth/AuthProvider';
import ResumesManager from '@/components/ResumesManager';

export default function HomePage() {
  return (
    <AuthProvider>
      <ResumesManager />
    </AuthProvider>
  );
}
