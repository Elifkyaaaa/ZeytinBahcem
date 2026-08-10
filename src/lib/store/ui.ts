'use client';

import { create } from 'zustand';

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'error';
}

interface UiState {
  searchOpen: boolean;
  menuOpen: boolean;
  /** Whether the guided admin tour is open */
  tourOpen: boolean;
  toasts: Toast[];
  openSearch: () => void;
  closeSearch: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  openTour: () => void;
  closeTour: () => void;
  toast: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

export const useUi = create<UiState>((set) => ({
  searchOpen: false,
  menuOpen: false,
  tourOpen: false,
  toasts: [],

  openSearch: () => set({ searchOpen: true, menuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  openMenu: () => set({ menuOpen: true, searchOpen: false }),
  closeMenu: () => set({ menuOpen: false }),
  openTour: () => set({ tourOpen: true }),
  closeTour: () => set({ tourOpen: false }),

  toast: (t) => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { ...t, id }] }));
    // Toasts dismiss themselves; the user can also close one early.
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((x) => x.id !== id) }));
    }, 3600);
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((x) => x.id !== id) })),
}));
