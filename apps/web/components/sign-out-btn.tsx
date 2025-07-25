"use client";

import { signOutClient } from "@repo/auth/client";
import { Button } from "@repo/ui/button";

export function SignOutBtn() {
    return (
        <form action={async () => await signOutClient()}>
            <Button className="w-full" size="sm" type="submit">
                Exit demo
            </Button>
        </form>
    );
}