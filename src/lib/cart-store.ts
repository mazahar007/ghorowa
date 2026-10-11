"use client";

import { useSyncExternalStore } from "react";

export type CartLine = {
  slug: string;
  size: string;
  color?: string;
  qty: number;
  /** কার্টে দেখানোর জন্য পণ্যের তথ্যের কপি; অর্ডারের সময় সার্ভার আসল দাম ধরে। */
  name: string;
  price: number;
  image?: string;
};

export type LineKey = Pick<CartLine, "slug" | "size" | "color">;

const STORAGE_KEY = "ghorowa-cart-v2";
const MAX_QTY = 20;
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
let drawerOpen = false;
const listeners = new Set<() => void>();
const drawerListeners = new Set<() => void>();

function isLine(l: unknown): l is CartLine {
  const x = l as CartLine;
  return (
    typeof x?.slug === "string" &&
    typeof x.size === "string" &&
    typeof x.qty === "number" &&
    typeof x.name === "string" &&
    typeof x.price === "number"
  );
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    lines = Array.isArray(parsed) ? parsed.filter(isLine) : EMPTY;
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage may be unavailable (private mode) — the cart still works for this visit
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const sameLine = (a: LineKey, b: LineKey) =>
  a.slug === b.slug && a.size === b.size && (a.color ?? "") === (b.color ?? "");

export const cart = {
  add(item: Omit<CartLine, "qty">, qty = 1) {
    load();
    const existing = lines.find((l) => sameLine(l, item));
    if (existing) {
      commit(lines.map((l) => (l === existing ? { ...l, ...item, qty: Math.min(MAX_QTY, l.qty + qty) } : l)));
    } else {
      commit([...lines, { ...item, qty: Math.min(MAX_QTY, qty) }]);
    }
  },
  setQty(key: LineKey, qty: number) {
    load();
    if (qty <= 0) return cart.remove(key);
    commit(lines.map((l) => (sameLine(l, key) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  },
  remove(key: LineKey) {
    load();
    commit(lines.filter((l) => !sameLine(l, key)));
  },
  clear() {
    commit([]);
  },
};

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return lines;
    },
    () => EMPTY,
  );
  const count = items.reduce((n, l) => n + l.qty, 0);
  const subtotal = items.reduce((n, l) => n + l.price * l.qty, 0);
  return { items, count, subtotal };
}

export const cartDrawer = {
  open() {
    drawerOpen = true;
    drawerListeners.forEach((l) => l());
  },
  close() {
    drawerOpen = false;
    drawerListeners.forEach((l) => l());
  },
};

export function useCartDrawerOpen() {
  return useSyncExternalStore(
    (l) => {
      drawerListeners.add(l);
      return () => drawerListeners.delete(l);
    },
    () => drawerOpen,
    () => false,
  );
}
