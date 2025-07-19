"use client";

import { signOut } from "@repo/auth/actions";
import { Button } from "@repo/ui/button";

export function SignOutBtn() {
    return (
        <form
            action={async () => {
                await signOut({
                    redirect: true,
                    redirectTo: "/",
                });
            }}
        >
            <Button className="w-full" size="sm" type="submit">
                Exit demo
            </Button>
        </form>
    );
}