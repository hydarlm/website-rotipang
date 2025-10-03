import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CircleCheck as CheckCircle, Clock, Package, Truck, CheckCheck, Circle as XCircle, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/customer/navbar';
import { Footer } from '@/components/customer/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/lib/format';

export const revalidate = 0;

async function getOrder(orderNumber: string) {
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error || !order) {
    return null;
  }

  return order;
}

const statusConfig = {
  pending: { label: 'Menunggu Pembayaran', icon: Clock, color: 'bg-yellow-500' },
  confirmed: { label: 'Dikonfirmasi', icon: CheckCircle, color: 'bg-blue-500' },
  processing: { label: 'Diproses', icon: Package, color: 'bg-purple-500' },
  ready: { label: 'Siap Diambil/Dikirim', icon: Truck, color: 'bg-green-500' },
  completed: { label: 'Selesai', icon: CheckCheck, color: 'bg-gray-500' },
  cancelled: { label: 'Dibatalkan', icon: XCircle, color: 'bg-red-500' },
};

const paymentStatusConfig = {
  pending: { label: 'Belum Dibayar', color: 'bg-yellow-500' },
  paid: { label: 'Sudah Dibayar', color: 'bg-green-500' },
  failed: { label: 'Gagal', color: 'bg-red-500' },
};

export default async function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await getOrder(params.orderNumber);

  if (!order) {
    notFound();
  }

  const statusInfo = statusConfig[order.order_status as keyof typeof statusConfig];
  const paymentInfo = paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig];
  const whatsappNumber = '6281234567890';
  const whatsappMessage = encodeURIComponent(
    `Halo, saya ingin bertanya tentang pesanan saya dengan Order ID: ${order.order_number}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 px-4 flex-1 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Pesanan Diterima!</h1>
          <p className="text-muted-foreground">
            Terima kasih telah memesan di RotipanG
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order ID: {order.order_number}</CardTitle>
              <Badge className={`${statusInfo.color} text-white`}>
                {statusInfo.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Pesanan</p>
              <p className="font-semibold">{formatDate(order.created_at)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status Pembayaran</p>
              <Badge className={`${paymentInfo.color} text-white`}>
                {paymentInfo.label}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
              <p className="font-semibold capitalize">{order.payment_method.replace('-', ' ')}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Metode Pengiriman</p>
              <p className="font-semibold capitalize">
                {order.delivery_method === 'pickup' ? 'Ambil di Toko' : 'Delivery'}
              </p>
            </div>

            {order.pickup_time && (
              <div>
                <p className="text-sm text-muted-foreground">Waktu Pengambilan</p>
                <p className="font-semibold">{formatDate(order.pickup_time)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-700">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informasi Pembeli</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-semibold">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <p className="font-semibold">{order.customer_phone}</p>
            </div>
            {order.address && (
              <div>
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-semibold">{order.address}</p>
              </div>
            )}
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Catatan</p>
                <p className="font-semibold">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Hubungi via WhatsApp
            </Button>
          </a>

          <Link href="/products">
            <Button variant="outline" className="w-full" size="lg">
              Belanja Lagi
            </Button>
          </Link>
        </div>

        {order.payment_status === 'pending' && (
          <Card className="mt-6 border-amber-500 bg-amber-50">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                Informasi Pembayaran
              </p>
              <p className="text-sm text-amber-800">
                Silakan lakukan pembayaran dan konfirmasi melalui WhatsApp.
                Pesanan Anda akan diproses setelah pembayaran dikonfirmasi.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
