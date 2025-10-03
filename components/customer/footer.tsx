import { Store, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-amber-50 mt-16">
      <div className="container py-8 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-5 w-5 text-amber-600" />
              <span className="text-lg font-bold text-amber-900">RotipanG</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Roti segar dan berkualitas untuk keluarga Indonesia
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@rotipang.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Jam Operasional</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Senin - Minggu</p>
              <p className="font-semibold text-amber-700">08:00 - 20:00 WIB</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RotipanG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
