"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 shadow-md hover:shadow-lg active:scale-[0.97] transform",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#4090EC] via-[#1C71E4] to-[#44D7D1] text-white hover:brightness-110",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-border bg-white hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 rounded-lg",
        lg: "h-14 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  children,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {icon && (
        <img
          src={icon}
          alt="icon"
          className="w-6 h-6 rounded-full object-cover"
        />
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
