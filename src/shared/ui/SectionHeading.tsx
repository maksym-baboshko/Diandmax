import { cn } from "@/shared/lib/cn";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

export function SectionHeading({
  children,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl text-text-primary mb-3">
        {children}
      </h2>
      {subtitle && (
        <p className="heading-serif-italic text-lg md:text-xl text-accent">
          {subtitle}
        </p>
      )}
      <hr className="gold-rule w-24 mx-auto mt-6" />
    </div>
  );
}
