"use client";

import { createContext, useContext, useState, PropsWithChildren } from "react";

export type HistoricalModalItem = {
    id: string;
    name: string;
    href?: string;
};

interface HistoricalModalContextValue {
    item: HistoricalModalItem | null;
    setItem: (item: HistoricalModalItem | null) => void;
}

const HistoricalModalContext = createContext<HistoricalModalContextValue | undefined>(undefined);

export const useHistoricalModalContext = () => {
    const ctx = useContext(HistoricalModalContext);
    if (!ctx) throw new Error("useHistoricalModalContext must be used within a HistoricalProvider");
    return ctx;
};

export const HistoricalProvider = ({ children }: PropsWithChildren) => {
    const [item, setItem] = useState<HistoricalModalItem | null>(null);

    return (
        <HistoricalModalContext.Provider value={{ item, setItem }}>
            {children}
        </HistoricalModalContext.Provider>
    );
};