import { Ornament } from "@/shared/ui";
import { GamesFooter } from "./GamesFooter";
import { GamesHeader } from "./GamesHeader";

interface GamesShellProps {
  children: React.ReactNode;
}

export function GamesShell({ children }: GamesShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Corner ornaments */}
      <Ornament position="top-left" size="lg" className="opacity-20" />
      <Ornament position="top-right" size="lg" className="opacity-20" />
      <Ornament position="bottom-left" size="sm" className="opacity-10" />
      <Ornament position="bottom-right" size="sm" className="opacity-10" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <GamesHeader />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 pt-14 outline-none md:pt-18 lg:pt-20"
        >
          {children}
        </main>
        <GamesFooter />
      </div>
    </div>
  );
}
