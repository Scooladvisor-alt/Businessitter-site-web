import Link from "next/link";
import { cta, footerNav, legalNav, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { RichText } from "@/components/ui/RichText";
import { ButtonLink } from "@/components/ui/Button";
import { CurrentYear } from "./CurrentYear";
import { CookiePreferencesButton } from "@/components/consent/CookiePreferencesButton";

export function Footer() {
  return (
    <footer
      data-backdrop="footer"
      className="relative overflow-clip border-t border-white/[0.07] bg-ink-950/55"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_200_143/0.09),transparent)]"
      />
      <div className="container-x relative flex flex-col items-center py-16 text-center md:py-20">
        <Link href="/" aria-label="Businessister — Accueil" className="inline-flex rounded-lg">
          <Logo idSuffix="footer" />
        </Link>
        <p className="mt-6 max-w-2xl text-[clamp(1.4rem,1.1rem+1.2vw,2.1rem)] font-medium leading-[1.15] tracking-[-0.025em] text-ivory">
          <RichText text={site.footerTagline} />
        </p>
        <ButtonLink href="/contact" size="md" className="mt-8">
          {cta.primary}
        </ButtonLink>
        {site.contact.email ? (
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-5 text-sm text-mist underline decoration-white/20 underline-offset-4 hover:text-ivory"
          >
            {site.contact.email}
          </a>
        ) : null}

        <nav aria-label="Plan du site" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-[0.95rem]">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-mist transition-colors hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 flex w-full flex-col items-center gap-4 border-t border-white/[0.07] pt-8 text-sm text-dim md:flex-row md:justify-between">
          <p>
            © <CurrentYear />
            {site.name}
          </p>
          <nav aria-label="Informations légales">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className="transition-colors hover:text-ivory" />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
