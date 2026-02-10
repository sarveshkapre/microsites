export type MicrositeStatus = "planned" | "building" | "ready";

export type Microsite = {
  id:
    | "premium-product"
    | "editorial-scrolly"
    | "neon-cinematic"
    | "playful-micro"
    | "webgl-dom-sync"
    | "dataviz-scrolly";
  title: string;
  description: string;
  stack: string[];
  status: MicrositeStatus;
  repoPath: `apps/${string}`;
  deployUrl?: string;
  poster: {
    gradient: string;
    accent: string;
  };
  capabilities: {
    reducedMotion: boolean;
    perfMode: boolean;
  };
};

export const repoUrl = "https://github.com/sarveshkapre/microsites" as const;
export const pagesBaseUrl =
  "https://sarveshkapre.github.io/microsites" as const;

export const microsites: Microsite[] = [
  {
    id: "premium-product",
    title: "Premium Product Scroll",
    description: "Pinned sections, subtle parallax, scroll-driven reveals.",
    stack: ["Next.js", "Tailwind", "GSAP/ScrollTrigger", "Lenis (optional)"],
    status: "ready",
    repoPath: "apps/premium-product",
    deployUrl: `${pagesBaseUrl}/premium-product/`,
    poster: {
      gradient: "from-indigo-500/30 via-sky-500/15 to-transparent",
      accent: "bg-indigo-500",
    },
    capabilities: {
      reducedMotion: true,
      perfMode: true,
    },
  },
  {
    id: "editorial-scrolly",
    title: "Editorial Scrollytelling",
    description: "Chapter-based narrative with sticky media panels.",
    stack: ["Next.js or Vite", "Tailwind", "ScrollTrigger or IO"],
    status: "ready",
    repoPath: "apps/editorial-scrolly",
    deployUrl: `${pagesBaseUrl}/editorial-scrolly/`,
    poster: {
      gradient: "from-emerald-500/30 via-teal-500/15 to-transparent",
      accent: "bg-emerald-500",
    },
    capabilities: {
      reducedMotion: true,
      perfMode: true,
    },
  },
  {
    id: "neon-cinematic",
    title: "Neon Cinematic Long-Scroll",
    description: "Layered motion with dramatic timing (tight perf budgets).",
    stack: ["Vite", "React", "Tailwind", "GSAP", "Optional shaders/particles"],
    status: "ready",
    repoPath: "apps/neon-cinematic",
    deployUrl: `${pagesBaseUrl}/neon-cinematic/`,
    poster: {
      gradient: "from-fuchsia-500/35 via-indigo-500/15 to-transparent",
      accent: "bg-fuchsia-500",
    },
    capabilities: {
      reducedMotion: true,
      perfMode: true,
    },
  },
  {
    id: "playful-micro",
    title: "Playful Micro-interactions",
    description: "Delightful cursor/hover interactions and UI toys.",
    stack: ["Vite", "React", "Framer Motion"],
    status: "ready",
    repoPath: "apps/playful-micro",
    deployUrl: `${pagesBaseUrl}/playful-micro/`,
    poster: {
      gradient: "from-amber-500/30 via-rose-500/15 to-transparent",
      accent: "bg-amber-500",
    },
    capabilities: {
      reducedMotion: true,
      perfMode: true,
    },
  },
  {
    id: "webgl-dom-sync",
    title: "WebGL + DOM Sync",
    description: "Scroll-driven 3D scene with readable DOM content.",
    stack: ["Next.js", "react-three-fiber", "drei"],
    status: "ready",
    repoPath: "apps/webgl-dom-sync",
    deployUrl: `${pagesBaseUrl}/webgl-dom-sync/`,
    poster: {
      gradient: "from-violet-500/35 via-sky-500/15 to-transparent",
      accent: "bg-violet-500",
    },
    capabilities: {
      reducedMotion: true,
      perfMode: true,
    },
  },
  {
    id: "dataviz-scrolly",
    title: "Data-viz Scrollytelling",
    description: "Scroll chapters that morph charts with narrative annotations.",
    stack: ["Vite", "React", "SVG chart primitives"],
    status: "ready",
    repoPath: "apps/dataviz-scrolly",
    deployUrl: `${pagesBaseUrl}/dataviz-scrolly/`,
    poster: {
      gradient: "from-cyan-500/30 via-blue-500/15 to-transparent",
      accent: "bg-cyan-500",
    },
    capabilities: {
      reducedMotion: true,
      perfMode: true,
    },
  },
];
