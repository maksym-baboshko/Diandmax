import { Ornament } from "@/shared/ui";
import { GamesFooter } from "./GamesFooter";
import { GamesHeader } from "./GamesHeader";

interface GamesShellProps {
  children: React.ReactNode;
}

export function GamesShell({ children }: GamesShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-primary text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-accent/6 via-transparent to-accent/8" />
      <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-accent/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/8 blur-[140px]" />

      <Ornament position="top-left" size="lg" className="opacity-20" />
      <Ornament position="top-right" size="lg" className="opacity-20" />
      <Ornament position="bottom-left" size="sm" className="opacity-12" />
      <Ornament position="bottom-right" size="sm" className="opacity-12" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <GamesHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <GamesFooter />
      </div>
    </div>
  );
}
