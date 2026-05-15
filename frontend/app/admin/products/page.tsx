'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import type { Product, Category } from '@/types';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryIds: number[];
}

const emptyForm: ProductForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryIds: [] };

function ProductFormPanel({
  initial,
  categories,
  onSave,
  onCancel,
  isLoading,
}: {
  initial: ProductForm;
  categories: Category[];
  onSave: (form: ProductForm) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<ProductForm>(initial);

  const toggleCategory = (id: number) =>
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));

  return (
    <div className="rounded-2xl border p-6 mb-6" style={{ borderColor: '#e5e7eb', backgroundColor: '#ffffff' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Nombre *</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#e5e7eb' }}
            placeholder="Nombre del producto"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Precio *</label>
          <input
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#e5e7eb' }}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Stock *</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#e5e7eb' }}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>URL imagen</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor: '#e5e7eb' }}
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor: '#e5e7eb' }}
            placeholder="Descripción opcional"
          />
        </div>
        {categories.length > 0 && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-2" style={{ color: '#374151' }}>Categorías</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  style={
                    form.categoryIds.includes(cat.id)
                      ? { backgroundColor: '#059669', color: '#ffffff' }
                      : { backgroundColor: '#f3f4f6', color: '#374151' }
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={() => onSave(form)}
          disabled={isLoading || !form.name || !form.price || !form.stock}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#059669', color: '#ffffff' }}
        >
          <Check size={15} />
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-gray-100"
          style={{ color: '#374151' }}
        >
          <X size={15} />
          Cancelar
        </button>
      </div>
    </div>
  );
}

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () =>
    api.get<{ items: Product[] }>('/products?limit=100')
      .then((d) => setProducts(d.items))
      .catch(() => toast.error('Error al cargar productos'));

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      api.get<Category[]>('/categories').then(setCategories).catch(() => {}),
    ]).finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (form: ProductForm) => {
    setSaving(true);
    try {
      await api.post('/products', {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl || undefined,
        categoryIds: form.categoryIds,
      });
      toast.success('Producto creado');
      setMode('list');
      await fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear producto');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form: ProductForm) => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      await api.put(`/products/${editingProduct.id}`, {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl || undefined,
        categoryIds: form.categoryIds,
      });
      toast.success('Producto actualizado');
      setMode('list');
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (product: Product) => {
    if (!confirm(`¿Desactivar "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      toast.success('Producto desactivado');
      await fetchProducts();
    } catch {
      toast.error('Error al desactivar el producto');
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setMode('edit');
  };

  const editInitial = editingProduct
    ? {
        name: editingProduct.name,
        description: editingProduct.description ?? '',
        price: String(editingProduct.price),
        stock: String(editingProduct.stock),
        imageUrl: editingProduct.imageUrl ?? '',
        categoryIds: editingProduct.categories.map((c) => c.id),
      }
    : emptyForm;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#111111' }}>Productos</h1>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#059669', color: '#ffffff' }}
          >
            <Plus size={15} />
            Nuevo producto
          </button>
        )}
      </div>

      {mode === 'create' && (
        <ProductFormPanel
          initial={emptyForm}
          categories={categories}
          onSave={handleCreate}
          onCancel={() => setMode('list')}
          isLoading={saving}
        />
      )}

      {mode === 'edit' && editingProduct && (
        <ProductFormPanel
          initial={editInitial}
          categories={categories}
          onSave={handleEdit}
          onCancel={() => { setMode('list'); setEditingProduct(null); }}
          isLoading={saving}
        />
      )}

      {isLoading ? (
        <div className="py-20 text-center text-sm" style={{ color: '#9ca3af' }}>Cargando...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-sm" style={{ color: '#9ca3af' }}>No hay productos</div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#f3f4f6' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Producto</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell" style={{ color: '#6b7280' }}>Precio</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#6b7280' }}>Stock</th>
                <th className="text-right px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : undefined, backgroundColor: '#ffffff' }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: '#111111' }}>{product.name}</p>
                    {product.categories.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                        {product.categories.map((c) => c.name).join(', ')}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell" style={{ color: '#374151' }}>
                    ${Number(product.price).toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span
                      className="font-medium"
                      style={{ color: product.stock > 0 ? '#059669' : '#ef4444' }}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: '#6b7280' }}
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeactivate(product)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        style={{ color: '#ef4444' }}
                        aria-label="Desactivar"
                      >
                        <Trash2 size={15} />
                      </button>
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

export default function AdminProductsPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminProductsContent />
    </ProtectedRoute>
  );
}
