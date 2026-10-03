import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-[.12em]", { variants: { tone: { neutral: "border-[rgba(22,56,49,.16)] bg-[rgba(22,56,49,.05)] text-[var(--forest)]", new: "border-[#b8872e66] bg-[#b8872e1f] text-[#78520d]", contacted: "border-sky-200 bg-sky-50 text-sky-800", provisional: "border-violet-200 bg-violet-50 text-violet-800", confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800", cancelled: "border-red-200 bg-red-50 text-red-800", closed: "border-stone-200 bg-stone-100 text-stone-600" } }, defaultVariants: { tone: "neutral" } });
export function Badge({ className, tone, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) { return <span className={cn(badgeVariants({ tone }), className)} {...props} />; }
