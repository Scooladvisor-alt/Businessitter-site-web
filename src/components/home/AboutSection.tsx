import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { about } from "@/content/home";
import { RichText } from "@/components/ui/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

/** La photo n'est affichée que si le fichier existe dans /public. */
const hasPhoto = existsSync(join(process.cwd(), "public", about.founder.photo));

/**
 * À propos — le nom (le jeu de mots « sitter »), puis la personne derrière
 * Businessitter : un texte court à gauche, le portrait à droite.
 */
export function AboutSection() {
  const { name, founder } = about;
  return (
    <section
      id="a-propos"
      data-backdrop="apropos"
      aria-labelledby="a-propos-title"
      className="relative pb-16 pt-[calc(var(--header-height)+4rem)] md:pb-24 md:pt-[calc(var(--header-height)+6rem)]"
    >
      <div className="container-x">
        {/* 1. Le nom */}
        <header className="mx-auto max-w-6xl text-center">
          <SplitHeading
            id="a-propos-title"
            as="h1"
            text={name.title}
            className="text-headline font-medium text-ivory"
          />
        </header>
        <Reveal
          as="ul"
          stagger={0.1}
          className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-3 md:mt-16"
        >
          {name.pairs.map((pair, index) => {
            const last = index === name.pairs.length - 1;
            return (
              <li
                key={pair.word}
                className={
                  last
                    ? "glass-light flex w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-[1.6rem] px-6 py-5 text-center sm:py-6"
                    : "surface flex w-full flex-wrap items-baseline justify-center gap-x-3 gap-y-1 rounded-[1.6rem] px-6 py-4 text-center"
                }
              >
                <span
                  className={
                    last
                      ? "text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] font-semibold tracking-[-0.035em] text-ink-950"
                      : "text-[clamp(1.25rem,1.05rem+0.8vw,1.7rem)] font-medium tracking-[-0.03em] text-mist"
                  }
                >
                  <RichText text={pair.word} />
                </span>
                <span
                  className={
                    last
                      ? "text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] text-ink-700"
                      : "text-[clamp(1rem,0.95rem+0.3vw,1.2rem)] text-dim"
                  }
                >
                  {pair.text}
                </span>
              </li>
            );
          })}
        </Reveal>

        {/* 2. Le fondateur */}
        <div className="mx-auto mt-24 grid max-w-6xl items-center gap-12 md:mt-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="text-center lg:text-left">
            <SplitHeading
              text={founder.title}
              className="text-[clamp(2rem,1.1rem+3.2vw,4rem)] font-medium leading-[1.04] tracking-[-0.038em] text-ivory"
            />
            <Reveal className="mx-auto mt-8 max-w-xl space-y-5 lg:mx-0" delay={0.1}>
              {founder.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lead text-mist">
                  {paragraph}
                </p>
              ))}
              <p className="pt-2 text-[1.05rem] text-ivory">
                <span className="accent-serif text-aube text-[1.5rem]">{founder.signature}</span>
                <span className="mt-1 block text-[0.95rem] text-dim">{founder.role}</span>
              </p>
            </Reveal>
          </div>

          <Reveal className="mx-auto w-full max-w-sm lg:max-w-none" y={40}>
            <div className="glass-light relative aspect-[4/5] overflow-hidden rounded-[2rem] p-2">
              {hasPhoto ? (
                <Image
                  src={founder.photo}
                  alt={founder.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="rounded-[1.6rem] object-cover"
                />
              ) : (
                <div
                  role="img"
                  aria-label={founder.photoAlt}
                  className="flex h-full w-full items-center justify-center rounded-[1.6rem] bg-[linear-gradient(150deg,#ffe3c8,#f6cfe0_45%,#d9d6f7_75%,#c8f1ec)]"
                >
                  <span className="accent-serif text-[5rem] text-ink-950/80">AS</span>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
