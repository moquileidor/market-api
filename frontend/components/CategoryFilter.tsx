'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

export function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('category') ?? '';
  const [isPending, startTransition] = useTransition();

  const navigate = (slug: string) => {
    startTransition(() => {
      const url = slug ? `/?category=${slug}` : '/';
      router.push(url);
      router.refresh();
    });
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap mb-8 transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}>
      <button
        onClick={() => navigate('')}
        className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        style={
          current === ''
            ? { backgroundColor: '#059669', color: '#ffffff' }
            : { backgroundColor: '#f3f4f6', color: '#374151' }
        }
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate(cat.slug)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
          style={
            current === cat.slug
              ? { backgroundColor: '#059669', color: '#ffffff' }
              : { backgroundColor: '#f3f4f6', color: '#374151' }
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
