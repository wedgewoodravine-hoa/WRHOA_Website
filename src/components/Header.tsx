"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { navigation, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [expandedHref, setExpandedHref] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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
            className="fixed inset-x-0 bottom-0 z-[60] overflow-y-auto overscroll-contain border-t border-forest/10 bg-paper lg:hidden"
            style={{ top: menuTop }}
            id="mobile-nav"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
              {navigation.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isExpanded = expandedHref === item.href;
                const childLinks = item.children
                  ? item.children.some((child) => child.href === item.href)
                    ? item.children
                    : [{ label: item.label, href: item.href }, ...item.children]
                  : [];

                return (
                  <div key={item.href} className="border-b border-forest/8 py-2">
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        className={`flex w-full items-center justify-between gap-3 py-1 text-left font-display text-xl ${
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
                        className={`block py-1 font-display text-xl ${
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
                              className="py-1.5 text-sm text-forest-mid"
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="py-1.5 text-sm text-forest-mid"
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
          ? "border-forest/15 bg-paper/95 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        ref={barRef}
        className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8"
      >
        <Link href="/" className="group flex items-center gap-3 sm:gap-4">
          <Image
            src="/images/logo.png"
            alt={site.fullName}
            width={620}
            height={474}
            className="h-16 w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-20 md:h-24"
            priority
          />
          <div className="leading-tight">
            <div className="font-display text-base tracking-[0.02em] text-forest-deep sm:text-lg">
              {site.name}
            </div>
            <div className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-forest-mid/80 sm:text-[0.65rem]">
              Home Owners Association
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className={`relative px-3 py-2 text-[0.82rem] uppercase tracking-[0.14em] transition-colors ${
                  isActive(item.href)
                    ? "text-brick"
                    : "text-forest-deep/80 hover:text-brick"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-brick transition-transform duration-300 ${
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
              {item.children ? (
                <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="mt-2 border border-forest/15 bg-paper/97 p-2 shadow-[0_18px_40px_rgba(28,23,20,0.12)] backdrop-blur-md">
                    {item.children.map((child) =>
                      child.external ? (
                        <a
                          key={child.label}
                          href={child.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block px-3 py-2 text-sm text-forest-deep/85 transition-colors hover:bg-mist/70 hover:text-brick"
                        >
                          {child.label}
                        </a>
                      ) : (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-forest-deep/85 transition-colors hover:bg-mist/70 hover:text-brick"
                        >
                          {child.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex h-10 w-10 items-center justify-center border border-forest/20 text-forest-deep lg:hidden"
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
