import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-sprout-500 text-white hover:bg-sprout-600 active:bg-sprout-700 disabled:bg-sprout-200",
  secondary: "bg-sprout-50 text-sprout-700 hover:bg-sprout-100 active:bg-sprout-200",
  ghost: "bg-transparent text-ink hover:bg-black/5 active:bg-black/10",
  danger: "bg-transparent text-alert hover:bg-alert/10",
};

const sizeClasses: Record<Size, string> = {
  md: "min-h-11 px-4 text-[15px]",
  sm: "min-h-9 px-3 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
