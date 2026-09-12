import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ style, ...rest }: InputProps) {
  return (
    <input
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid #d0d0d8",
        fontSize: 14,
        width: "100%",
        ...style,
      }}
      {...rest}
    />
  );
}
