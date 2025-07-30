"use client";

import { useRouter } from "next/navigation";

import { Button } from "@repo/ui/button";

export function SignOutBtn() {
    const router = useRouter();
    return (
        <form action={() => router.push("/signout")}>
            <Button className="w-full" size="sm" type="submit">
                Exit demo
            </Button>
        </form>
    );
}