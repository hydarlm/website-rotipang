'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/format';
import { toast } from 'sonner';

export default function AdminFinancePage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidOrders: 0,
    pendingAmount: 0,
    todayRevenue: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalRevenue = orders
        ?.filter((o: any) => o.payment_status === 'paid')
        .reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0;

      const paidOrders = orders?.filter((o: any) => o.payment_status === 'paid').length || 0;

      const pendingAmount = orders
        ?.filter((o: any) => o.payment_status === 'pending')
        .reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0;

      const todayRevenue = orders
        ?.filter((o: any) => {
          const orderDate = new Date(o.created_at);
          return (
            orderDate >= today &&
            o.payment_status === 'paid'
          );
        })
        .reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0;

      setStats({
        totalRevenue,
        paidOrders,
        pendingAmount,
        todayRevenue,
      });

      setTransactions(orders || []);
    } catch (error) {
      toast.error('Gagal memuat data keuangan');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Tanggal', 'Order ID', 'Pelanggan', 'Total', 'Metode Pembayaran', 'Status'];
    const rows = transactions.map((t) => [
      formatDate(t.created_at),
      t.order_number,
      t.customer_name,
      t.total_amount,
      t.payment_method,
      t.payment_status,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-keuangan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('Laporan berhasil diexport');
  };

  if (loading) return <p>Memuat data...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pemasukan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.paidOrders} pesanan lunas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pemasukan Hari Ini
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Pembayaran
            </CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Transaksi
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Tanggal</th>
                  <th className="text-left py-3 px-2">Order ID</th>
                  <th className="text-left py-3 px-2">Pelanggan</th>
                  <th className="text-right py-3 px-2">Total</th>
                  <th className="text-left py-3 px-2">Metode</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3 px-2 text-sm">
                      {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-2 text-sm font-mono">
                      {transaction.order_number}
                    </td>
                    <td className="py-3 px-2 text-sm">{transaction.customer_name}</td>
                    <td className="py-3 px-2 text-sm text-right font-semibold">
                      {formatCurrency(transaction.total_amount)}
                    </td>
                    <td className="py-3 px-2 text-sm capitalize">
                      {transaction.payment_method.replace('-', ' ')}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
