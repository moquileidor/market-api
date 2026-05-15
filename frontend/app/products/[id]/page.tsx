import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, Tag } from 'lucide-react';
import { AddToCartButton } from '@/components/AddToCartButton';

async function getProduct(id: string): Promise<Product> {
  const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/products/${id}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = await res.json();
  if (!json.success) notFound();
  return json.data;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const inStock = product.stock > 0;

  return (
    <div>
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-black"
        style={{ color: '#6b7280' }}
      >
        <ArrowLeft size={15} />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ height: '420px', backgroundColor: '#f3f4f6' }}
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: '#d1d5db' }}>
              <Package size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.categories.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#f0fdf4', color: '#059669' }}
                >
                  <Tag size={11} />
                  {c.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: '#111111' }}>
            {product.name}
          </h1>

          {product.description && (
            <p className="text-base leading-relaxed mb-6" style={{ color: '#6b7280' }}>
              {product.description}
            </p>
          )}

          {/* Price */}
          <div
            className="flex items-baseline gap-2 py-5 border-y mb-6"
            style={{ borderColor: '#f3f4f6' }}
          >
            <span className="text-4xl font-bold" style={{ color: '#111111' }}>
              ${Number(product.price).toLocaleString('es-CO')}
            </span>
            <span className="text-sm" style={{ color: '#9ca3af' }}>COP</span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-8">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: inStock ? '#059669' : '#ef4444' }}
            />
            <span className="text-sm font-medium" style={{ color: inStock ? '#059669' : '#ef4444' }}>
              {inStock ? `${product.stock} unidades disponibles` : 'Sin stock'}
            </span>
          </div>

          {/* CTA */}
          <AddToCartButton productId={product.id} inStock={inStock} />

          {!inStock && (
            <p className="text-xs text-center mt-3" style={{ color: '#9ca3af' }}>
              Este producto no está disponible por el momento.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
