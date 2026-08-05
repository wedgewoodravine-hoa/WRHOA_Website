import type { ReactNode } from "react";

export const SECTION_BANDS = [
  "band-paper",
  "band-mist",
  "band-parchment",
  "band-forest-soft",
] as const;

export type SectionBandTone =
  | (typeof SECTION_BANDS)[number]
  | "band-forest-deep"
  | "paper"
  | "mist"
  | "parchment"
  | "forest-soft"
  | "forest-deep";

type Props = {
  children: ReactNode;
  /** Named tone, full class, or numeric index into the alternating palette */
  band?: SectionBandTone | number;
  className?: string;
};

export function getSectionBand(index: number) {
  return SECTION_BANDS[((index % SECTION_BANDS.length) + SECTION_BANDS.length) % SECTION_BANDS.length];
}

export function resolveSectionBand(band: SectionBandTone | number = 0) {
  if (typeof band === "number") return getSectionBand(band);
  if (band.startsWith("band-")) return band;
  return `band-${band}`;
}

export function SectionBand({ children, band = 0, className = "" }: Props) {
  return (
    <section className={`section-band ${resolveSectionBand(band)} ${className}`.trim()}>
      {children}
    </section>
  );
}
