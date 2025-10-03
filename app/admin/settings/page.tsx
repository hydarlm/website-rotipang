'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Clock, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Pengaturan</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Informasi Toko
            </CardTitle>
            <CardDescription>
              Informasi dasar tentang toko Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Alamat</p>
                <p className="text-sm text-muted-foreground">Jakarta, Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telepon</p>
                <p className="text-sm text-muted-foreground">+62 812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">info@rotipang.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Jam Operasional
            </CardTitle>
            <CardDescription>
              Waktu buka dan tutup toko
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Senin - Minggu</span>
                <span className="text-sm font-semibold">08:00 - 20:00 WIB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
            <CardDescription>
              Metode pembayaran yang tersedia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Transfer Bank</li>
              <li>✓ E-Wallet (GoPay, OVO, Dana)</li>
              <li>✓ Cash on Delivery</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
