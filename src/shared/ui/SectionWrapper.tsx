import { cn } from "@/shared/lib/cn";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  alternate?: boolean;
  noPadding?: boolean;
  fullHeight?: boolean;
  noFade?: boolean;
}

export function SectionWrapper({
  children,
  id,
  className,
  alternate = false,
  noPadding = false,
  fullHeight = false,
  noFade = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden",
        !noPadding && "px-5 py-10 md:px-8 md:py-24 lg:py-32",
        alternate ? "bg-bg-secondary" : "bg-bg-primary",
        fullHeight && "min-h-screen flex flex-col items-center justify-center",
        className
      )}
    >
      {!noFade && (
        <>
          <div aria-hidden="true" className="absolute top-0 inset-x-0 h-16 bg-linear-to-b from-bg-primary to-transparent pointer-events-none z-20" />
          <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-16 bg-linear-to-t from-bg-primary to-transparent pointer-events-none z-20" />
        </>
      )}
      <div
        className={cn(
          "mx-auto w-full",
          !noPadding && "max-w-4xl"
        )}
      >
        {children}
      </div>
    </section>
  );
}
