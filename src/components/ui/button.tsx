import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-fg shadow-md hover:bg-accent/90 dark:shadow-[0_0_18px_color-mix(in_oklab,var(--color-accent)_40%,transparent)]",
        secondary: "bg-surface-2 text-fg border border-border hover:bg-surface-3",
        outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
        ghost: "text-fg hover:bg-surface-2",
        destructive: "bg-danger text-danger-fg hover:bg-danger/90",
        positive:
          "bg-positive text-positive-fg shadow-md hover:bg-positive/90",
      },
      size: {
        default: "h-10 min-h-10 px-4 py-2",
        sm: "h-9 min-h-9 rounded-md px-3 text-xs",
        lg: "h-11 min-h-11 rounded-xl px-6",
        icon: "h-10 w-10 min-h-10 min-w-10",
        "icon-sm": "h-9 w-9 min-h-9 min-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
