import { createElement, useEffect, useState } from "react";

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

function classesForTone(tone) {
  if (tone === "dark") {
    return {
      group:
        "flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm font-medium text-zinc-100",
      input: "accent-white",
      systemChip:
        "rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-zinc-200",
      systemButton:
        "rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-zinc-200 transition hover:bg-white/10",
      repo:
        "rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10",
    };
  }

  return {
    group:
      "flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
    input: "accent-zinc-900 dark:accent-white",
    systemChip:
      "rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
    systemButton:
      "rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
    repo:
      "rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900",
  };
}

export function DemoControlBar({
  reducedMotion,
  reducedMotionUsesSystem,
  onReducedMotionChange,
  onReducedMotionSystem,
  perfMode,
  onPerfModeChange,
  repoUrl,
  tone = "light",
}) {
  const classes = classesForTone(tone);

  return createElement(
    "div",
    { className: "flex flex-wrap items-center gap-2" },
    createElement(
      "div",
      { className: classes.group },
      createElement(
        "label",
        { className: "flex cursor-pointer items-center gap-2" },
        createElement("input", {
          type: "checkbox",
          className: classes.input,
          checked: reducedMotion,
          onChange: (event) => onReducedMotionChange(event.target.checked),
        }),
        "Reduced motion",
      ),
      reducedMotionUsesSystem
        ? createElement("span", { className: classes.systemChip }, "System")
        : createElement(
            "button",
            {
              type: "button",
              onClick: onReducedMotionSystem,
              className: classes.systemButton,
              "aria-label": "Reset reduced motion to system preference",
              title: "Use system prefers-reduced-motion",
            },
            "System",
          ),
    ),
    createElement(
      "label",
      { className: classes.group },
      createElement("input", {
        type: "checkbox",
        className: classes.input,
        checked: perfMode,
        onChange: (event) => onPerfModeChange(event.target.checked),
      }),
      "Perf mode",
    ),
    repoUrl
      ? createElement(
          "a",
          {
            href: repoUrl,
            target: "_blank",
            rel: "noreferrer",
            className: classes.repo,
          },
          "GitHub",
        )
      : null,
  );
}
