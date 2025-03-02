"use client";

import { ComponentPropsWithoutRef } from "react";
import { cn } from "@repo/ui/lib/utils";
import { LucideIcon } from "lucide-react";

interface NoDataMessageProps extends ComponentPropsWithoutRef<"div"> {
  icon: LucideIcon;
  title: string;
  message: string | React.ReactNode;
}

export function NoDataMessage({
  icon: Icon,
  title,
  message,
  className,
  ...props
}: NoDataMessageProps) {
  return (
    <div className={cn("text-center py-8", className)} {...props}>
      <Icon className="size-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
