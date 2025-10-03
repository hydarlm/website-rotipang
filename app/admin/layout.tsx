import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Sidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
