import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { PropsWithChildren, ReactNode } from "react";

type PropsWithChildrenAndClassName = PropsWithChildren<{
  className?: string;
}>;

function ChartCard({ className, children }: PropsWithChildrenAndClassName) {
  return (
    <Card className={cn("pt-0", className)}>{children}</Card>
  )
}

function ChartCardHeader({ className, children, showSeparator, title, description }:
  PropsWithChildrenAndClassName & {
    showSeparator?: boolean;
    title: string;
    description: string;
  }) {
  return (
    <CardHeader className={cn("flex flex-col items-stretch space-y-0 p-0 sm:flex-row [.border-b]:pb-0", { "border-b": showSeparator }, className)}>
      <div className={cn("flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-5")}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      {children}
    </CardHeader>
  )
}

function ChartCardContent({ className, children }: PropsWithChildrenAndClassName) {
  return (
    <CardContent className={cn("px-2 pt-4 sm:px-6 sm:pt-6", className)}>
      {children}
    </CardContent>
  )
}

function ChartCardHeaderContent({ className, children, title, description }: PropsWithChildrenAndClassName & { title: ReactNode, description: ReactNode }) {
  return (
    <div className={cn("flex flex-col justify-center border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-0", className)}>
      <span className="text-xs text-muted-foreground">
        {title}
      </span>
      <span className="text-lg font-bold leading-none sm:text-xl">
        {description}
      </span>
      {children}
    </div>
  )
}

export {
  ChartCard,
  ChartCardHeader,
  ChartCardHeaderContent,
  ChartCardContent,
}