import Link from "next/link";
import { cta, footerNav, legalNav, site } from "@/content/site";
import { fr } from "@/lib/typography";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { CurrentYear } from "./CurrentYear";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";

const footerQuote = fr(
  "Votre prochain avantage concurrentiel se cache peut-être dans une tâche que vous répétez chaque jour.",
);

export function Footer() {
  return (
    <footer className="relative overflow-clip border-t border-white/[0.07] bg-ink-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.10),transparent)]"
      />
      <div className="container-x relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label="Businessister — Accueil" className="inline-flex rounded-lg">
              <Logo idSuffix="footer" />
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-mist">{site.tagline}</p>
          </div>

          <nav aria-label="Plan du site" className="lg:col-span-2">
            <p className="eyebrow text-dim">Explorer</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-mist transition-colors hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informations légales" className="lg:col-span-2">
            <p className="eyebrow text-dim">Informations</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-mist transition-colors hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className="text-mist transition-colors hover:text-ivory" />
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-[1.05rem] leading-snug tracking-[-0.01em] text-ivory">
              {footerQuote}
            </p>
            <ButtonLink href="/contact" size="sm" className="mt-6">
              {cta.primary}
            </ButtonLink>
            {site.contact.email ? (
              <p className="mt-6 text-sm text-mist">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="underline decoration-white/20 underline-offset-4 hover:text-ivory"
                >
                  {site.contact.email}
                </a>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.07] pt-8 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear />
            {site.name}. Tous droits réservés.
          </p>
          <p className="font-mono text-xs tracking-[0.12em]">{site.domain.toUpperCase()}</p>
        </div>
      </div>
    </footer>
  );
}
