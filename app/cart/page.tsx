'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, Store } from 'lucide-react';
import { Navbar } from '@/components/customer/navbar';
import { Footer } from '@/components/customer/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/format';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
            <p className="text-muted-foreground mb-6">
              Belum ada produk dalam keranjang Anda
            </p>
            <Button
              onClick={() => router.push('/products')}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Mulai Belanja
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 px-4 flex-1 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-amber-700 font-bold mb-2">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="sticky bottom-4 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-amber-700">
                {formatCurrency(getTotalPrice())}
              </span>
            </div>
            <Button
              onClick={() => router.push('/checkout')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
            >
              Checkout
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
