import { cn } from "@/shared/lib/cn";

interface OrnamentProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md" | "lg";
}

export function Ornament({
  className,
  position = "top-left",
  size = "md",
}: OrnamentProps) {
  const sizeClasses = {
    sm: "w-16 h-16 md:w-20 md:h-20",
    md: "w-24 h-24 md:w-32 md:h-32",
    lg: "w-32 h-32 md:w-40 md:h-40",
  };

  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 -scale-x-100",
    "bottom-left": "bottom-0 left-0 -scale-y-100",
    "bottom-right": "bottom-0 right-0 -scale-x-100 -scale-y-100",
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-none opacity-60",
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M5 115 Q 20 80, 40 60 Q 55 45, 70 35 Q 85 25, 105 15"
          stroke="currentColor"
          strokeWidth="1"
          className="text-accent"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M40 60 Q 30 45, 25 30"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-accent"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M25 30 Q 20 25, 22 18 Q 28 22, 25 30"
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-accent"
          fill="none"
        />
        <path
          d="M70 35 Q 75 50, 85 55"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-accent"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M85 55 Q 92 52, 95 45 Q 90 50, 85 55"
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-accent"
          fill="none"
        />
        <circle cx="105" cy="15" r="1.5" className="fill-accent" />
        <path
          d="M5 115 Q 15 105, 10 95"
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-accent"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M10 95 Q 7 90, 12 88 Q 11 93, 10 95"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-accent"
          fill="none"
        />
      </svg>
    </div>
  );
}
