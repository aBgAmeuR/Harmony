"use client";

export function CopyrightYear() {
    const currentYear = new Date().getFullYear();
    return <>{currentYear}</>;
}
