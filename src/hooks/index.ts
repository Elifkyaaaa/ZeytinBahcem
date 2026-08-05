'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Aboneliği olmayan store'lar için sabit — her render'da yeni fonksiyon üretmez. */
const noopSubscribe = () => () => {};

/**
 * localStorage'dan beslenen store'lar sunucuda boş döner.
 * Rozet/sayaç gibi değerleri bu bayrak true olana kadar göstermeyerek
 * hydration uyuşmazlığını önleriz.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Header'ın aşağı kaydırınca gizlenip yukarı kaydırınca dönmesi için. */
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > threshold);
        if (Math.abs(y - lastY.current) > 6) {
          setDirection(y > lastY.current && y > 120 ? 'down' : 'up');
          lastY.current = y;
        }
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return { direction, scrolled };
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Sunucuda medya sorgusu yoktur; en dar varsayımla başlarız.
    () => false,
  );
}

/** Drawer/overlay açıkken arka planın kaymasını engeller. */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

export function useEscape(handler: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
}

/**
 * Görünür alana girince hedef değere sayan sayaç.
 * Hareket tercihi kapalıysa doğrudan son değeri döner.
 */
export function useCountUp(target: number, duration = 1800, start = false) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!start || reduce || started.current) return;
    started.current = true;

    let frame = 0;
    const begin = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - begin) / duration, 1);
      // easeOutExpo: hızlı başlar, sonda yumuşakça durur
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration, reduce]);

  // Hareket tercihi kapalıysa animasyon hiç başlamaz, doğrudan son değer gösterilir.
  return reduce ? target : value;
}

/** Pano kopyalama — paylaş menüsünde geri bildirim için. */
export function useCopy(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch {
        return false;
      }
    },
    [resetAfter],
  );

  return { copied, copy };
}
