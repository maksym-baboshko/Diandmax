import { cn } from "@/shared/lib/cn";
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-3 rounded-xl border bg-bg-primary transition-all duration-300 outline-none min-h-[120px] resize-y",
        "placeholder:text-text-secondary/50 text-text-primary",
        !error && "border-accent/20 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-white dark:focus:bg-bg-primary",
        error && "border-red-500 focus:ring-2 focus:ring-red-500/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
