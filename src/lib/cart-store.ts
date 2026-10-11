"use client";

import { useSyncExternalStore } from "react";
import { getProduct } from "@/data/catalog";

export type CartLine = {
  slug: string;
  size: string;
  color?: string;
  qty: number;
};

const STORAGE_KEY = "ghorowa-cart-v1";
const MAX_QTY = 20;
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      lines = parsed.filter(
        (l): l is CartLine =>
          typeof l?.slug === "string" &&
          typeof l?.size === "string" &&
          typeof l?.qty === "number" &&
          Boolean(getProduct(l.slug)),
      );
    }
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

function getSnapshot() {
  load();
  return lines;
}

function getServerSnapshot() {
  return EMPTY;
}

const sameLine = (a: CartLine, b: Omit<CartLine, "qty">) =>
  a.slug === b.slug && a.size === b.size && (a.color ?? "") === (b.color ?? "");

export const cart = {
  add(item: Omit<CartLine, "qty">, qty = 1) {
    load();
    const existing = lines.find((l) => sameLine(l, item));
    if (existing) {
      commit(lines.map((l) => (l === existing ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l)));
    } else {
      commit([...lines, { ...item, qty: Math.min(MAX_QTY, qty) }]);
    }
  },
  setQty(item: Omit<CartLine, "qty">, qty: number) {
    load();
    if (qty <= 0) return cart.remove(item);
    commit(lines.map((l) => (sameLine(l, item) ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)));
  },
  remove(item: Omit<CartLine, "qty">) {
    load();
    commit(lines.filter((l) => !sameLine(l, item)));
  },
  clear() {
    commit([]);
  },
};

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** কার্টের প্রতিটি লাইনের সাথে পণ্যের তথ্য ও মোট দাম। */
export function useCartDetails() {
  const items = useCart();
  const detailed = items.flatMap((line) => {
    const product = getProduct(line.slug);
    return product ? [{ ...line, product, lineTotal: product.price * line.qty }] : [];
  });
  const count = detailed.reduce((n, l) => n + l.qty, 0);
  const subtotal = detailed.reduce((n, l) => n + l.lineTotal, 0);
  return { items: detailed, count, subtotal };
}
