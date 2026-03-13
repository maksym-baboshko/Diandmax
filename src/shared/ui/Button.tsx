import { cn } from "@/shared/lib/cn";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonOwnProps<T extends React.ElementType = "button"> = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: T;
  children: React.ReactNode;
};

type ButtonProps<T extends React.ElementType> = ButtonOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends React.ElementType = "button">({
  variant = "primary",
  size = "md",
  as,
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Component = as || "button";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-accent text-white hover:bg-accent-soft hover:text-text-primary shadow-sm hover:shadow-md",
    secondary: "bg-bg-secondary text-text-primary hover:bg-accent-soft border border-accent/20",
    outline: "border border-accent text-accent hover:bg-accent hover:text-white",
    ghost: "text-text-secondary hover:text-accent hover:bg-accent-soft/20",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
