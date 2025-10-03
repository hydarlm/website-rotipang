# RotipanG - Website FnB Kedai Roti

Website full stack mobile-first untuk Kedai RotipanG dengan Next.js 14 dan Supabase.

## Fitur Utama

### Customer Portal (Tanpa Login)
- **Home**: Landing page dengan branding dan kategori produk
- **Katalog Produk**: Browse produk dengan filter kategori
- **Keranjang Belanja**: Kelola item pesanan dengan quantity
- **Checkout**: Form pemesanan tanpa perlu registrasi
- **Tracking Pesanan**: Lacak status pesanan dengan Order ID

### Admin Portal (Dengan Login)
- **Dashboard**: Overview penjualan dan statistik
- **Manajemen Produk**: CRUD produk dengan kategori dan stok
- **Manajemen Pesanan**: Update status pesanan dan pembayaran
- **Laporan Keuangan**: Statistik penjualan dan export CSV
- **Pengaturan**: Konfigurasi toko

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Icons**: Lucide React

## Database Schema

### Tables

1. **products**: Katalog produk
   - id, name, category, price, description, image, available, stock

2. **orders**: Data pesanan
   - id, order_number, customer_name, customer_phone, address
   - delivery_method, payment_method, payment_status, order_status
   - total_amount, notes, pickup_time

3. **order_items**: Detail item pesanan
   - id, order_id, product_id, quantity, price, product_name

4. **admins**: User admin
   - id, email, password (hashed), name, role

5. **settings**: Konfigurasi aplikasi
   - id, key, value (JSON)

## Akun Admin Default

- **Email**: admin@rotipang.com
- **Password**: admin123

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables di `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Database sudah di-setup dengan migrations. Produk sample dan admin sudah dibuat.

4. Jalankan development server:
```bash
npm run dev
```

5. Build untuk production:
```bash
npm run build
```

## Struktur Routing

### Customer
- `/` - Home page
- `/products` - Katalog produk
- `/cart` - Keranjang belanja
- `/checkout` - Checkout form
- `/order/[orderNumber]` - Detail pesanan

### Admin
- `/admin/login` - Login admin
- `/admin/dashboard` - Dashboard
- `/admin/products` - Manajemen produk
- `/admin/orders` - Manajemen pesanan
- `/admin/finance` - Laporan keuangan
- `/admin/settings` - Pengaturan

## Fitur Keamanan

- Row Level Security (RLS) pada semua tabel
- Password hashing untuk admin
- Session management dengan cookies
- Input validation pada forms

## Sample Data

Database sudah include:
- 1 Admin account (admin@rotipang.com / admin123)
- 6 Produk sample dari berbagai kategori
- Default settings untuk toko

## Pengembangan Selanjutnya

Fitur tambahan yang bisa dikembangkan:
- [ ] WhatsApp notification integration
- [ ] Payment gateway (Midtrans/Xendit)
- [ ] Rating & review produk
- [ ] Loyalty points system
- [ ] Promo & discount codes
- [ ] Push notifications (PWA)
- [ ] Google Analytics
- [ ] Multi-language support

## License

Private project untuk Kedai RotipanG

## Support

Untuk pertanyaan dan dukungan, hubungi developer.
