import { cn } from "@/shared/lib";
import type { ReactNode } from "react";

type StorybookCanvasTone = "primary" | "secondary";

const toneClassNames: Record<StorybookCanvasTone, string> = {
  primary: "bg-bg-primary",
  secondary: "bg-bg-secondary",
};

interface StorybookCenteredCanvasProps {
  children: ReactNode;
  widthClassName?: string;
  tone?: StorybookCanvasTone;
  paddingClassName?: string;
  className?: string;
}

export function StorybookCenteredCanvas({
  children,
  widthClassName = "w-[min(32rem,92vw)]",
  tone = "primary",
  paddingClassName = "p-6",
  className,
}: StorybookCenteredCanvasProps) {
  return (
    <div className={cn(widthClassName, toneClassNames[tone], paddingClassName, className)}>
      {children}
    </div>
  );
}

interface StorybookFullscreenCanvasProps {
  children: ReactNode;
  tone?: StorybookCanvasTone;
  className?: string;
}

export function StorybookFullscreenCanvas({
  children,
  tone = "primary",
  className,
}: StorybookFullscreenCanvasProps) {
  return <div className={cn("min-h-screen", toneClassNames[tone], className)}>{children}</div>;
}
