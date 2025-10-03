'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Settings,
  LogOut,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Produk', href: '/admin/products', icon: Package },
  { name: 'Pesanan', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Keuangan', href: '/admin/finance', icon: DollarSign },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast.success('Logout berhasil');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  return (
    <div className="flex flex-col h-full bg-amber-900 text-white">
      <div className="p-6 border-b border-amber-800">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="text-xl font-bold">RotipanG Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-amber-800 text-white'
                  : 'text-amber-100 hover:bg-amber-800/50'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-amber-800">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-amber-100 hover:bg-amber-800/50 hover:text-white"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
