'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useHydrated } from '@/hooks';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = resolvedTheme === 'dark';

  const toggle = () => {
    // A short transition class so colours do not jump when the theme changes
    const root = document.documentElement;
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 360);
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      className={cn(
        'relative grid size-10 place-items-center rounded-full text-foreground/75',
        'transition-colors duration-300 hover:bg-foreground/6 hover:text-foreground',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={hydrated && isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
        >
          {hydrated && isDark ? (
            <Moon className="size-[1.15rem]" strokeWidth={1.7} />
          ) : (
            <Sun className="size-[1.15rem]" strokeWidth={1.7} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
