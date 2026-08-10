import { Resend } from 'resend';
import { env, isMailConfigured } from '@/utils/env';
import { site } from '@/lib/data/site';

const resend = isMailConfigured ? new Resend(env.resend.apiKey) : null;

export interface OrderMailPayload {
  orderNo: string;
  customerName: string;
  email: string;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  address: string;
  items: { name: string; variant: string; quantity: number; lineTotal: number }[];
}

const money = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

/** Shared table layout that renders safely across email clients. */
function shell(title: string, preheader: string, body: string) {
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#f9f5ec;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#232b18;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ec;padding:32px 16px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2d4;">
    <tr><td style="background:#232b18;padding:28px 32px;">
      <p style="margin:0;font-size:20px;font-weight:600;color:#fdfbf7;letter-spacing:-0.02em;">${site.name}</p>
      <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#d4b04a;">Est. ${site.founded}</p>
    </td></tr>
    <tr><td style="padding:32px;">${body}</td></tr>
    <tr><td style="background:#f9f5ec;padding:24px 32px;border-top:1px solid #e8e2d4;">
      <p style="margin:0;font-size:12px;line-height:1.7;color:#6a7360;">
        ${site.address.street}, ${site.address.district} / ${site.address.city}<br>
        <a href="tel:${site.phone.replace(/\s/g, '')}" style="color:#a9861b;text-decoration:none;">${site.phone}</a> ·
        <a href="mailto:${site.email}" style="color:#a9861b;text-decoration:none;">${site.email}</a>
      </p>
      <p style="margin:12px 0 0;font-size:11px;color:#9aa08c;">© ${new Date().getFullYear()} ${site.legalName}</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

function itemRows(items: OrderMailPayload['items']) {
  return items
    .map(
      (item) => `<tr>
  <td style="padding:12px 0;border-bottom:1px solid #f2ebdc;font-size:14px;">
    <strong style="font-weight:600;">${item.name}</strong><br>
    <span style="font-size:12px;color:#6a7360;">${item.variant} · ${item.quantity} adet</span>
  </td>
  <td style="padding:12px 0;border-bottom:1px solid #f2ebdc;text-align:right;font-size:14px;font-weight:600;white-space:nowrap;">
    ${money(item.lineTotal)}
  </td>
</tr>`,
    )
    .join('');
}

/* -------------------------------------------------------------------------- */
/*  Order confirmation for the customer                                        */
/* -------------------------------------------------------------------------- */

export async function sendOrderConfirmation(payload: OrderMailPayload) {
  if (!resend) return { sent: false as const, reason: 'mail-not-configured' as const };

  const body = `
<p style="margin:0 0 8px;font-size:22px;font-weight:600;letter-spacing:-0.02em;">Siparişiniz alındı</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#6a7360;">
  Merhaba ${payload.customerName}, siparişiniz için teşekkür ederiz. Ürünleriniz hazırlanmaya
  başlandı; kargoya verildiğinde ayrıca bilgilendireceğiz.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ec;border-radius:12px;padding:16px;margin-bottom:24px;">
  <tr><td style="font-size:13px;color:#6a7360;">Sipariş numarası</td>
      <td style="text-align:right;font-size:15px;font-weight:600;">${payload.orderNo}</td></tr>
  <tr><td style="padding-top:8px;font-size:13px;color:#6a7360;">Ödeme yöntemi</td>
      <td style="padding-top:8px;text-align:right;font-size:13px;">${payload.paymentMethod}</td></tr>
  <tr><td style="padding-top:8px;font-size:13px;color:#6a7360;">Teslimat</td>
      <td style="padding-top:8px;text-align:right;font-size:13px;">${payload.shippingMethod}</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  ${itemRows(payload.items)}
  <tr>
    <td style="padding:16px 0 0;font-size:16px;font-weight:600;">Genel toplam</td>
    <td style="padding:16px 0 0;text-align:right;font-size:18px;font-weight:700;color:#41512d;">${money(payload.total)}</td>
  </tr>
</table>

<p style="margin:24px 0 6px;font-size:13px;font-weight:600;">Teslimat adresi</p>
<p style="margin:0 0 28px;font-size:13px;line-height:1.7;color:#6a7360;">${payload.address}</p>

<a href="${env.siteUrl}/siparis-takibi?no=${encodeURIComponent(payload.orderNo)}"
   style="display:inline-block;background:#c9a227;color:#12150e;font-size:14px;font-weight:600;padding:13px 28px;border-radius:999px;text-decoration:none;">
  Siparişimi Takip Et
</a>`;

  const { error } = await resend.emails.send({
    from: env.resend.from,
    to: payload.email,
    subject: `Siparişiniz alındı — ${payload.orderNo}`,
    html: shell('Siparişiniz alındı', `${payload.orderNo} numaralı siparişiniz alındı.`, body),
  });

  return error ? { sent: false as const, reason: error.message } : { sent: true as const };
}

/* -------------------------------------------------------------------------- */
/*  New order notification for the admin                                       */
/* -------------------------------------------------------------------------- */

export async function sendAdminOrderNotice(payload: OrderMailPayload) {
  if (!resend || !env.resend.adminTo) {
    return { sent: false as const, reason: 'admin-mail-not-configured' as const };
  }

  const body = `
<p style="margin:0 0 8px;font-size:20px;font-weight:600;">Yeni sipariş: ${payload.orderNo}</p>
<p style="margin:0 0 20px;font-size:14px;color:#6a7360;">
  ${payload.customerName} · ${payload.email}<br>${payload.address}
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  ${itemRows(payload.items)}
  <tr>
    <td style="padding:16px 0 0;font-size:15px;font-weight:600;">Toplam</td>
    <td style="padding:16px 0 0;text-align:right;font-size:17px;font-weight:700;">${money(payload.total)}</td>
  </tr>
</table>
<p style="margin:24px 0 0;">
  <a href="${env.siteUrl}/admin/siparisler" style="color:#a9861b;font-size:14px;font-weight:600;">Yönetim panelinde aç →</a>
</p>`;

  const { error } = await resend.emails.send({
    from: env.resend.from,
    to: env.resend.adminTo,
    subject: `Yeni sipariş — ${payload.orderNo} · ${money(payload.total)}`,
    html: shell('Yeni sipariş', `${payload.orderNo} numaralı yeni sipariş.`, body),
  });

  return error ? { sent: false as const, reason: error.message } : { sent: true as const };
}

/* -------------------------------------------------------------------------- */
/*  Kargo bildirimi                                                            */
/* -------------------------------------------------------------------------- */

export async function sendShippingNotice(params: {
  orderNo: string;
  customerName: string;
  email: string;
  carrier: string;
  trackingNumber: string;
}) {
  if (!resend) return { sent: false as const, reason: 'mail-not-configured' as const };

  const body = `
<p style="margin:0 0 8px;font-size:22px;font-weight:600;letter-spacing:-0.02em;">Siparişiniz kargoda</p>
<p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#6a7360;">
  Merhaba ${params.customerName}, ${params.orderNo} numaralı siparişiniz kargoya verildi.
  Ortalama teslim süresi 1–3 iş günüdür.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5ec;border-radius:12px;padding:16px;">
  <tr><td style="font-size:13px;color:#6a7360;">Kargo firması</td>
      <td style="text-align:right;font-size:14px;font-weight:600;">${params.carrier}</td></tr>
  <tr><td style="padding-top:8px;font-size:13px;color:#6a7360;">Takip numarası</td>
      <td style="padding-top:8px;text-align:right;font-size:14px;font-weight:600;">${params.trackingNumber}</td></tr>
</table>
<p style="margin:28px 0 0;">
  <a href="${env.siteUrl}/siparis-takibi?no=${encodeURIComponent(params.orderNo)}"
     style="display:inline-block;background:#c9a227;color:#12150e;font-size:14px;font-weight:600;padding:13px 28px;border-radius:999px;text-decoration:none;">
    Kargomu Takip Et
  </a>
</p>`;

  const { error } = await resend.emails.send({
    from: env.resend.from,
    to: params.email,
    subject: `Siparişiniz kargoda — ${params.orderNo}`,
    html: shell('Siparişiniz kargoda', `${params.orderNo} kargoya verildi.`, body),
  });

  return error ? { sent: false as const, reason: error.message } : { sent: true as const };
}
