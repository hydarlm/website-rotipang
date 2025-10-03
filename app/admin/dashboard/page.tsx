import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

export const revalidate = 0;

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', today.toISOString());

  const { data: allOrders } = await supabase
    .from('orders')
    .select('total_amount, created_at, payment_status')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: products } = await supabase
    .from('products')
    .select('id')
    .eq('available', true);

  const todayRevenue = orders?.reduce((sum: number, order: any) => {
    if (order.payment_status === 'paid') {
      return sum + order.total_amount;
    }
    return sum;
  }, 0) || 0;

  const todayOrders = orders?.length || 0;

  return {
    todayRevenue,
    todayOrders,
    availableProducts: products?.length || 0,
    recentOrders: allOrders?.slice(0, 10) || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Penjualan Hari Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.todayRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pesanan Hari Ini
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produk Tersedia
            </CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableProducts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada pesanan</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div
                  key={order.created_at}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
