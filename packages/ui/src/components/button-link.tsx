import { ComponentProps } from "react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ButtonLinkProps = ComponentProps<typeof Button> & {
    href: string;
    rightArrow?: boolean;
}

export const ButtonLink = ({ children, href, rightArrow, ...props }: ButtonLinkProps) => {
    return (
        <Button className={cn("group", props.className)} asChild {...props}>
            <Link href={href}>
                {children}
                {rightArrow && (
                    <ArrowRight
                        className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                )}
            </Link>
        </Button>
    )
}