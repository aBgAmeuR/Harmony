"use client";

/* eslint-disable no-unused-vars */
import { cookieStorage } from "@repo/zustand-cookie-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ListLayoutStore {
	list_layout: "grid" | "list";
	setListLayout: (list_layout: "grid" | "list") => void;
}

export const useListLayout = create<ListLayoutStore>((set) => ({
	list_layout: "list",
	setListLayout: (list_layout) => set({ list_layout }),
}));

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

interface ModalsStore {
	openModals: {
		[key: string]: {
			data: any;
		};
	};
	setOpenModals: (openModals: ModalsStore["openModals"]) => void;
	openModal: (modalId: string, data: unknown) => void;
	closeModal: (modalId: string) => void;
	closeAllModals: () => void;
	getModalOpen: (modalId: string) => { data: any } | undefined;
}

export const useModals = create<ModalsStore>((set, get) => ({
	openModals: {},
	setOpenModals: (openModals: ModalsStore["openModals"]) => set({ openModals }),
	openModal: (modalId: string, data: any) =>
		set((state) => ({
			openModals: {
				...state.openModals,
				[modalId]: { data },
			},
		})),
	closeModal: (modalId: string) =>
		set((state) => ({
			openModals: {
				...state.openModals,
				[modalId]: { data: undefined },
			},
		})),
	closeAllModals: () => set({ openModals: {} }),
	getModalOpen: (modalId: string) => {
		const modal = get().openModals[modalId];
		return modal ? modal.data : undefined;
	},
}));
