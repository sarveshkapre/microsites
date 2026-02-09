import { useEffect, useState } from "react";

function readStoredBoolean(rawValue) {
  if (rawValue === "1" || rawValue === "true") return true;
  if (rawValue === "0" || rawValue === "false") return false;
  return null;
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
