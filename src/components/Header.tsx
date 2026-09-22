"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navigation, site, type NavItem } from "@/lib/site";

const DESKTOP_NAV_QUERY = "(min-width: 1280px)";

function linksFor(item: NavItem) {
  const children = item.children ?? [];
  if (!children.length) return children;
  const hasSelf = children.some((child) => child.href === item.href && !child.external);
  return hasSelf ? children : [{ label: item.label, href: item.href }, ...children];
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const touchNav = useRef(false);
  const menuOpenedAt = useRef(0);
  const openMenuRef = useRef<string | null>(null);
  openMenuRef.current = openMenu;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const desktop = window.matchMedia(DESKTOP_NAV_QUERY);
    const syncHover = () => setFinePointer(hover.matches);
    const syncDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    syncHover();
    hover.addEventListener("change", syncHover);
    desktop.addEventListener("change", syncDesktop);
    return () => {
      hover.removeEventListener("change", syncHover);
      desktop.removeEventListener("change", syncDesktop);
    };
  }, []);

  useEffect(() => {
    if (!openMenu) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu]);

  // Samsung Internet often ignores <summary> taps once the disclosure marker
  // is hidden. If a tap doesn't toggle the element, do it after the click.
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let timer = 0;

    const summaryFrom = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      if (target.closest("a, button, input, select, textarea, label")) return null;
      const summary = target.closest("summary");
      const details = summary?.parentElement;
      return details instanceof HTMLDetailsElement ? { summary, details } : null;
    };

    const onTouchStart = (event: TouchEvent) => {
      startX = event.touches[0]?.clientX ?? 0;
      startY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const endY = event.changedTouches[0]?.clientY ?? 0;
      if (Math.abs(endX - startX) > 12 || Math.abs(endY - startY) > 12) return;
      const match = summaryFrom(event.target);
      if (!match) return;
      const { details } = match;
      const wasOpen = details.open;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (details.open === wasOpen) details.open = !wasOpen;
      }, 400);
    };

    const onClick = (event: MouseEvent) => {
      const match = summaryFrom(event.target);
      if (!match) return;
      const { details } = match;
      const wasOpen = details.open;
      window.clearTimeout(timer);
      window.setTimeout(() => {
        if (details.open === wasOpen) details.open = !wasOpen;
      }, 0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExpandedHref(null);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) setExpandedHref(null);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const syncMenuTop = () => {
      if (barRef.current) {
        setMenuTop(barRef.current.getBoundingClientRect().bottom);
      }
    };
    syncMenuTop();
    window.addEventListener("resize", syncMenuTop);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("resize", syncMenuTop);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const solidBar = scrolled || open;

  const mobileMenu =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-x-0 bottom-0 z-[60] overflow-y-auto overscroll-contain border-t border-forest/10 bg-paper touch-manipulation xl:hidden"
            style={{ top: menuTop }}
            id="mobile-nav"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
              {navigation.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isExpanded = expandedHref === item.href;
                const childLinks = linksFor(item);

                return (
                  <div key={item.href} className="border-b border-forest/8 py-2">
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        className={`flex min-h-11 w-full touch-manipulation items-center justify-between gap-3 py-2 text-left font-display text-xl ${
                          isActive(item.href) ? "text-brick" : "text-forest-deep"
                        }`}
                        onClick={() =>
                          setExpandedHref((current) =>
                            current === item.href ? null : item.href,
                          )
                        }
                      >
                        <span>{item.label}</span>
                        <span
                          aria-hidden
                          className={`text-base leading-none text-forest-mid transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex min-h-11 touch-manipulation items-center py-2 font-display text-xl ${
                          isActive(item.href) ? "text-brick" : "text-forest-deep"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                    {hasChildren && isExpanded ? (
                      <div className="mt-1 flex flex-col gap-1 pb-2 pl-2">
                        {childLinks.map((child) =>
                          child.external ? (
                            <a
                              key={child.label}
                              href={child.href}
                              target="_blank"
                              rel="noreferrer"
                              className="block min-h-11 py-3 text-sm text-forest-mid touch-manipulation"
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block min-h-11 py-3 text-sm text-forest-mid touch-manipulation"
                            >
                              {child.label}
                            </Link>
                          ),
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        solidBar
          ? "border-forest/15 bg-paper/95"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        ref={barRef}
        className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8"
      >
        <Link href="/" className="group flex min-w-0 items-center gap-3 sm:gap-4">
          <Image
            src="/images/logo.png"
            alt={site.fullName}
            width={620}
            height={474}
            className="h-16 w-auto shrink-0 transition-transform duration-300 group-hover:scale-[1.03] sm:h-20 md:h-24"
            priority
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-base tracking-[0.02em] text-forest-deep sm:text-lg">
              {site.name}
            </div>
            <div className="mt-0.5 truncate text-[0.6rem] uppercase tracking-[0.16em] text-forest-mid/80 sm:text-[0.65rem]">
              Home Owners Association
            </div>
          </div>
        </Link>

        <nav ref={navRef} className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const menuOpen = openMenu === item.href;
            const childLinks = linksFor(item);

            return (
              <div
                key={item.href}
                className="relative"
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse" || !finePointer) return;
                  if (!hasChildren) {
                    setOpenMenu(null);
                    return;
                  }
                  if (openMenuRef.current !== item.href) {
                    menuOpenedAt.current = Date.now();
                  }
                  setOpenMenu(item.href);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "mouse" || !finePointer || touchNav.current) {
                    return;
                  }
                  setOpenMenu((current) => (current === item.href ? null : current));
                }}
                onBlur={(event) => {
                  if (touchNav.current) return;
                  const next = event.relatedTarget;
                  if (next instanceof Node && event.currentTarget.contains(next)) return;
                  const wrapper = event.currentTarget;
                  window.setTimeout(() => {
                    if (!wrapper.contains(document.activeElement)) {
                      setOpenMenu((current) => (current === item.href ? null : current));
                    }
                  }, 0);
                }}
              >
                <Link
                  href={item.href}
                  aria-haspopup={hasChildren ? "menu" : undefined}
                  aria-expanded={hasChildren ? menuOpen : undefined}
                  className={`relative inline-flex min-h-11 touch-manipulation items-center gap-1 px-3 py-2 text-[0.82rem] uppercase tracking-[0.14em] transition-colors ${
                    isActive(item.href)
                      ? "text-brick"
                      : "text-forest-deep/80 hover:text-brick"
                  }`}
                  onPointerDown={(event) => {
                    touchNav.current =
                      event.pointerType === "touch" || event.pointerType === "pen";
                  }}
                  onTouchStart={() => {
                    touchNav.current = true;
                  }}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.button !== 0
                    ) {
                      return;
                    }
                    if (!hasChildren) {
                      setOpenMenu(null);
                      return;
                    }
                    const fromTouch = touchNav.current || !finePointer;
                    if (!fromTouch) return;
                    event.preventDefault();
                    const sinceOpen = Date.now() - menuOpenedAt.current;
                    const shouldClose = openMenu === item.href && sinceOpen > 250;
                    if (!shouldClose) menuOpenedAt.current = Date.now();
                    setOpenMenu(shouldClose ? null : item.href);
                    window.setTimeout(() => {
                      touchNav.current = false;
                    }, 500);
                  }}
                >
                  {item.label}
                  {hasChildren ? (
                    <span
                      aria-hidden
                      className={`text-[0.65rem] leading-none transition-transform ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  ) : null}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-brick transition-transform duration-300 ${
                      isActive(item.href) || menuOpen ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
                {hasChildren && menuOpen ? (
                  <div className="absolute left-0 top-full z-50 min-w-56 pt-2">
                    <div className="max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain border border-forest/15 bg-paper p-2 shadow-[0_18px_40px_rgba(28,23,20,0.12)]">
                      {childLinks.map((child) =>
                        child.external ? (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block min-h-11 touch-manipulation px-3 py-2.5 text-sm text-forest-deep/85 transition-colors hover:bg-mist/70 hover:text-brick"
                            onClick={() => setOpenMenu(null)}
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block min-h-11 touch-manipulation px-3 py-2.5 text-sm text-forest-deep/85 transition-colors hover:bg-mist/70 hover:text-brick"
                            onClick={() => setOpenMenu(null)}
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="relative z-20 inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border border-forest/20 text-forest-deep xl:hidden"
          onClick={() => {
            if (!open && barRef.current) {
              setMenuTop(barRef.current.getBoundingClientRect().bottom);
            }
            setOpen((v) => !v);
          }}
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-4 flex-col gap-1.5">
            <span
              className={`h-px bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span className={`h-px bg-current transition ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-px bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {mobileMenu}
    </header>
  );
}
