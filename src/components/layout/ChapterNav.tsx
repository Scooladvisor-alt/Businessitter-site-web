"use client";

import { useEffect, useRef, useState } from "react";
import { chapters } from "@/content/site";
import { observeLine } from "@/lib/observe";
import { cn } from "@/lib/cn";

/**
 * Indicateur discret de progression (grands écrans) : neuf chapitres,
 * le chapitre courant est mis en évidence, chaque repère est cliquable.
 */
export function ChapterNav() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elements = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((el): el is HTMLElement => el !== null);
    const stopLine = observeLine(elements, 0.5, (entry) => {
      if (!entry.isIntersecting) return;
      const index = chapters.findIndex((chapter) => chapter.id === entry.target.id);
      if (index >= 0) setActive(index);
    });

    // Visible après le hero et jusqu'au pied de page.
    const hero = elements[0];
    const footer = document.querySelector("footer");
    const state = { hero: true, footer: false };
    const visibility = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === hero) state.hero = entry.isIntersecting;
          if (entry.target === footer) state.footer = entry.isIntersecting;
        });
        setVisible(!state.hero && !state.footer);
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    if (hero) visibility.observe(hero);
    if (footer) visibility.observe(footer);

    return () => {
      stopLine();
      visibility.disconnect();
    };
  }, []);

  return (
    <nav
      ref={ref}
      data-chapter-nav
      aria-label="Chapitres de la page"
      className={cn(
        "fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 transition-[opacity,visibility] duration-700 xl:block",
        visible ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <ol className="flex flex-col items-end gap-2.5">
        {chapters.map((chapter, index) => {
          const current = index === active;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={current ? "location" : undefined}
                className="group flex h-6 items-center gap-3 rounded-full pl-3"
              >
                <span
                  className={cn(
                    "glass translate-x-2 rounded-full px-3 py-1 text-[0.78rem] opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                    current ? "text-ivory" : "text-mist",
                  )}
                >
                  {chapter.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-px rounded-full transition-all duration-500 ease-out-expo",
                    current
                      ? "w-8 bg-[linear-gradient(90deg,#ffc88f,#86e6da)]"
                      : index < active
                        ? "w-4 bg-white/45 group-hover:w-6"
                        : "w-4 bg-white/20 group-hover:w-6",
                  )}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
