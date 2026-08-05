"use client";

import { useEffect, useId, useState } from "react";
import type { KnackPrefill } from "@/lib/contact-forms";
import type { KnackEmbed as KnackEmbedConfig } from "@/lib/site";

export type { KnackPrefill };

type Props = {
  embed: KnackEmbedConfig;
  className?: string;
  /** Prefill form fields after Knack renders (script embeds). */
  prefill?: KnackPrefill;
};

declare global {
  interface Window {
    app_id?: string;
    distribution_key?: string;
    jQuery?: JQueryLike;
    $?: JQueryLike;
  }
}

type JQueryLike = {
  (input: Document | string): JQueryCollection;
};

type JQueryCollection = {
  length: number;
  on: (events: string, handler: () => void) => JQueryCollection;
  off: (events: string, handler?: () => void) => JQueryCollection;
  val: ((value: string) => JQueryCollection) & (() => string);
  trigger: (event: string) => JQueryCollection;
  find: (selector: string) => JQueryCollection;
  first: () => JQueryCollection;
  prop: (name: string, value: boolean | string) => JQueryCollection;
};

function buildSceneHash(scene: string, prefill?: KnackPrefill) {
  const base = scene.replace(/^#/, "").replace(/\/?$/, "/");
  if (!prefill) return base;
  const vars = encodeURIComponent(JSON.stringify(prefill.values));
  return `${base}?${prefill.viewKey}_vars=${vars}`;
}

function getJQuery() {
  return window.jQuery || window.$;
}

function applyPrefillValues(prefill: KnackPrefill) {
  const $ = getJQuery();
  if (!$) return false;

  let applied = false;

  for (const [fieldKey, raw] of Object.entries(prefill.values)) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) continue;

    const selectors = [
      `#${prefill.viewKey}-${fieldKey}`,
      `#${prefill.viewKey} select[id*="${fieldKey}"]`,
      `#${prefill.viewKey} [name="${fieldKey}"]`,
      `#${prefill.viewKey} [data-field-key="${fieldKey}"]`,
      `.kn-form select[name="${fieldKey}"]`,
      `select#${fieldKey}`,
    ];

    for (const selector of selectors) {
      const $field = $(selector);
      if (!$field.length) continue;

      $field.val(value);
      $field.trigger("change");
      $field.trigger("liszt:updated");
      $field.trigger("chosen:updated");
      applied = true;
      break;
    }
  }

  return applied;
}

function mountHasKnackContent(mountId: string) {
  const mount = document.getElementById(mountId);
  if (!mount) return false;
  return Boolean(
    mount.querySelector(
      ".kn-form, .kn-view, .kn-scene, form, .kn-table, .kn-current_user",
    ),
  );
}

function teardownKnackScripts() {
  document
    .querySelectorAll<HTMLScriptElement>("script[data-knack]")
    .forEach((script) => {
      script.remove();
    });

  try {
    // Force a fresh Knack runtime on SPA remounts.
    delete (window as Window & { Knack?: unknown }).Knack;
  } catch {
    (window as Window & { Knack?: unknown }).Knack = undefined;
  }
}

export function KnackEmbed({ embed, className = "", prefill }: Props) {
  const reactId = useId().replace(/:/g, "");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (embed.type !== "script") return;

    let cancelled = false;
    let pollTimer = 0;
    let prefillTimerA = 0;
    let prefillTimerB = 0;

    const key = `${embed.appId}-${embed.distributionKey}`;
    const mountId = `knack-${embed.distributionKey}`;

    setStatus("loading");

    window.app_id = embed.appId;
    window.distribution_key = embed.distributionKey;

    if (embed.scene) {
      window.location.hash = buildSceneHash(embed.scene, prefill);
    } else if (prefill) {
      const vars = encodeURIComponent(JSON.stringify(prefill.values));
      const current = window.location.hash.replace(/^#/, "").split("?")[0] || "";
      window.location.hash = `${current}?${prefill.viewKey}_vars=${vars}`;
    }

    // Reset mount text without React owning Knack's injected DOM.
    const mount = document.getElementById(mountId);
    if (mount) {
      mount.textContent = "Loading…";
    }

    teardownKnackScripts();

    const tryPrefill = () => {
      if (cancelled || !prefill) return;
      applyPrefillValues(prefill);
    };

    const onViewRender = () => {
      if (cancelled) return;
      setStatus("ready");
      tryPrefill();
      prefillTimerA = window.setTimeout(tryPrefill, 100);
      prefillTimerB = window.setTimeout(tryPrefill, 400);
    };

    const bindPrefillListeners = () => {
      if (!prefill) return;
      const $ = getJQuery();
      if (!$) return;
      // Knack fires namespaced view/scene events; binding the base name catches them.
      $(document).on("knack-view-render.wrhoaPrefill", onViewRender);
      $(document).on("knack-scene-render.wrhoaPrefill", onViewRender);
    };

    const unbindPrefillListeners = () => {
      if (!prefill) return;
      const $ = getJQuery();
      if (!$) return;
      $(document).off("knack-view-render.wrhoaPrefill", onViewRender);
      $(document).off("knack-scene-render.wrhoaPrefill", onViewRender);
    };

    const script = document.createElement("script");
    script.src = `https://loader.knack.com/${embed.appId}/${embed.distributionKey}/knack.js`;
    script.async = true;
    script.dataset.knack = key;
    script.dataset.knackMount = reactId;

    script.onload = () => {
      if (cancelled) return;
      bindPrefillListeners();

      const started = Date.now();
      const poll = () => {
        if (cancelled) return;
        if (mountHasKnackContent(mountId)) {
          setStatus("ready");
          tryPrefill();
          return;
        }
        if (Date.now() - started > 12000) {
          setStatus("error");
          return;
        }
        pollTimer = window.setTimeout(poll, 200);
      };
      poll();
    };

    script.onerror = () => {
      if (!cancelled) setStatus("error");
    };

    document.body.appendChild(script);

    return () => {
      cancelled = true;
      window.clearTimeout(pollTimer);
      window.clearTimeout(prefillTimerA);
      window.clearTimeout(prefillTimerB);
      unbindPrefillListeners();
      script.remove();
    };
  }, [embed, prefill, reactId, reloadToken]);

  if (embed.type === "iframe") {
    return (
      <div className={`knack-shell ${className}`}>
        <iframe
          src={embed.src}
          title="Wedgewood HOA portal"
          className="knack-frame"
          style={{ height: embed.height ?? 1000 }}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`knack-shell p-2 sm:p-4 ${className}`}>
      {status === "error" ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-forest-mid">
            The form didn&apos;t finish loading. This can happen after moving
            between portal pages.
          </p>
          <button
            type="button"
            className="btn btn-outline mt-5"
            onClick={() => setReloadToken((value) => value + 1)}
          >
            Reload form
          </button>
        </div>
      ) : null}

      {/*
        Keep this node free of React children after mount so Knack can own the DOM.
        Loading copy is written imperatively in the effect.
      */}
      <div
        id={`knack-${embed.distributionKey}`}
        className={status === "error" ? "hidden" : "min-h-[28rem]"}
        suppressHydrationWarning
      />
    </div>
  );
}
