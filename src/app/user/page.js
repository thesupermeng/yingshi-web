'use client';
import { LoadingPage } from '@/components/loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push('/user/home');
  }, []);

  return <LoadingPage full />;
}
