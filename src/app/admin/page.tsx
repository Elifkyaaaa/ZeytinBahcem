'use client';

import {
  ArrowRight,
  MessageSquare,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminShell';
import { AreaChart, BarChart, DonutChart, ProgressList } from '@/components/admin/Charts';
import { Panel, StatCard, Status, Td, Th, Tr } from '@/components/admin/primitives';
import {
  categoryShare,
  dashboardStats,
  monthlySales,
  orderStatusMeta,
  orders,
  trafficSources,
} from '@/lib/data/admin';
import { products } from '@/lib/data/products';
import { paymentMethodMeta } from '@/lib/data/payment';
import { blurDataURL, formatNumber, formatPrice, safeImageSrc } from '@/lib/utils';

const quickLinks = [
  { label: 'Bekleyen sipariş', value: dashboardStats.pendingOrders, href: '/admin/orders', Icon: ShoppingCart },
  { label: 'Kritik stok', value: dashboardStats.lowStock, href: '/admin/stock', Icon: Warehouse },
  { label: 'Onay bekleyen yorum', value: dashboardStats.pendingReviews, href: '/admin/reviews', Icon: MessageSquare },
];

export default function AdminDashboard() {
  const topProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="4 Ağustos 2026 · Son 12 ayın performans özeti"
      />

      <div data-tour="stats" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bugünkü Siparişler"
          value={formatNumber(dashboardStats.todayOrders)}
          delta={dashboardStats.todayOrdersDelta}
          hint="Dünle karşılaştırıldı"
          Icon={ShoppingCart}
          accent="olive"
        />
        <StatCard
          label="Toplam Satış"
          value={`${formatNumber(Math.round(dashboardStats.totalRevenue / 1000))}B ₺`}
          delta={dashboardStats.totalRevenueDelta}
          hint="Son 12 ay"
          Icon={TrendingUp}
          accent="gold"
        />
        <StatCard
          label="Toplam Müşteri"
          value={formatNumber(dashboardStats.totalCustomers)}
          delta={dashboardStats.totalCustomersDelta}
          hint="Kayıtlı üye sayısı"
          Icon={Users}
          accent="blue"
        />
        <StatCard
          label="Toplam Ürün"
          value={formatNumber(dashboardStats.totalProducts)}
          hint={`${dashboardStats.lowStock} üründe stok kritik`}
          Icon={Package}
          accent="rose"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {quickLinks.map(({ label, value, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-4 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lift"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-gold-500/12 text-gold-700 dark:text-gold-400">
              <Icon className="size-4.5" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-muted-foreground">{label}</span>
              <span className="block text-lg font-semibold text-foreground tabular-nums">
                {value}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
        ))}
      </div>

      <div data-tour="charts" className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel title="Ciro Grafiği" description="Son 12 ayın aylık cirosu (₺)">
          <AreaChart data={monthlySales} valueKey="revenue" />
        </Panel>

        <Panel title="Kategori Payları" description="Ciroya göre dağılım">
          <DonutChart data={categoryShare} centerLabel="kategori" centerValue="5" />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel title="Sipariş Adedi" description="Aylık sipariş sayısı">
          <BarChart data={monthlySales} />
        </Panel>

        <Panel title="Trafik Kaynakları" description="Son 30 gün">
          <ProgressList data={trafficSources} />
        </Panel>
      </div>

      <div data-tour="orders" className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <Panel
          title="Son Siparişler"
          description="En güncel 6 sipariş"
          padded={false}
          actions={
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700 transition-colors hover:text-gold-600 dark:text-gold-400"
            >
              Tümü
              <ArrowRight className="size-3.5" strokeWidth={2.2} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] text-sm">
              <thead>
                <tr>
                  <Th>Sipariş</Th>
                  <Th>Müşteri</Th>
                  <Th>Durum</Th>
                  <Th align="right">Tutar</Th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((order) => {
                  const meta = orderStatusMeta[order.status];
                  return (
                    <Tr key={order.id}>
                      <Td>
                        <span className="font-medium text-foreground tabular-nums">{order.id}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {order.items} ürün · {order.city}
                        </span>
                      </Td>
                      <Td>
                        <span className="flex items-center gap-2.5">
                          <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-surface-muted">
                            <Image
                              src={safeImageSrc(order.avatar)}
                              alt=""
                              fill
                              sizes="32px"
                              placeholder="blur"
                              blurDataURL={blurDataURL()}
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-foreground">
                              {order.customer}
                            </span>
                            <span className="block truncate text-xs text-muted-foreground">
                              {paymentMethodMeta[order.payment].shortName}
                            </span>
                          </span>
                        </span>
                      </Td>
                      <Td>
                        <Status tone={meta.tone}>{meta.label}</Status>
                      </Td>
                      <Td align="right">
                        <span className="font-semibold text-foreground tabular-nums">
                          {formatPrice(order.total)}
                        </span>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="En Çok Değerlendirilen Ürünler" padded={false}>
          <ul className="divide-y divide-border">
            {topProducts.map((product, i) => (
              <li key={product.id} className="flex items-center gap-3.5 px-5 py-3.5">
                <span className="w-4 shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  <Image
                    src={safeImageSrc(product.image)}
                    alt=""
                    fill
                    sizes="44px"
                    placeholder="blur"
                    blurDataURL={blurDataURL()}
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="line-clamp-1 text-sm font-medium text-foreground transition-colors hover:text-gold-600"
                  >
                    {product.name}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                    {product.rating.toFixed(1)} ★ · {formatNumber(product.reviewCount)} yorum
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                  {formatPrice(product.price)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
