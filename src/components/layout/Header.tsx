"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { cta, legalNav, mainNav } from "@/content/site";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/scroll";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const isHome = pathname === "/";
  const auditHref = isHome ? "#audit" : "/contact";

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Menu ouvert : contenu inerte, défilement bloqué, Échap pour fermer.
  useEffect(() => {
    if (!open) return;
    const outside = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer, [data-chapter-nav]"),
    );
    outside.forEach((el) => el.setAttribute("inert", ""));
    const lenis = getLenis();
    lenis?.stop();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => firstLinkRef.current?.focus(), 120);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      outside.forEach((el) => el.removeAttribute("inert"));
      document.documentElement.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [open, close]);

  // Le menu se ferme si l'en-tête est masqué (navigation conservée par Activity).
  useEffect(() => () => setOpen(false), []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="glass-light pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full pl-5 pr-2 sm:h-[3.75rem] sm:pl-7">
          <Link
            href="/"
            className="relative -m-1.5 rounded-full p-1.5"
            aria-label="Businessitter — Accueil"
            onClick={() => close()}
          >
            <Logo idSuffix="header" className="h-7 -translate-y-[3px] sm:h-8" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative inline-flex h-10 items-center rounded-full px-4 text-[0.92rem] font-medium transition-colors duration-300",
                        active
                          ? "bg-ink-950/[0.06] text-ink-950"
                          : "text-ink-600 hover:bg-ink-950/[0.05] hover:text-ink-950",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href={auditHref} size="sm" className="hidden sm:inline-flex">
              {cta.short}
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              className="relative inline-flex size-10 items-center justify-center rounded-full bg-ink-950/[0.06] text-ink-950 transition-colors hover:bg-ink-950/10 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-out-expo",
                    open && "translate-y-[5.25px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-out-expo",
                    open && "-translate-y-[5.25px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hors de l'en-tête : son effet de verre (backdrop-filter) créerait un
        bloc conteneur pour les éléments en position fixe. */}
      <AnimatePresence>
        {open ? (
          <m.div
            id="menu-mobile"
            key="menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-950/[0.96] pt-[calc(var(--header-height)+0.5rem)] backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <nav
              aria-label="Navigation mobile"
              className="container-x flex flex-1 flex-col pb-10 pt-8"
            >
              <ul className="flex flex-col">
                {[{ label: "Accueil", href: "/" }, ...mainNav].map((item, index) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <m.li
                      key={item.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: 0.08 + index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => close()}
                        className="group flex items-center justify-center py-3.5 text-[clamp(1.75rem,7vw,2.5rem)] font-medium tracking-[-0.035em] text-ivory"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-col gap-8"
              >
                <ButtonLink
                  href={isHome ? "#audit" : "/contact"}
                  size="lg"
                  className="w-full"
                  onClick={() => close()}
                >
                  {cta.primary}
                </ButtonLink>
                <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-dim">
                  {legalNav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => close()} className="hover:text-ivory">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </m.div>
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
