import * as React from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white/85",
            "placeholder:text-white/25",
            "transition-all duration-200",
            "focus:border-cyan-400/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-400/10",
            "hover:border-white/[0.15]",
            error && "border-red-400/40 focus:border-red-400/40 focus:ring-red-400/10",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[11px] text-red-400/80">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-xs font-medium text-white/50">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white/85",
            "placeholder:text-white/25",
            "transition-all duration-200 resize-none",
            "focus:border-cyan-400/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-400/10",
            "hover:border-white/[0.15]",
            error && "border-red-400/40 focus:border-red-400/40 focus:ring-red-400/10",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[11px] text-red-400/80">{error}</p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export { FormInput, FormTextarea };
