import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/customer/navbar';
import { Footer } from '@/components/customer/footer';
import { ProductCard } from '@/components/customer/product-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const revalidate = 60;

async function getProducts() {
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export default async function ProductsPage() {
  const products = await getProducts();
  const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category))) as string[];
  const categories: string[] = ['Semua', ...uniqueCategories];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-8 text-center">Katalog Produk</h1>

        <Tabs defaultValue="Semua" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products
                  .filter((product: any) => category === 'Semua' || product.category === category)
                  .map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>

              {products.filter((product: any) => category === 'Semua' || product.category === category)
                .length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  Belum ada produk di kategori ini
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
