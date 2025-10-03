'use client';

import Image from 'next/image';
import { Plus, CircleAlert as AlertCircle, Store } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/supabase';
import { formatCurrency } from '@/lib/format';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product.available) {
      toast.error('Produk sedang tidak tersedia');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Store className="h-16 w-16 text-gray-300" />
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              Habis
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">
          {product.category}
        </Badge>
        <h3 className="font-semibold text-base mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description || 'Produk berkualitas dari RotipanG'}
        </p>
        <p className="text-lg font-bold text-amber-700">
          {formatCurrency(product.price)}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.available}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah ke Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
}
