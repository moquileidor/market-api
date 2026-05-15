import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import type { Product, ProductsResponse } from '@/types';

export const dynamic = 'force-dynamic';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function getProducts(params: Record<string, string>): Promise<ProductsResponse> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/products${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message);
  return json.data;
}

async function getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const res = await fetch(`${API}/categories`, { cache: 'no-store' });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const [data, categories] = await Promise.allSettled([
    getProducts(params),
    getCategories(),
  ]);

  if (data.status === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-semibold" style={{ color: '#111111' }}>No se pudo conectar con el backend</p>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Verifica que el servidor esté corriendo en el puerto 3001.</p>
      </div>
    );
  }

  const products: Product[] = data.value.items;
  const cats = categories.status === 'fulfilled' ? categories.value : [];
  const currentCategory = params.category ?? ''; // used for pagination links

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#111111' }}>Catálogo</h1>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          {data.value.pagination.total} producto{data.value.pagination.total !== 1 ? 's' : ''} disponibles
        </p>
      </div>

      {/* Filters row */}
      <CategoryFilter categories={cats} />

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24" style={{ color: '#9ca3af' }}>
          <p className="text-lg">No hay productos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {data.value.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: data.value.pagination.totalPages }, (_, i) => i + 1).map((n) => (
            <a
              key={n}
              href={`?page=${n}${currentCategory ? `&category=${currentCategory}` : ''}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
              style={
                n === data.value.pagination.page
                  ? { backgroundColor: '#059669', color: '#ffffff' }
                  : { backgroundColor: '#f3f4f6', color: '#374151' }
              }
            >
              {n}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
