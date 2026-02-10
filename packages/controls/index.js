import { useEffect, useState } from "react";

function readStoredBoolean(rawValue) {
  if (rawValue === "1" || rawValue === "true") return true;
  if (rawValue === "0" || rawValue === "false") return false;
  return null;
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);

    onChange();

    // Some older engines only support addListener/removeListener.
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    // eslint-disable-next-line deprecation/deprecation
    mediaQuery.addListener(onChange);
    // eslint-disable-next-line deprecation/deprecation
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return prefersReducedMotion;
}

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const update = () => setIsVisible(document.visibilityState !== "hidden");
    update();

    document.addEventListener("visibilitychange", update, { passive: true });
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return isVisible;
}

function readStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // Ignore localStorage write failures (privacy mode, storage quota, etc).
  }
}

export function usePersistedBoolean(key, fallbackValue = false) {
  const [value, setValue] = useState(fallbackValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredBoolean(readStorage(key));
    setValue(stored ?? fallbackValue);
    setIsReady(true);
  }, [fallbackValue, key]);

  useEffect(() => {
    if (!isReady) return;
    writeStorage(key, value);
  }, [isReady, key, value]);

  return [value, setValue];
}

export function usePersistedNullableBoolean(key) {
  const [value, setValue] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setValue(readStoredBoolean(readStorage(key)));
    setIsReady(true);
  }, [key]);

  useEffect(() => {
    if (!isReady) return;
    writeStorage(key, value);
  }, [isReady, key, value]);

  return [value, setValue];
}
