import type { PaymentMethod } from '@/lib/data/payment';
import { AVATAR } from '@/lib/images';

export type OrderStatus = 'bekliyor' | 'hazirlaniyor' | 'kargoda' | 'teslim' | 'iptal';

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  avatar: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: PaymentMethod;
  city: string;
}

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; tone: 'gold' | 'olive' | 'neutral' | 'success' | 'warning' }
> = {
  bekliyor: { label: 'Ödeme Bekliyor', tone: 'warning' },
  hazirlaniyor: { label: 'Hazırlanıyor', tone: 'gold' },
  kargoda: { label: 'Kargoda', tone: 'olive' },
  teslim: { label: 'Teslim Edildi', tone: 'success' },
  iptal: { label: 'İptal', tone: 'neutral' },
};

export const orders: AdminOrder[] = [
  { id: 'ZB-10428', customer: 'Elif Yıldırım', email: 'elif.y@example.com', avatar: AVATAR.a1, date: '2026-08-04', items: 3, total: 1847.5, status: 'hazirlaniyor', payment: 'card', city: 'İzmir' },
  { id: 'ZB-10427', customer: 'Mert Aksoy', email: 'mert.aksoy@example.com', avatar: AVATAR.a3, date: '2026-08-04', items: 1, total: 649, status: 'bekliyor', payment: 'transfer', city: 'Ankara' },
  { id: 'ZB-10426', customer: 'Ayşe Demirtaş', email: 'ayse.d@example.com', avatar: AVATAR.a2, date: '2026-08-04', items: 5, total: 2394, status: 'kargoda', payment: 'card', city: 'İstanbul' },
  { id: 'ZB-10425', customer: 'Burak Şen', email: 'burak.sen@example.com', avatar: AVATAR.a4, date: '2026-08-03', items: 2, total: 1128, status: 'teslim', payment: 'card', city: 'Bursa' },
  { id: 'ZB-10424', customer: 'Zeynep Karaca', email: 'zeynep.k@example.com', avatar: AVATAR.a6, date: '2026-08-03', items: 1, total: 599, status: 'teslim', payment: 'cod', city: 'Antalya' },
  { id: 'ZB-10423', customer: 'Onur Bilgin', email: 'onur.b@example.com', avatar: AVATAR.a5, date: '2026-08-02', items: 4, total: 1976.4, status: 'kargoda', payment: 'card', city: 'Eskişehir' },
  { id: 'ZB-10422', customer: 'Kaan Erdem', email: 'kaan.e@example.com', avatar: AVATAR.a7, date: '2026-08-02', items: 8, total: 4210, status: 'teslim', payment: 'transfer', city: 'İzmir' },
  { id: 'ZB-10421', customer: 'Selin Aydın', email: 'selin.a@example.com', avatar: AVATAR.a2, date: '2026-08-01', items: 2, total: 878, status: 'iptal', payment: 'card', city: 'Muğla' },
  { id: 'ZB-10420', customer: 'Deniz Uçar', email: 'deniz.u@example.com', avatar: AVATAR.a1, date: '2026-08-01', items: 3, total: 1533, status: 'teslim', payment: 'card', city: 'Kocaeli' },
  { id: 'ZB-10419', customer: 'Hakan Türkmen', email: 'hakan.t@example.com', avatar: AVATAR.a4, date: '2026-07-31', items: 6, total: 3120, status: 'teslim', payment: 'transfer', city: 'Balıkesir' },
];

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  segment: 'Yeni' | 'Sadık' | 'VIP' | 'Pasif';
}

export const customers: AdminCustomer[] = [
  { id: 'M-2041', name: 'Kaan Erdem', email: 'kaan.e@example.com', phone: '0532 555 11 04', avatar: AVATAR.a7, city: 'İzmir', orders: 24, spent: 48720, joined: '2023-03-14', segment: 'VIP' },
  { id: 'M-2038', name: 'Elif Yıldırım', email: 'elif.y@example.com', phone: '0533 555 22 18', avatar: AVATAR.a1, city: 'İzmir', orders: 17, spent: 26340, joined: '2023-08-02', segment: 'VIP' },
  { id: 'M-2035', name: 'Hakan Türkmen', email: 'hakan.t@example.com', phone: '0542 555 33 27', avatar: AVATAR.a4, city: 'Balıkesir', orders: 12, spent: 19880, joined: '2024-01-19', segment: 'Sadık' },
  { id: 'M-2029', name: 'Ayşe Demirtaş', email: 'ayse.d@example.com', phone: '0505 555 44 62', avatar: AVATAR.a2, city: 'İstanbul', orders: 9, spent: 14210, joined: '2024-05-06', segment: 'Sadık' },
  { id: 'M-2024', name: 'Onur Bilgin', email: 'onur.b@example.com', phone: '0546 555 55 91', avatar: AVATAR.a5, city: 'Eskişehir', orders: 7, spent: 9640, joined: '2024-09-22', segment: 'Sadık' },
  { id: 'M-2018', name: 'Zeynep Karaca', email: 'zeynep.k@example.com', phone: '0555 555 66 30', avatar: AVATAR.a6, city: 'Antalya', orders: 4, spent: 5180, joined: '2025-02-11', segment: 'Yeni' },
  { id: 'M-2011', name: 'Mert Aksoy', email: 'mert.aksoy@example.com', phone: '0537 555 77 45', avatar: AVATAR.a3, city: 'Ankara', orders: 3, spent: 3290, joined: '2025-06-28', segment: 'Yeni' },
  { id: 'M-1998', name: 'Selin Aydın', email: 'selin.a@example.com', phone: '0538 555 88 12', avatar: AVATAR.a2, city: 'Muğla', orders: 1, spent: 878, joined: '2024-11-03', segment: 'Pasif' },
];

