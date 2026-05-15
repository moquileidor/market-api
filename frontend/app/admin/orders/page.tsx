'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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

const ALL_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;

function AdminOrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    api.get<Order[]>('/orders')
      .then(setOrders)
      .catch(() => toast.error('Error al cargar órdenes'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusChange = async (orderId: number, status: Order['status']) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success('Estado actualizado');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar estado');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#111111' }}>Gestión de órdenes</h1>

      {isLoading ? (
        <div className="py-20 text-center text-sm" style={{ color: '#9ca3af' }}>Cargando...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center text-sm" style={{ color: '#9ca3af' }}>No hay órdenes</div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#f3f4f6' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Pedido</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#6b7280' }}>Fecha</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell" style={{ color: '#6b7280' }}>Total</th>
                <th className="text-right px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : undefined, backgroundColor: '#ffffff' }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: '#111111' }}>#{order.id}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                      {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#6b7280' }}>
                    {new Date(order.createdAt).toLocaleDateString('es-CO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell font-medium" style={{ color: '#111111' }}>
                    ${Number(order.total).toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="px-2.5 py-1 rounded-full text-xs font-medium border-0 outline-none cursor-pointer disabled:opacity-50"
                        style={STATUS_STYLE[order.status]}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s} style={{ backgroundColor: '#ffffff', color: '#111111' }}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}
