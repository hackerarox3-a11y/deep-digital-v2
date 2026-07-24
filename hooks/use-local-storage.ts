"use client";

import { useEffect, useState } from "react";

/** Persists only browser-safe Studio preferences; server rendering remains deterministic. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch {
      // A corrupted draft should never block the Studio.
      window.localStorage.removeItem(key);
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);

  return [value, setValue, ready] as const;
}
