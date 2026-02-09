import Link from "next/link";
import { microsites, repoUrl } from "@/lib/microsites";

export default function Home() {
  return (
    <div
      data-microsite="gallery"
      className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-zinc-900 text-sm font-semibold text-white dark:bg-white dark:text-black">
                μ
              </div>
              <div className="leading-tight">
                <div className="text-lg font-semibold tracking-tight">
                  microsites
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  gallery
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                GitHub
              </Link>
              <Link
                href={`${repoUrl}/blob/main/docs/EFFECTS.md`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Effects
              </Link>
              <Link
                href={`${repoUrl}/blob/main/docs/PERF.md`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Perf
              </Link>
            </div>
          </div>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            Interaction patterns you can copy, remix, and ship.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            This repo hosts original demo microsites inspired by modern
            scroll/motion storytelling. No cloned code, assets, or branding.
            Every demo should support <span className="font-medium">reduced motion</span>{" "}
            and stay within sensible performance budgets.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {microsites.map((site) => (
            <div
              key={site.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {site.title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {site.description}
                  </div>
                </div>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  {site.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  {site.capabilities.reducedMotion
                    ? "Reduced motion"
                    : "Reduced motion: pending"}
                </span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  {site.capabilities.perfMode
                    ? "Perf mode"
                    : "Perf mode: pending"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {site.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href={`${repoUrl}/tree/main/${site.repoPath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
                >
                  Code
                </Link>
                {site.deployUrl ? (
                  <Link
                    href={site.deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
                  >
                    Live
                  </Link>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-500">
                    Live: TBD
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>

        <footer className="flex flex-col gap-2 border-t border-zinc-200 pt-8 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <div>
            Local dev: <span className="font-mono">npm install</span> then{" "}
            <span className="font-mono">npm run dev</span>.
          </div>
          <div>
            Add a new demo under <span className="font-mono">apps/&lt;name&gt;</span>{" "}
            and keep <span className="font-mono">docs/EFFECTS.md</span> updated.
          </div>
        </footer>
      </div>
    </div>
  );
}
