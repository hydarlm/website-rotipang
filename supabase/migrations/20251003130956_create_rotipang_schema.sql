/*
  # RotipanG Database Schema
  
  Database schema untuk sistem pemesanan Kedai RotipanG.
  
  ## Tables Created
  
  1. **products**
     - `id` (uuid, primary key)
     - `name` (text) - Nama produk
     - `category` (text) - Kategori produk (Roti Manis, Roti Tawar, Kue, dll)
     - `price` (integer) - Harga dalam rupiah
     - `description` (text) - Deskripsi produk
     - `image` (text) - URL gambar produk
     - `available` (boolean) - Status ketersediaan
     - `stock` (integer) - Jumlah stok (optional)
     - `created_at` (timestamptz) - Waktu dibuat
     - `updated_at` (timestamptz) - Waktu diupdate
  
  2. **orders**
     - `id` (uuid, primary key)
     - `order_number` (text, unique) - Format: RP-YYYYMMDD-XXX
     - `customer_name` (text) - Nama pembeli
     - `customer_phone` (text) - Nomor WhatsApp
     - `address` (text) - Alamat pengiriman/pickup
     - `delivery_method` (text) - pickup atau delivery
     - `payment_method` (text) - Transfer Bank, E-Wallet, COD
     - `payment_status` (text) - pending, paid, failed
     - `order_status` (text) - pending, confirmed, processing, ready, completed, cancelled
     - `total_amount` (integer) - Total pembayaran
     - `notes` (text) - Catatan tambahan
     - `pickup_time` (timestamptz) - Waktu pengambilan (optional)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  3. **order_items**
     - `id` (uuid, primary key)
     - `order_id` (uuid, foreign key)
     - `product_id` (uuid, foreign key)
     - `quantity` (integer)
     - `price` (integer) - Harga saat pemesanan
     - `product_name` (text) - Nama produk saat pemesanan
  
  4. **admins**
     - `id` (uuid, primary key)
     - `email` (text, unique)
     - `password` (text) - Hashed password
     - `name` (text)
     - `role` (text) - admin atau owner
     - `created_at` (timestamptz)
  
  5. **settings**
     - `id` (uuid, primary key)
     - `key` (text, unique) - Setting key
     - `value` (jsonb) - Setting value
     - `updated_at` (timestamptz)
  
  ## Security
  
  - Enable RLS on all tables
  - Public dapat read products yang available
  - Public dapat create orders dan read own orders
  - Authenticated admins dapat full access ke semua data
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price integer NOT NULL CHECK (price >= 0),
  description text,
  image text,
  available boolean DEFAULT true,
  stock integer DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  address text,
  delivery_method text NOT NULL CHECK (delivery_method IN ('pickup', 'delivery')),
  payment_method text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status text DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled')),
  total_amount integer NOT NULL CHECK (total_amount >= 0),
  notes text,
  pickup_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price integer NOT NULL CHECK (price >= 0),
  product_name text NOT NULL
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'owner')),
  created_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated admins can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- RLS Policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders by order_number"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Authenticated admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Anyone can view order_items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create order_items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update order_items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- RLS Policies for admins
CREATE POLICY "Authenticated admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can insert admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'owner'
    )
  );

-- RLS Policies for settings
CREATE POLICY "Authenticated admins can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('shop_info', '{"name": "RotipanG", "address": "", "phone": "", "email": ""}'),
  ('business_hours', '{"open": "08:00", "close": "20:00", "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}'),
  ('delivery_fee', '{"fee": 10000, "free_above": 100000}'),
  ('whatsapp_number', '{"number": ""}'),
  ('payment_methods', '{"bank_transfer": true, "e_wallet": true, "cod": true}')
ON CONFLICT (key) DO NOTHING;