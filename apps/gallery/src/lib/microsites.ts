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
  },
  {
    id: "editorial-scrolly",
    title: "Editorial Scrollytelling",
    description: "Chapter-based narrative with sticky media panels.",
    stack: ["Next.js or Vite", "Tailwind", "ScrollTrigger or IO"],
    status: "ready",
    repoPath: "apps/editorial-scrolly",
    deployUrl: `${pagesBaseUrl}/editorial-scrolly/`,
  },
  {
    id: "neon-cinematic",
    title: "Neon Cinematic Long-Scroll",
    description: "Layered motion with dramatic timing (tight perf budgets).",
    stack: ["Vite", "React", "Tailwind", "GSAP", "Optional shaders/particles"],
    status: "ready",
    repoPath: "apps/neon-cinematic",
    deployUrl: `${pagesBaseUrl}/neon-cinematic/`,
  },
  {
    id: "playful-micro",
    title: "Playful Micro-interactions",
    description: "Delightful cursor/hover interactions and UI toys.",
    stack: ["Vite", "React", "Framer Motion"],
    status: "ready",
    repoPath: "apps/playful-micro",
    deployUrl: `${pagesBaseUrl}/playful-micro/`,
  },
  {
    id: "webgl-dom-sync",
    title: "WebGL + DOM Sync",
    description: "Scroll-driven 3D scene with readable DOM content.",
    stack: ["Next.js", "react-three-fiber", "drei"],
    status: "ready",
    repoPath: "apps/webgl-dom-sync",
    deployUrl: `${pagesBaseUrl}/webgl-dom-sync/`,
  },
  {
    id: "dataviz-scrolly",
    title: "Data-viz Scrollytelling",
    description: "Scroll chapters that morph charts with narrative annotations.",
    stack: ["Vite", "React", "D3 or Recharts"],
    status: "ready",
    repoPath: "apps/dataviz-scrolly",
    deployUrl: `${pagesBaseUrl}/dataviz-scrolly/`,
  },
];
