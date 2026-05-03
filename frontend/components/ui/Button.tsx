import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants = {
  primary:
    "bg-button-primary text-white shadow-glow hover:-translate-y-0.5 hover:bg-button-primary-hover hover:shadow-[0_24px_55px_-22px_rgba(37,99,235,0.45)]",
  secondary:
    "bg-soft text-primary hover:bg-blue-100 hover:text-primary-dark",
  ghost: "bg-white text-ink hover:bg-slate-100 hover:text-primary",
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
