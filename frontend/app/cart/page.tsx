'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag size={48} className="mb-4" style={{ color: '#d1d5db' }} />
        <p className="text-lg font-semibold" style={{ color: '#111111' }}>
          Inicia sesión para ver tu carrito
        </p>
        <Link
          href="/login"
          className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#059669', color: '#ffffff' }}
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-32 text-center text-sm" style={{ color: '#9ca3af' }}>
        Cargando carrito...
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag size={48} className="mb-4" style={{ color: '#d1d5db' }} />
        <p className="text-lg font-semibold" style={{ color: '#111111' }}>Tu carrito está vacío</p>
        <p className="text-sm mt-1 mb-6" style={{ color: '#6b7280' }}>Agrega productos para continuar</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-medium"
          style={{ backgroundColor: '#059669', color: '#ffffff' }}
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const handleUpdate = async (itemId: number, qty: number) => {
    try {
      await updateItem(itemId, qty);
    } catch {
      toast.error('No se pudo actualizar la cantidad');
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast.success('Producto eliminado del carrito');
    } catch {
      toast.error('No se pudo eliminar el producto');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: '#111111' }}>Mi carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-2xl border"
              style={{ borderColor: '#f3f4f6', backgroundColor: '#ffffff' }}
            >
              <div
                className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                {item.product.imageUrl && (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.id}`}
                  className="font-semibold text-sm hover:underline block truncate"
                  style={{ color: '#111111' }}
                >
                  {item.product.name}
                </Link>
                <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                  ${Number(item.product.price).toLocaleString('es-CO')} COP
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      item.quantity > 1 ? handleUpdate(item.id, item.quantity - 1) : handleRemove(item.id)
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                    style={{ border: '1px solid #e5e7eb' }}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdate(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                    style={{ border: '1px solid #e5e7eb' }}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={13} />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-auto p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    style={{ color: '#ef4444' }}
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div
            className="p-6 rounded-2xl border sticky top-24"
            style={{ borderColor: '#f3f4f6', backgroundColor: '#ffffff' }}
          >
            <h2 className="font-semibold mb-4" style={{ color: '#111111' }}>Resumen</h2>

            <div className="flex justify-between text-sm mb-2" style={{ color: '#6b7280' }}>
              <span>
                {items.length} producto{items.length !== 1 ? 's' : ''}
              </span>
              <span>${total.toLocaleString('es-CO')} COP</span>
            </div>

            <div className="border-t my-4" style={{ borderColor: '#f3f4f6' }} />

            <div className="flex justify-between font-semibold mb-6" style={{ color: '#111111' }}>
              <span>Total</span>
              <span>${total.toLocaleString('es-CO')} COP</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#059669', color: '#ffffff' }}
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
