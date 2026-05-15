'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Store, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    router.push('/');
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }} className="sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" style={{ color: '#111111' }}>
          <div style={{ backgroundColor: '#059669' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Store size={16} color="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">MarketAPI</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: '#6b7280' }}>
          <Link href="/" className="hover:text-black transition-colors">Productos</Link>
          {user && (
            <Link href="/orders" className="hover:text-black transition-colors">Mis órdenes</Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: '#374151' }}
            aria-label="Carrito"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: '#059669', color: '#ffffff' }}
              >
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-1 ml-1">
              <span
                className="hidden sm:block text-sm font-medium px-3 py-1.5 rounded-lg"
                style={{ color: '#374151', backgroundColor: '#f3f4f6' }}
              >
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg hover:bg-red-50 transition-colors"
                style={{ color: '#ef4444' }}
                aria-label="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
            >
              <User size={15} className="sm:hidden" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
