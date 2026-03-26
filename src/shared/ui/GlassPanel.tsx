import { cn } from "@/shared/lib";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function GlassPanel({ children, className, contentClassName }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "group/glass relative overflow-hidden rounded-4xl border border-accent/24 bg-bg-primary/72 shadow-[0_30px_100px_rgba(0,0,0,0.25)] md:rounded-[2.5rem]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-20 rounded-4xl border border-accent/0 transition-colors duration-500 group-hover/glass:border-accent/40 md:rounded-[2.5rem]" />
      <div className={cn("relative z-10", contentClassName)}>{children}</div>
    </div>
  );
}
