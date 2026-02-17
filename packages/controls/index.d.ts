import type { Dispatch, JSX, SetStateAction } from "react";

export declare function usePrefersReducedMotion(): boolean;

export declare function usePageVisibility(): boolean;

export declare function usePersistedBoolean(
  key: string,
  fallbackValue?: boolean,
): readonly [boolean, Dispatch<SetStateAction<boolean>>];

export declare function usePersistedNullableBoolean(
  key: string,
): readonly [boolean | null, Dispatch<SetStateAction<boolean | null>>];

export type DemoControlTone = "light" | "dark";

export type DemoControlBarProps = {
  reducedMotion: boolean;
  reducedMotionUsesSystem: boolean;
  onReducedMotionChange: (checked: boolean) => void;
  onReducedMotionSystem: () => void;
  perfMode: boolean;
  onPerfModeChange: (checked: boolean) => void;
  repoUrl?: string;
  tone?: DemoControlTone;
};

export declare function DemoControlBar(props: DemoControlBarProps): JSX.Element;
