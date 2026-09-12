import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({ variant = "primary", style, ...rest }: ButtonProps) {
  const base: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid transparent",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "#6d5efc", color: "white" },
    ghost: { background: "transparent", color: "#6d5efc", borderColor: "#6d5efc" },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} {...rest} />;
}
