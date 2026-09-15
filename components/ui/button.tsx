import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "light" | "dark" | "ghost" }>;

export function Button({ className, variant = "dark", children, ...props }: Props) {
  return <button className={cn("button", `button--${variant}`, className)} {...props}>{children}</button>;
}
