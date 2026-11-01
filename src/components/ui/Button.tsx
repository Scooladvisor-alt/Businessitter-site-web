import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,background-position,color,box-shadow,border-color,transform] duration-700 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "btn-aube text-ink-950 shadow-[0_0_0_1px_rgb(255_255_255/0.18),0_14px_40px_-14px_rgb(255_200_143/0.55)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.32),0_18px_54px_-12px_rgb(134_230_218/0.6)]",
  secondary:
    "border border-white/15 bg-white/[0.02] text-ivory hover:border-white/35 hover:bg-white/[0.07]",
  ghost: "text-ivory hover:bg-white/[0.07]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.9rem]",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Flèche qui glisse au survol (deux flèches superposées). */
export function SlidingArrow({ external = false }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const move = external
    ? "group-hover/btn:translate-x-full group-hover/btn:-translate-y-full"
    : "group-hover/btn:translate-x-full";
  const enter = external
    ? "-translate-x-full translate-y-full group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
    : "-translate-x-full group-hover/btn:translate-x-0";
  return (
    <span aria-hidden="true" className="relative inline-flex size-4 overflow-hidden">
      <Icon
        strokeWidth={2}
        className={cn(
          "absolute inset-0 size-4 transition-transform duration-500 ease-out-expo",
          move,
        )}
      />
      <Icon
        strokeWidth={2}
        className={cn(
          "absolute inset-0 size-4 transition-transform duration-500 ease-out-expo",
          enter,
        )}
      />
    </span>
  );
}

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  arrow?: boolean;
  external?: boolean;
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  arrow = true,
  external = false,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <SlidingArrow external={external} /> : null}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow ? <SlidingArrow /> : null}
    </button>
  );
}

/** Lien texte discret avec soulignement animé. */
export function TextLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "group/btn inline-flex items-center gap-1.5 font-medium text-ivory underline decoration-white/25 decoration-1 underline-offset-[6px] transition-colors duration-300 hover:decoration-aqua",
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <SlidingArrow external />
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      <SlidingArrow />
    </Link>
  );
}
