import Link from 'next/link';
import { ArrowRight, ShoppingBag, Clock, CircleCheck as CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/customer/navbar';
import { Footer } from '@/components/customer/footer';

export default function Home() {
  const categories = [
    { name: 'Roti Manis', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Roti Tawar', image: 'https://images.pexels.com/photos/1775037/pexels-photo-1775037.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Kue', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Pastry', image: 'https://images.pexels.com/photos/1775037/pexels-photo-1775037.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: 'Produk Berkualitas',
      description: 'Bahan pilihan dan resep terbaik',
    },
    {
      icon: Clock,
      title: 'Selalu Segar',
      description: 'Diproduksi setiap hari',
    },
    {
      icon: CheckCircle,
      title: 'Pesan Mudah',
      description: 'Checkout tanpa ribet',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-4">
            Roti Segar Setiap Hari
          </h1>
          <p className="text-lg md:text-xl text-amber-800 mb-8">
            Nikmati kelezatan roti berkualitas dari RotipanG untuk keluarga tercinta
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8">
              Pesan Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Kategori Produk</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href="/products">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-amber-900">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber-50 py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa RotipanG?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
