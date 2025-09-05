'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirebaseTestPage() {
  const [status, setStatus] = useState('جاري الاختبار...');
  const [testData, setTestData] = useState<any[]>([]);
  const [testCollectionData, setTestCollectionData] = useState<any[]>([]);

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
        const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
        setStatus(`فشل الاتصال بفايربيس: ${errorMessage}`);

        // إضافة معلومات إضافية للمساعدة في حل المشكلة
        if (errorMessage.includes('Missing or insufficient permissions')) {
          setStatus(prev => prev + '\n\n🔧 الحل: قم بنشر قواعد Firestore من خلال Firebase Console أو CLI');
        }
      }
    };

    testConnection();
  }, []);

  const sendTestData = async () => {
    try {
      const docRef = await addDoc(collection(db, 'الاختبار'), {
        message: 'بيانات اختبار لمجموعة الاختبار',
        timestamp: new Date(),
        user: 'مستخدم تجريبي',
      });
      console.log('تم إرسال البيانات إلى الاختبار:', docRef.id);
      setStatus('تم إرسال البيانات بنجاح إلى مجموعة الاختبار!');

      // قراءة البيانات من مجموعة الاختبار
      const querySnapshot = await getDocs(collection(db, 'الاختبار'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestCollectionData(data);
    } catch (error) {
      console.error('خطأ في إرسال البيانات:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      setStatus(`فشل إرسال البيانات: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">اختبار اتصال فايربيس</h1>
      <p className="mb-4">{status}</p>
      <button
        onClick={sendTestData}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        إرسال بيانات اختبار إلى مجموعة الاختبار
      </button>
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
      {testCollectionData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">البيانات من مجموعة الاختبار:</h2>
          <ul>
            {testCollectionData.map((item) => (
              <li key={item.id} className="mb-2">
                <strong>ID:</strong> {item.id} <br />
                <strong>الرسالة:</strong> {item.message} <br />
                <strong>المستخدم:</strong> {item.user} <br />
                <strong>الوقت:</strong> {item.timestamp?.toDate?.()?.toString() || item.timestamp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
