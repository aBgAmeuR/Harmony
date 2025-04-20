/* eslint-disable no-undef */
"use client";

import { signOut } from "@repo/auth";
import { Button } from "@repo/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@repo/ui/command";
import { DialogTitle } from "@repo/ui/dialog";
import { useSidebar } from "@repo/ui/sidebar";
import {
	Eye,
	EyeOff,
	Github,
	Home,
	LogOut,
	Moon,
	PanelLeft,
	Search,
	SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useUserPreferences } from "~/lib/store";

import { Icons } from "./icons";
import {
	type SidebarItem,
	data as sidebarConfig,
} from "./navbar/sidebar-config";

type CommandMenuProps = {
	hasPackage?: boolean;
	isDemo?: boolean;
};

export function CommandMenu({
	hasPackage = false,
	isDemo = false,
}: CommandMenuProps) {
	const [open, setOpen] = React.useState(false);
	const { theme, setTheme } = useTheme();
	const { toggleSidebar } = useSidebar();
	const { showEmail, setShowEmail } = useUserPreferences();
	const router = useRouter();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return;
				}

				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<div className="@container">
				<button
					className="inline-flex @[150px]:h-9 h-8 w-full rounded-md border border-input bg-background @[150px]:px-3 @[150px]:py-2 text-foreground text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/70 hover:bg-background/80 focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/50"
					onClick={() => setOpen(true)}
				>
					<span className="flex grow items-center @[150px]:justify-start justify-center">
						<Search
							className="@[150px]:me-2 text-muted-foreground/80"
							size={16}
							aria-hidden="true"
						/>
						<span className="@[150px]:block hidden font-normal text-muted-foreground/70">
							Search
						</span>
					</span>
					<kbd className="-me-1 ms-12 @[150px]:inline-flex hidden h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
						⌘K
					</kbd>
				</button>
			</div>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="sr-only">Search Menu</DialogTitle>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList className="pb-10">
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroupSidebar
						heading="Stats"
						items={sidebarConfig.stats}
						runCommand={runCommand}
					/>
					{hasPackage && (
						<CommandGroupSidebar
							heading="Package"
							items={sidebarConfig.package}
							runCommand={runCommand}
						/>
					)}
					<CommandGroupSidebar
						heading="Package"
						items={sidebarConfig.package}
						runCommand={runCommand}
					/>
					<CommandGroupSidebar
						heading="Settings"
						items={sidebarConfig.settings}
						runCommand={runCommand}
					/>
					<CommandSeparator />
					<CommandGroup heading="Quicks Actions">
						<CommandItem
							className="!py-2"
							onSelect={() => runCommand(() => router.push("/"))}
						>
							<Home />
							Go Home
						</CommandItem>
						{!isDemo && (
							<CommandItem
								className="!py-2"
								onSelect={() => runCommand(() => setShowEmail(!showEmail))}
							>
								{showEmail ? <Eye /> : <EyeOff />}
								Show email
							</CommandItem>
						)}
						<CommandItem
							className="!py-2"
							onSelect={() =>
								runCommand(() =>
									signOut({
										redirectTo: "/",
									}),
								)
							}
						>
							<LogOut />
							{isDemo ? "Exit Demo" : "Log out"}
						</CommandItem>
						<CommandItem
							className="!py-2"
							onSelect={() => runCommand(() => toggleSidebar())}
						>
							<PanelLeft />
							Toggle Sidebar
						</CommandItem>
						<CommandItem
							className="!py-2"
							onSelect={() =>
								runCommand(() => setTheme(theme === "light" ? "dark" : "light"))
							}
						>
							{theme === "dark" ? <Moon size={18} /> : <SunMedium size={18} />}
							Toggle Theme
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Social">
						<CommandItem
							className="!py-2"
							onSelect={() =>
								runCommand(() =>
									window.open("https://github.com/aBgAmeuR/Harmony", "_blank"),
								)
							}
						>
							<Github className="!size-4" />
							Github
						</CommandItem>
					</CommandGroup>
				</CommandList>
				<div className="absolute bottom-[-0.1px] flex h-10 w-full items-center justify-between rounded-b-lg border-border border-t bg-popover p-2">
					<div className="flex items-center justify-center gap-1">
						<Icons.logo className="size-5" />
						<p className="text-muted-foreground text-sm">Harmony</p>
					</div>
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							className="w-fit cursor-default text-muted-foreground hover:bg-background hover:text-muted-foreground"
						>
							Enter
							<kbd className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
								↵
							</kbd>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="w-fit text-muted-foreground"
							onClick={() => setOpen(false)}
						>
							Close
							<kbd className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
								ESC
							</kbd>
						</Button>
					</div>
				</div>
			</CommandDialog>
		</>
	);
}

type CommandGroupSidebarProps = {
	heading?: React.ReactNode;
	items: SidebarItem[];
	runCommand: (command: () => unknown) => void;
};

const CommandGroupSidebar = ({
	heading,
	items,
	runCommand,
}: CommandGroupSidebarProps) => {
	const router = useRouter();

	return (
		<CommandGroup heading={heading}>
			{items.map((navItem) =>
				navItem.items ? (
					navItem.items.map((subItem) => (
						<CommandItem
							key={subItem.url}
							value={`${subItem.title} in ${navItem.title}`}
							onSelect={() => {
								runCommand(() => router.push(subItem.url));
							}}
							className="!py-2"
						>
							<subItem.icon className="!size-4" />
							{subItem.title}
							<p className="font-medium text-muted-foreground text-xs">
								in {navItem.title}
							</p>
						</CommandItem>
					))
				) : (
					<CommandItem
						key={navItem.url}
						value={navItem.title}
						onSelect={() => {
							runCommand(() => router.push(navItem.url));
						}}
						className="!py-2"
					>
						<navItem.icon className="!size-4" />
						{navItem.title}
					</CommandItem>
				),
			)}
		</CommandGroup>
	);
};
