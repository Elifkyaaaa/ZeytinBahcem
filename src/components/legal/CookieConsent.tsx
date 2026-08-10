'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { cookieConsentText } from '@/lib/data/text/shop';

const STORAGE_KEY = 'zb-cookie-consent';

type Choice = 'all' | 'necessary';

/**
 * Tercih localStorage'da tutulur. React'e dışarıdan bir kaynak olarak
 * bağlıyoruz ki efekt içinde setState çağırmak gerekmesin ve sunucu
 * render'ında bant hiç basılmasın.
 */
let listeners: (() => void)[] = [];

const consentStore = {
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  /** Karar verilmiş mi? */
  getSnapshot() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      // Gizli sekmede depo kapalı olabilir; bandı göstermiyoruz.
      return true;
    }
  },
  /** Sunucuda karar bilinemez; bant basılmaz, hydration uyuşmazlığı olmaz. */
  getServerSnapshot() {
    return true;
  },
  decide(choice: Choice) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() }),
      );
    } catch {
      // Kaydedilemese de kullanıcıyı engellemiyoruz.
    }
    listeners.forEach((l) => l());
  },
};

/**
 * KVKK ve Çerez Politikası kapsamında ilk ziyarette gösterilen onay bandı.
 *
 * Zorunlu çerezler (oturum, sepet) her hâlükârda çalışır; bant yalnızca
 * isteğe bağlı istatistik çerezleri için onay toplar.
 */
export function CookieConsent() {
  const decided = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.getSnapshot,
    consentStore.getServerSnapshot,
  );

  return (
    <AnimatePresence>
      {!decided && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label={cookieConsentText.regionLabel}
          className="fixed inset-x-3 bottom-3 z-[88] mx-auto max-w-3xl sm:inset-x-6 sm:bottom-6"
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/97 p-5 shadow-lift backdrop-blur-xl sm:flex-row sm:items-center sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-olive-600/8 text-olive-600 dark:bg-gold-400/10 dark:text-gold-400">
              <Cookie className="size-5" strokeWidth={1.8} />
            </span>

            <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
              {cookieConsentText.bodyBefore}{' '}
              <Link
                href="/cerez-politikasi"
                className="font-medium text-gold-700 underline underline-offset-2 dark:text-gold-400"
              >
                {cookieConsentText.policyLinkLabel}
              </Link>{' '}
              {cookieConsentText.bodyAfter}
            </p>

            <div className="flex shrink-0 gap-2.5">
              <button
                onClick={() => consentStore.decide('necessary')}
                className="h-10 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:border-gold-500/50"
              >
                {cookieConsentText.necessaryOnly}
              </button>
              <button
                onClick={() => consentStore.decide('all')}
                className="h-10 rounded-full bg-olive-700 px-5 text-sm font-semibold text-cream-50 transition-all hover:bg-olive-600 active:scale-95 dark:bg-gold-500 dark:text-olive-950"
              >
                Kabul et
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