/** Last twelve months of revenue and order counts, used by the charts. */
export const monthlySales = [
  { month: 'Eyl', revenue: 184000, orders: 268 },
  { month: 'Eki', revenue: 246000, orders: 341 },
  { month: 'Kas', revenue: 412000, orders: 578 },
  { month: 'Ara', revenue: 508000, orders: 712 },
  { month: 'Oca', revenue: 336000, orders: 465 },
  { month: 'Şub', revenue: 298000, orders: 402 },
  { month: 'Mar', revenue: 351000, orders: 489 },
  { month: 'Nis', revenue: 389000, orders: 531 },
  { month: 'May', revenue: 424000, orders: 596 },
  { month: 'Haz', revenue: 468000, orders: 641 },
  { month: 'Tem', revenue: 512000, orders: 703 },
  { month: 'Ağu', revenue: 289000, orders: 398 },
];

export const categoryShare = [
  { label: 'Natürel Sızma', value: 38, color: 'var(--color-olive-500)' },
  { label: 'Erken Hasat', value: 24, color: 'var(--color-gold-500)' },
  { label: 'Sofralık Zeytin', value: 19, color: 'var(--color-olive-300)' },
  { label: 'Taş Baskı', value: 12, color: 'var(--color-gold-300)' },
  { label: 'Organik', value: 7, color: 'var(--color-olive-700)' },
];

export const trafficSources = [
  { label: 'Organik Arama', value: 42 },
  { label: 'Doğrudan', value: 24 },
  { label: 'Instagram', value: 18 },
  { label: 'E-Bülten', value: 10 },
  { label: 'Referans', value: 6 },
];

export interface Campaign {
  id: string;
  name: string;
  type: 'Yüzde İndirim' | 'Sabit İndirim' | 'Kargo' | 'Hediye';
  discount: string;
  start: string;
  end: string;
  usage: number;
  limit: number;
  active: boolean;
}

export const campaigns: Campaign[] = [
  { id: 'K-108', name: 'Erken Hasat Lansmanı', type: 'Yüzde İndirim', discount: '%15', start: '2026-10-01', end: '2026-10-31', usage: 0, limit: 500, active: false },
  { id: 'K-107', name: 'Yaz Sonu Fırsatı', type: 'Yüzde İndirim', discount: '%25', start: '2026-08-01', end: '2026-08-31', usage: 218, limit: 1000, active: true },
  { id: 'K-106', name: 'Ücretsiz Kargo Haftası', type: 'Kargo', discount: 'Kargo bedava', start: '2026-07-20', end: '2026-07-27', usage: 642, limit: 1000, active: false },
  { id: 'K-105', name: 'İlk Sipariş Hediyesi', type: 'Sabit İndirim', discount: '150 ₺', start: '2026-01-01', end: '2026-12-31', usage: 1284, limit: 5000, active: true },
  { id: 'K-104', name: 'Hediye Seti Kampanyası', type: 'Hediye', discount: '+1 sabun', start: '2026-05-01', end: '2026-06-30', usage: 397, limit: 400, active: false },
];

export interface AdminReview {
  id: string;
  product: string;
  customer: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  status: 'onaylandi' | 'bekliyor' | 'reddedildi';
}

