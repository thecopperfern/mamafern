"use client";

import { atom, useAtom } from "jotai";

const STORAGE_KEY = "mamafern_wishlist";

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(handles: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
}

const wishlistAtom = atom<string[]>([]);
const initializedAtom = atom(false);

export function useWishlist() {
  const [items, setItems] = useAtom(wishlistAtom);
  const [initialized, setInitialized] = useAtom(initializedAtom);

  const initialize = () => {
    if (!initialized) {
      const loaded = loadWishlist();
      setItems(loaded);
      setInitialized(true);
    }
  };

  const addItem = (handle: string) => {
    const updated = [...items, handle];
    setItems(updated);
    saveWishlist(updated);
  };

  const removeItem = (handle: string) => {
    const updated = items.filter((h) => h !== handle);
    setItems(updated);
    saveWishlist(updated);
  };

  const toggleItem = (handle: string) => {
    if (items.includes(handle)) {
      removeItem(handle);
      return false;
    } else {
      addItem(handle);
      return true;
    }
  };

  const isWishlisted = (handle: string) => items.includes(handle);

  return {
    items,
    initialize,
    addItem,
    removeItem,
    toggleItem,
    isWishlisted,
    count: items.length,
  };
}
