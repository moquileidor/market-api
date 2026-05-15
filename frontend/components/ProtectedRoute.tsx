'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  role?: 'admin' | 'customer';
  children: ReactNode;
}

export function ProtectedRoute({ role, children }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (role && user.role !== role) { router.replace('/'); return; }
  }, [user, isLoading, role, router]);

  if (isLoading || !user || (role && user.role !== role)) {
    return (
      <div className="py-32 text-center text-sm" style={{ color: '#9ca3af' }}>
        Verificando acceso...
      </div>
    );
  }

  return <>{children}</>;
}
