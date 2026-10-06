import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] disabled:pointer-events-none disabled:opacity-45",
  { variants: { variant: { primary: "bg-[var(--forest)] text-[var(--ivory)] hover:bg-[var(--night)]", gold: "bg-[var(--gold)] text-[var(--night)] hover:bg-[#c89539]", subtle: "border border-[color:rgba(22,56,49,.18)] bg-transparent text-[var(--forest)] hover:bg-[rgba(22,56,49,.06)]", ghost: "text-[var(--forest)] hover:bg-[rgba(22,56,49,.08)]", danger: "border border-red-200 text-red-800 hover:bg-red-50" }, size: { default: "px-4", sm: "min-h-8 px-3 text-xs", icon: "min-h-10 w-10 p-0" } }, defaultVariants: { variant: "primary", size: "default" } },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
