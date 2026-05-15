import Link from 'next/link';
import { ShoppingCart, User, Store } from 'lucide-react';

export function Navbar() {
  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }} className="sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" style={{ color: '#111111' }}>
          <div style={{ backgroundColor: '#059669' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Store size={16} color="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">MarketAPI</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: '#6b7280' }}>
          <Link href="/" className="hover:text-black transition-colors">Productos</Link>
          <Link href="/orders" className="hover:text-black transition-colors">Mis órdenes</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: '#374151' }}
            aria-label="Carrito"
          >
            <ShoppingCart size={20} />
          </Link>
          <Link
            href="/login"
            className="ml-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#059669', color: '#ffffff' }}
            aria-label="Iniciar sesión"
          >
            <span className="hidden sm:inline">Iniciar sesión</span>
            <User size={18} className="sm:hidden" />
          </Link>
        </div>
      </div>
    </header>
  );
}
