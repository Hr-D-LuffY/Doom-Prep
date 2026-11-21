import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "dangerOutline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-brass text-ink hover:bg-brass-light",
  ghost: "border border-edge text-ink hover:bg-line/50",
  danger: "bg-danger text-white hover:bg-danger/90",
  dangerOutline: "border border-danger/60 text-danger hover:bg-danger/10",
};

export const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`rounded-md px-4 py-2.5 text-base font-semibold motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${className}`}
    {...props}
  />
);
