'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/customer/navbar';
import { Footer } from '@/components/customer/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/lib/store';
import { formatCurrency, generateOrderNumber } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    paymentMethod: 'transfer',
    notes: '',
    pickupTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Nama dan nomor WhatsApp wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();
      const totalAmount = getTotalPrice();

      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          address: formData.deliveryMethod === 'delivery' ? formData.address : null,
          delivery_method: formData.deliveryMethod,
          payment_method: formData.paymentMethod,
          total_amount: totalAmount,
          notes: formData.notes || null,
          pickup_time: formData.pickupTime || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.name,
      }));

      const { error: itemsError } = await (supabase as any)
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast.success('Pesanan berhasil dibuat!');
      router.push(`/order/${orderNumber}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 px-4 flex-1 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pembeli</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="customerPhone">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metode Pengiriman</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.deliveryMethod}
                onValueChange={(value: 'pickup' | 'delivery') =>
                  setFormData({ ...formData, deliveryMethod: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Ambil di Toko</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Delivery</Label>
                </div>
              </RadioGroup>

              {formData.deliveryMethod === 'delivery' && (
                <div className="mt-4">
                  <Label htmlFor="address">Alamat Pengiriman</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              )}

              <div className="mt-4">
                <Label htmlFor="pickupTime">Waktu Pengambilan (Opsional)</Label>
                <Input
                  id="pickupTime"
                  type="datetime-local"
                  value={formData.pickupTime}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupTime: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">Transfer Bank</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="e-wallet" id="e-wallet" />
                  <Label htmlFor="e-wallet">E-Wallet (GoPay, OVO, Dana)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catatan Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Contoh: Tolong dipacking rapi"
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-amber-700">{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-6"
          >
            {loading ? 'Memproses...' : 'Buat Pesanan'}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
