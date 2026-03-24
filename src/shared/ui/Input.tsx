import { cn } from "@/shared/lib/cn";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-xl border bg-bg-primary transition-all duration-300 outline-none",
        "placeholder:text-text-secondary/90 text-text-primary",
        !error && "border-accent/28 focus:border-accent focus:ring-2 focus:ring-accent/16 focus:bg-white dark:focus:bg-bg-primary",
        error && "border-error focus:ring-2 focus:ring-error/10",
        "disabled:cursor-not-allowed disabled:border-accent/18 disabled:bg-bg-secondary/35 disabled:text-text-secondary/90",
        className
      )}
      {...props}
    />
  );
}
