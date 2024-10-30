//เช็ค token 
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      router.push('/'); 
    }
  }, []);
}