export const adminReviews: AdminReview[] = [
  { id: 'Y-881', product: 'Erken Hasat Natürel Sızma', customer: 'Deniz Uçar', avatar: AVATAR.a1, rating: 5, comment: 'Boğazdaki yakıcılık tam istediğim gibi. Kesinlikle tekrar alacağım.', date: '2026-08-04', status: 'bekliyor' },
  { id: 'Y-880', product: 'Sofralık Karışık Zeytin', customer: 'Mert Aksoy', avatar: AVATAR.a3, rating: 5, comment: 'Kahvaltı sofrasında çok beğenildi, tuz dengesi harika.', date: '2026-08-03', status: 'bekliyor' },
  { id: 'Y-879', product: 'Ayvalık Natürel Sızma', customer: 'Elif Yıldırım', avatar: AVATAR.a1, rating: 5, comment: 'Üçüncü siparişim, kalite hiç değişmedi.', date: '2026-08-02', status: 'onaylandi' },
  { id: 'Y-878', product: 'Taş Baskı Zeytinyağı', customer: 'Burak Şen', avatar: AVATAR.a4, rating: 4, comment: 'Aroması yoğun ama fiyatı biraz yüksek geldi.', date: '2026-08-01', status: 'onaylandi' },
  { id: 'Y-877', product: 'Gemlik Hurma Siyah Zeytin', customer: 'Anonim', avatar: AVATAR.a7, rating: 1, comment: 'Spam içerikli yorum — bağlantı paylaşımı.', date: '2026-07-31', status: 'reddedildi' },
  { id: 'Y-876', product: 'Organik Hediye Seti', customer: 'Zeynep Karaca', avatar: AVATAR.a6, rating: 5, comment: 'Ambalajı çok şık, hediye için mükemmel.', date: '2026-07-30', status: 'onaylandi' },
];

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
  active: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Yönetici' | 'Editör' | 'Sipariş Sorumlusu' | 'Depo';
  lastActive: string;
  status: 'aktif' | 'pasif';
}

export const adminUsers: AdminUser[] = [
  { id: 'U-01', name: 'Nesrin Elmora', email: 'nesrin@elmora.com', avatar: AVATAR.a1, role: 'Yönetici', lastActive: '2 dakika önce', status: 'aktif' },
  { id: 'U-02', name: 'Kerem Elmora', email: 'kerem@elmora.com', avatar: AVATAR.a7, role: 'Yönetici', lastActive: '1 saat önce', status: 'aktif' },
  { id: 'U-03', name: 'Tolga Bayram', email: 'tolga@elmora.com', avatar: AVATAR.a5, role: 'Editör', lastActive: 'Dün', status: 'aktif' },
  { id: 'U-04', name: 'Sibel Korkmaz', email: 'sibel@elmora.com', avatar: AVATAR.a2, role: 'Sipariş Sorumlusu', lastActive: '3 saat önce', status: 'aktif' },
  { id: 'U-05', name: 'Emre Duran', email: 'emre@elmora.com', avatar: AVATAR.a3, role: 'Depo', lastActive: '5 gün önce', status: 'pasif' },
];

export const permissionMatrix = [
  { module: 'Ürün Yönetimi', roles: { Yönetici: 'tam', Editör: 'duzenle', 'Sipariş Sorumlusu': 'goruntule', Depo: 'duzenle' } },
  { module: 'Sipariş Yönetimi', roles: { Yönetici: 'tam', Editör: 'goruntule', 'Sipariş Sorumlusu': 'tam', Depo: 'duzenle' } },
  { module: 'Müşteri Yönetimi', roles: { Yönetici: 'tam', Editör: 'yok', 'Sipariş Sorumlusu': 'goruntule', Depo: 'yok' } },
  { module: 'Kampanya & Kupon', roles: { Yönetici: 'tam', Editör: 'duzenle', 'Sipariş Sorumlusu': 'goruntule', Depo: 'yok' } },
  { module: 'Blog & İçerik', roles: { Yönetici: 'tam', Editör: 'tam', 'Sipariş Sorumlusu': 'yok', Depo: 'yok' } },
  { module: 'Stok Takibi', roles: { Yönetici: 'tam', Editör: 'goruntule', 'Sipariş Sorumlusu': 'goruntule', Depo: 'tam' } },
  { module: 'Site Ayarları', roles: { Yönetici: 'tam', Editör: 'yok', 'Sipariş Sorumlusu': 'yok', Depo: 'yok' } },
  { module: 'Ödeme Ayarları', roles: { Yönetici: 'tam', Editör: 'yok', 'Sipariş Sorumlusu': 'yok', Depo: 'yok' } },
] as const;

export const permissionLabels: Record<string, { label: string; tone: string }> = {
  tam: { label: 'Tam yetki', tone: 'text-olive-700 dark:text-olive-300' },
  duzenle: { label: 'Düzenleme', tone: 'text-gold-700 dark:text-gold-400' },
  goruntule: { label: 'Görüntüleme', tone: 'text-muted-foreground' },
  yok: { label: '—', tone: 'text-muted-foreground/45' },
};

/** Top stat cards on the dashboard */
export const dashboardStats = {
  todayOrders: 27,
  todayOrdersDelta: 12.4,
  totalRevenue: 4417000,
  totalRevenueDelta: 8.9,
  totalCustomers: 12548,
  totalCustomersDelta: 5.2,
  totalProducts: 14,
  totalProductsDelta: 0,
  lowStock: 3,
  pendingReviews: 2,
  pendingOrders: 1,
};
