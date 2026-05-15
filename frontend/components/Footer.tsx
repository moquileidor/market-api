import Link from 'next/link';
import { Store } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }} className="mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div style={{ backgroundColor: '#059669' }} className="w-7 h-7 rounded-md flex items-center justify-center">
              <Store size={14} color="white" />
            </div>
            <span className="font-bold text-sm" style={{ color: '#111111' }}>MarketAPI</span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: '#9ca3af' }}>
            <Link href="/" className="hover:text-gray-700 transition-colors">Productos</Link>
            <Link href="/orders" className="hover:text-gray-700 transition-colors">Órdenes</Link>
            <Link href="/login" className="hover:text-gray-700 transition-colors">Mi cuenta</Link>
          </div>
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Estud-IA Tech · Alcaldía de Medellín
          </p>
        </div>
      </div>
    </footer>
  );
}
