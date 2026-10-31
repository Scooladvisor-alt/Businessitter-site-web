import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "aube";
};

export function Eyebrow({ children, className, tone = "default" }: EyebrowProps) {
  return (
    <p className={cn("eyebrow inline-flex items-center gap-3 text-mist", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-8",
          tone === "aube" ? "bg-[linear-gradient(90deg,#ffc88f,#86e6da)]" : "bg-white/25",
        )}
      />
      {children}
    </p>
  );
}
