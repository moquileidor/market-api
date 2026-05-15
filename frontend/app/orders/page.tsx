'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { Order } from '@/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_STYLE: Record<Order['status'], { backgroundColor: string; color: string }> = {
  pending: { backgroundColor: '#fef9c3', color: '#854d0e' },
  paid: { backgroundColor: '#dcfce7', color: '#166534' },
  shipped: { backgroundColor: '#dbeafe', color: '#1e40af' },
  delivered: { backgroundColor: '#f0fdf4', color: '#15803d' },
  cancelled: { backgroundColor: '#fee2e2', color: '#991b1b' },
};

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }

    api.get<Order[]>('/orders')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="py-32 text-center text-sm" style={{ color: '#9ca3af' }}>
        Cargando órdenes...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ color: '#111111' }}>Mis órdenes</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={48} className="mb-4" style={{ color: '#d1d5db' }} />
          <p className="text-lg font-semibold" style={{ color: '#111111' }}>Aún no tienes pedidos</p>
          <p className="text-sm mt-1 mb-6" style={{ color: '#6b7280' }}>
            Cuando realices un pedido aparecerá aquí
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#059669', color: '#ffffff' }}
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between p-5 rounded-2xl border hover:border-gray-300 transition-colors"
              style={{ borderColor: '#f3f4f6', backgroundColor: '#ffffff' }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: '#111111' }}>
                  Pedido #{order.id}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                  {new Date(order.createdAt).toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium" style={{ color: '#111111' }}>
                  ${Number(order.total).toLocaleString('es-CO')} COP
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={STATUS_STYLE[order.status]}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
