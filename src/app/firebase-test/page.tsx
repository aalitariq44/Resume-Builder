'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirebaseTestPage() {
  const [status, setStatus] = useState('جاري الاختبار...');
  const [testData, setTestData] = useState<any[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // إضافة وثيقة اختبار
        const docRef = await addDoc(collection(db, 'test'), {
          message: 'اختبار اتصال Firebase',
          timestamp: new Date(),
        });
        console.log('تم إضافة وثيقة اختبار:', docRef.id);

        // قراءة البيانات من مجموعة الاختبار
        const querySnapshot = await getDocs(collection(db, 'test'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTestData(data);

        setStatus('نجح الاتصال بفايربيس!');
      } catch (error) {
        console.error('خطأ في الاتصال:', error);
        setStatus('فشل الاتصال بفايربيس: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      }
    };

    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">اختبار اتصال فايربيس</h1>
      <p className="mb-4">{status}</p>
      {testData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">البيانات المسترجعة:</h2>
          <ul>
            {testData.map((item) => (
              <li key={item.id} className="mb-2">
                <strong>ID:</strong> {item.id} <br />
                <strong>الرسالة:</strong> {item.message} <br />
                <strong>الوقت:</strong> {item.timestamp?.toDate?.()?.toString() || item.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
