import type { ReactNode } from "react";
import {
  SectionBand,
  type SectionBandTone,
} from "@/components/SectionBand";

type Props = {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
  /** Alternating section band. Pass an index (0–3…) or a named tone. */
  band?: SectionBandTone | number;
  /** Set false for nested layouts that already sit inside a SectionBand */
  banded?: boolean;
};

export function ContentSection({
  children,
  narrow = false,
  className = "",
  band = 0,
  banded = true,
}: Props) {
  const inner = (
    <div
      className={`mx-auto w-full min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 ${
        narrow ? "max-w-3xl" : "max-w-6xl"
      } ${className}`}
    >
      {children}
    </div>
  );

  if (!banded) return inner;

  return <SectionBand band={band}>{inner}</SectionBand>;
}
