'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Cuenta creada. ¡Bienvenido!');
      router.push('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#111111' }}>Crear cuenta</h1>
        <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: '#059669' }} className="font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}
            />
          </div>

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
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
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
              placeholder="Mínimo 6 caracteres"
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
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
