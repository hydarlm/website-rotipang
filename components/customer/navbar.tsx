'use client';

import Link from 'next/link';
import { ShoppingCart, Store } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-amber-600" />
          <span className="text-xl font-bold text-amber-900">RotipanG</span>
        </Link>

        <Link href="/cart" className="relative">
          <ShoppingCart className="h-6 w-6 text-amber-900" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Link>
      </div>
    </nav>
  );
}
