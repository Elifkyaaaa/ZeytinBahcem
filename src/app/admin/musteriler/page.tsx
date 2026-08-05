import { AdminPageHeader } from '@/components/admin/AdminShell';
import { DemoNotice } from '@/components/admin/primitives';
import { CustomerTable, type PanelCustomer } from '@/components/admin/CustomerTable';
import { customers as demoCustomers } from '@/lib/data/admin';
import { isSupabaseConfigured } from '@/utils/env';
import { createClient } from '@/utils/supabase/server';

export const metadata = { title: 'Müşteri Yönetimi' };
export const dynamic = 'force-dynamic';

/** Sipariş sayısı ve harcamaya göre segment. */
function segmentOf(orders: number, spent: number): PanelCustomer['segment'] {
  if (spent >= 20000 || orders >= 15) return 'VIP';
  if (orders >= 5) return 'Sadık';
  if (orders === 0) return 'Pasif';
  return 'Yeni';
}

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  let customers: PanelCustomer[] = [];
  let live = false;

  if (supabase) {
    // RLS: admin/staff tüm profilleri görebilir.
    const { data: users } = await supabase
      .from('users')
      .select('id, email, full_name, phone, avatar_url, created_at, role')
      .order('created_at', { ascending: false });

    if (users) {
      live = true;

      // Sipariş toplamlarını tek sorguda çekip bellekte grupluyoruz —
      // müşteri başına ayrı sorgu atmak N+1 olurdu.
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, total, status, shipping_address');

      const stats = new Map<string, { count: number; spent: number; city: string }>();
      for (const order of orders ?? []) {
        if (!order.user_id) continue;
        if (order.status === 'cancelled' || order.status === 'refunded') continue;
        const current = stats.get(order.user_id) ?? { count: 0, spent: 0, city: '' };
        current.count += 1;
        current.spent += Number(order.total);
        current.city ||= order.shipping_address?.city ?? '';
        stats.set(order.user_id, current);
      }

      customers = users.map((user) => {
        const stat = stats.get(user.id) ?? { count: 0, spent: 0, city: '' };
        return {
          id: user.id,
          name: user.full_name?.trim() || user.email.split('@')[0],
          email: user.email,
          phone: user.phone ?? '—',
          avatarUrl: user.avatar_url,
          city: stat.city || '—',
          orders: stat.count,
          spent: stat.spent,
          joined: user.created_at,
          segment: segmentOf(stat.count, stat.spent),
          role: user.role,
        };
      });
    }
  }

  if (!live) {
    customers = demoCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      avatarUrl: customer.avatar,
      city: customer.city,
      orders: customer.orders,
      spent: customer.spent,
      joined: customer.joined,
      segment: customer.segment,
      role: 'customer',
    }));
  }

  return (
    <>
      <AdminPageHeader
        title="Müşteri Yönetimi"
        description={
          live
            ? `${customers.length} kayıtlı üye — veritabanından okunuyor`
            : 'Örnek veri gösteriliyor'
        }
      />

      {!live && (
        <DemoNotice>
          {isSupabaseConfigured
            ? 'Müşteri listesi okunamadı. Hesabınızın rolü admin veya staff olmalı ve şema uygulanmış olmalı.'
            : 'Supabase bağlanmadığı için örnek veri gösteriliyor.'}
        </DemoNotice>
      )}

      <CustomerTable customers={customers} live={live} />
    </>
  );
}
