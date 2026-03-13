import { cn } from "@/shared/lib/cn";
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-text-primary mb-2 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-accent ml-1">*</span>}
    </label>
  );
}
