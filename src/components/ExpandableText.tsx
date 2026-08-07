"use client";

import { useState, type ReactNode } from "react";

const PREVIEW_LENGTH = 320;

type Props = {
  text: string;
  className?: string;
};

export function ExpandableText({ text, className = "" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const needsExpand = text.length > PREVIEW_LENGTH;
  const display = expanded || !needsExpand ? text : truncate(text, PREVIEW_LENGTH);

  return (
    <div className={className}>
      <p className="whitespace-pre-line text-sm leading-relaxed text-forest-mid">
        {linkify(display)}
      </p>
      {needsExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 text-xs uppercase tracking-[0.16em] text-brick transition hover:text-brick-deep"
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}

export function linkify(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const raw = match[1];
    const trailing = raw.match(/[.,;:!?)\]'"]+$/);
    const href = trailing ? raw.slice(0, -trailing[0].length) : raw;
    const suffix = trailing ? trailing[0] : "";

    if (href) {
      nodes.push(
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-brick underline decoration-brick/35 underline-offset-2 transition hover:text-brick-deep hover:decoration-brick-deep"
        >
          {href}
        </a>,
      );
    }

    if (suffix) nodes.push(suffix);
    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  const sliced = value.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}
