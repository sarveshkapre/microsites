import type { Dispatch, SetStateAction } from "react";

export declare function usePrefersReducedMotion(): boolean;

export declare function usePageVisibility(): boolean;

export declare function usePersistedBoolean(
  key: string,
  fallbackValue?: boolean,
): readonly [boolean, Dispatch<SetStateAction<boolean>>];

export declare function usePersistedNullableBoolean(
  key: string,
): readonly [boolean | null, Dispatch<SetStateAction<boolean | null>>];
