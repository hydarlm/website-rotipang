'use client';

import { useState, useEffect } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { supabase, Order } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/format';
import { toast } from 'sonner';

interface OrderWithItems extends Order {
  order_items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    field: 'order_status' | 'payment_status',
    value: string
  ) => {
    try {
      const { error } = await (supabase as any)
        .from('orders')
        .update({ [field]: value })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Status berhasil diupdate');
      loadOrders();

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, [field]: value } as OrderWithItems);
      }
    } catch (error) {
      toast.error('Gagal mengupdate status');
    }
  };

  const getStatusBadge = (status: string, type: 'order' | 'payment') => {
    const config = {
      order: {
        pending: 'bg-yellow-500',
        confirmed: 'bg-blue-500',
        processing: 'bg-purple-500',
        ready: 'bg-green-500',
        completed: 'bg-gray-500',
        cancelled: 'bg-red-500',
      },
      payment: {
        pending: 'bg-yellow-500',
        paid: 'bg-green-500',
        failed: 'bg-red-500',
      },
    };

    const colorClass = type === 'order'
      ? config.order[status as keyof typeof config.order]
      : config.payment[status as keyof typeof config.payment];

    return (
      <Badge className={`${colorClass} text-white`}>
        {status}
      </Badge>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
        <Button variant="outline" onClick={loadOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <p>Memuat pesanan...</p>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada pesanan
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{order.order_number}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(order.created_at)}
                    </p>
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-700 mb-2">
                      {formatCurrency(order.total_amount)}
                    </p>
                    {getStatusBadge(order.order_status, 'order')}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Informasi Pesanan</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Order ID:</strong> {selectedOrder.order_number}</p>
                  <p><strong>Tanggal:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedOrder.total_amount)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Informasi Pembeli</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Nama:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>WhatsApp:</strong> {selectedOrder.customer_phone}</p>
                  <p><strong>Pengiriman:</strong> {selectedOrder.delivery_method === 'pickup' ? 'Ambil di Toko' : 'Delivery'}</p>
                  {selectedOrder.address && (
                    <p><strong>Alamat:</strong> {selectedOrder.address}</p>
                  )}
                  {selectedOrder.notes && (
                    <p><strong>Catatan:</strong> {selectedOrder.notes}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Item Pesanan</h3>
                <div className="space-y-2">
                  {selectedOrder.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Status Pembayaran</Label>
                  <Select
                    value={selectedOrder.payment_status}
                    onValueChange={(value) =>
                      handleStatusUpdate(selectedOrder.id, 'payment_status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status Pesanan</Label>
                  <Select
                    value={selectedOrder.order_status}
                    onValueChange={(value) =>
                      handleStatusUpdate(selectedOrder.id, 'order_status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
