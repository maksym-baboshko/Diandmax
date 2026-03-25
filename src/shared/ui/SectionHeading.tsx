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
    <div className={cn("mb-10 md:mb-14", align === "center" && "text-center", className)}>
      <h2 className="heading-serif mb-3 text-3xl text-text-primary md:text-4xl lg:text-5xl">
        {children}
      </h2>
      {subtitle && (
        <p className="heading-serif-italic text-lg text-accent md:text-xl">{subtitle}</p>
      )}
      <hr className="gold-rule mx-auto mt-6 w-24" />
    </div>
  );
}
