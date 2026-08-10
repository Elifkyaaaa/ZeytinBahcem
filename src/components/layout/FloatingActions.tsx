'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/icons';
import { site } from '@/lib/data/site';
import { floatingActionsText } from '@/lib/data/text/layout';

export function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {visible && (
          <motion.button
            key="top"
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={floatingActionsText.backToTopLabel}
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-border bg-surface/90 text-foreground/75 shadow-soft backdrop-blur-md transition-all hover:-translate-y-0.5 hover:text-foreground hover:shadow-lift"
          >
            <ArrowUp className="size-[1.1rem]" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={floatingActionsText.whatsappLabel}
        className="pointer-events-auto relative grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 animate-[ring_2.6s_cubic-bezier(0.22,1,0.36,1)_infinite] rounded-full bg-[#25D366]/45" aria-hidden />
        <WhatsAppIcon className="relative size-6" />
      </a>
    </div>
  );
}
