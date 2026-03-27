import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition";
  const variantClass =
    variant === "secondary"
      ? "border border-slate-300 bg-white text-slate-700"
      : variant === "ghost"
      ? "bg-transparent text-slate-700 hover:bg-slate-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClass =
    size === "sm" ? "h-8 px-2 text-xs" : size === "lg" ? "h-11 px-4 text-base" : "h-9";

  return (
    <button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
