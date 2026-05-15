import type { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ height: '220px', backgroundColor: '#f3f4f6' }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: '#d1d5db' }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        {/* Category badge */}
        {product.categories.length > 0 && (
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#374151' }}
          >
            {product.categories[0].name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4 flex-1">
        <h3 className="font-semibold leading-snug line-clamp-2" style={{ color: '#111111', fontSize: '0.95rem' }}>
          {product.name}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: '#111111' }}>
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-lg font-medium"
            style={{ backgroundColor: '#f0fdf4', color: '#059669' }}
          >
            Ver más
          </span>
        </div>
      </div>
    </Link>
  );
}
