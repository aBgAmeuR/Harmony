"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { cookieStorage } from "@repo/zustand-cookie-storage";

interface ListLayoutStore {
	list_layout: "grid" | "list";
	setListLayout: (list_layout: "grid" | "list") => void;
}

export const useListLayout = create(
	persist<ListLayoutStore>(
		(set) => ({
			list_layout: "list",
			setListLayout: (list_layout) => set({ list_layout }),
		}),
		{
			name: "list-layout",
			storage: createJSONStorage(() => cookieStorage),
		},
	),
);

interface SideBarStore {
	isSidebarOpen: boolean;
	setSidebarOpen: (isSidebarOpen: boolean) => void;
}

export const useSidebar = create(
	persist<SideBarStore>(
		(set) => ({
			isSidebarOpen: false,
			setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
		}),
		{
			name: "sidebar",
			storage: createJSONStorage(() => cookieStorage),
		},
	),
);

interface UserPreferencesStore {
	showEmail: boolean;
	setShowEmail: (showEmail: boolean) => void;
}

export const useUserPreferences = create(
	persist<UserPreferencesStore>(
		(set) => ({
			showEmail: true,
			setShowEmail: (showEmail) => set({ showEmail }),
		}),
		{
			name: "user-preferences",
		},
	),
);
