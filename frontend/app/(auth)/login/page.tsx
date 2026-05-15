'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Bienvenido de vuelta');
      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#111111' }}>Iniciar sesión</h1>
        <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" style={{ color: '#059669' }} className="font-medium hover:underline">
            Regístrate
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60 hover:opacity-90 mt-2"
            style={{ backgroundColor: '#059669', color: '#ffffff' }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
