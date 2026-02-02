import { MotionConfig, motion, useMotionValue, useSpring } from "framer-motion";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const repoUrl = "https://github.com/sarveshkapre/microsites" as const;

type DemoCard = {
  title: string;
  body: string;
  cta: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PlayfulMicroDemo() {
  const cards: DemoCard[] = useMemo(
    () => [
      {
        title: "Magnetic CTA",
        body: "A button that leans toward your pointer. Subtle, controllable, and disabled in reduced motion.",
        cta: "Try it",
      },
      {
        title: "Soft cursor spotlight",
        body: "A low-cost glow follows your cursor. It’s decorative, so it disappears for reduced motion.",
        cta: "Hover around",
      },
      {
        title: "Press feedback",
        body: "Tiny scale/press responses help the UI feel alive without adding visual noise.",
        cta: "Press me",
      },
    ],
    [],
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  const [reducedMotionOverride, setReducedMotionOverride] = useState<
    boolean | null
  >(null);
  const reducedMotion = reducedMotionOverride ?? prefersReducedMotion;

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { stiffness: 180, damping: 22 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 180, damping: 22 });

  useEffect(() => {
    if (reducedMotion) return;

    const onMove = (e: PointerEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [cursorX, cursorY, reducedMotion]);

  const magneticRef = useRef<HTMLButtonElement | null>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const onMagneticMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;
    const el = magneticRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setMagneticOffset({
      x: clamp(dx * 0.15, -18, 18),
      y: clamp(dy * 0.15, -12, 12),
    });
  };

  const onMagneticLeave = () => setMagneticOffset({ x: 0, y: 0 });

  const spotlightStyle = useMemo(() => {
    return {
      background:
        "radial-gradient(600px circle at var(--x) var(--y), rgba(99,102,241,0.18), transparent 55%)",
      ["--x" as never]: cursorXSpring,
      ["--y" as never]: cursorYSpring,
    } as unknown as CSSProperties;
  }, [cursorXSpring, cursorYSpring]);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-950 dark:from-black dark:to-zinc-950 dark:text-zinc-50">
        {!reducedMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0"
            style={spotlightStyle}
          />
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
          <header className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-black">
                  μ
                </div>
                <div className="leading-tight">
                  <div className="text-lg font-semibold tracking-tight">
                    playful-micro
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    micro-interactions
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                  <input
                    type="checkbox"
                    className="accent-zinc-900 dark:accent-white"
                    checked={reducedMotion}
                    onChange={(e) =>
                      setReducedMotionOverride(e.target.checked)
                    }
                  />
                  Reduced motion
                </label>

                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  Playful UI that stays tasteful.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  A small set of reusable interaction patterns: magnetic CTA,
                  hover/press feedback, and a soft cursor spotlight. Everything
                  is optional and respects{" "}
                  <span className="font-medium">prefers-reduced-motion</span>.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Pattern rules
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <li>Transforms/opacity only</li>
                  <li>Keep motion subtle by default</li>
                  <li>Always provide a reduced-motion path</li>
                </ul>
              </div>
            </div>
          </header>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <motion.div
                key={card.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                whileHover={reducedMotion ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Demo
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight">
                  {card.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {card.body}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <motion.button
                    ref={card.title === "Magnetic CTA" ? magneticRef : undefined}
                    onPointerMove={
                      card.title === "Magnetic CTA" ? onMagneticMove : undefined
                    }
                    onPointerLeave={
                      card.title === "Magnetic CTA" ? onMagneticLeave : undefined
                    }
                    className="relative inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-zinc-900/10 dark:bg-white dark:text-black dark:ring-white/20"
                    whileTap={{ scale: 0.98 }}
                    animate={
                      card.title === "Magnetic CTA" && !reducedMotion
                        ? { x: magneticOffset.x, y: magneticOffset.y }
                        : { x: 0, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    {card.cta}
                  </motion.button>

                  <motion.a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
                    whileHover={reducedMotion ? undefined : { x: 2 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    Secondary
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </section>

          <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Next: add a “quirky cursor” variant, a tooltip system, and a small
            component API so these patterns can be copy/pasted into other demos.
          </section>
        </div>
      </div>
    </MotionConfig>
  );
}
