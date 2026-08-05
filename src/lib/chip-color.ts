import type { ChipColor } from "@/lib/types";

/** bg-<color> text-cream Tailwind class per chip color, matching the mockup's category chips. */
export const CHIP_BG: Record<ChipColor, string> = {
  teal: "bg-teal text-cream",
  clay: "bg-clay text-cream",
  plum: "bg-plum text-cream",
  moss: "bg-moss text-cream",
  indigo: "bg-indigo text-cream",
  pink: "bg-pink text-cream",
};
