"use client";

import { useState } from "react";
import {
	AlignJustify,
	ChevronsUpDown,
	Eye,
	EyeOff,
	Grid2x2,
	LogOut,
	Moon,
	SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";

import type { User } from "@repo/auth";
import { signOut } from "@repo/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@repo/ui/sidebar";

import { useMounted } from "~/hooks/use-mounted";
import { useListLayout, useUserPreferences } from "~/lib/store";

// import { deleteUserAction } from "@/actions/user/delete-user-action";

type NavUserProps = {
	user: User;
};

export function NavUser({ user }: NavUserProps) {
	const { setTheme, theme } = useTheme();
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const { showEmail, setShowEmail } = useUserPreferences();
	const { list_layout, setListLayout } = useListLayout();
	const isDemo = user.name === "Demo";
	const isMounted = useMounted();
	const { isMobile } = useSidebar();

	const handleDeleteAccount = async () => {
		if (deleteConfirmation === user.name) {
			// await deleteUserAction();
			await signOut({
				redirectTo: "/",
			});
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild={true}>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="size-8 rounded-lg">
									<AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
									<AvatarFallback className="rounded-lg">
										{(user.name || user.id)?.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									{isMounted && showEmail && user.email ? (
										<span className="truncate text-muted-foreground text-xs">
											{user.email}
										</span>
									) : null}
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className={cn(
								"mx-2 rounded-lg shadow-none",
								isMobile ? "w-[271px]" : "w-[239px]",
							)}
							side="bottom"
							align="center"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="size-8 rounded-lg">
										<AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
										<AvatarFallback className="rounded-lg">
											{(user.name || user.id)?.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										{isMounted && user.email && showEmail ? (
											<span className="truncate text-muted-foreground text-xs">
												{user.email}
											</span>
										) : null}
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild={true}>
								<Button
									className="flex w-full cursor-pointer items-center justify-start"
									variant="ghost"
									size="sm"
									onClick={() =>
										signOut({
											redirectTo: "/",
										})
									}
								>
									<LogOut />
									Log out
								</Button>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								Preferences
							</DropdownMenuLabel>
							{!isDemo ? (
								<DropdownMenuItem asChild={true}>
									<Button
										onClick={(e) => {
											e.preventDefault();
											setShowEmail(!showEmail);
										}}
										className="flex w-full cursor-pointer items-center justify-between"
										variant="ghost"
										size="sm"
									>
										Show email
										{showEmail ? <Eye size={18} /> : <EyeOff size={18} />}
									</Button>
								</DropdownMenuItem>
							) : null}
							<DropdownMenuItem asChild={true}>
								<Button
									onClick={(e) => {
										e.preventDefault();
										setListLayout(list_layout === "grid" ? "list" : "grid");
									}}
									className="flex w-full cursor-pointer items-center justify-between"
									variant="ghost"
									size="sm"
								>
									List layout
									{list_layout === "grid" ? <Grid2x2 size={18} /> : <AlignJustify size={18} />}
								</Button>
							</DropdownMenuItem>
							<DropdownMenuItem asChild={true}>
								<Button
									onClick={(e) => {
										e.preventDefault();
										setTheme(theme === "light" ? "dark" : "light");
									}}
									className="flex w-full cursor-pointer items-center justify-between"
									variant="ghost"
									size="sm"
								>
									Theme
									{theme === "dark" ? (
										<Moon size={18} />
									) : (
										<SunMedium size={18} />
									)}
								</Button>
							</DropdownMenuItem>
							{!isDemo ? (
								<>
									<DropdownMenuSeparator />
									<DialogTrigger asChild={true}>
										<DropdownMenuItem asChild={true}>
											<Button
												className="w-full cursor-pointer focus:bg-destructive/90 focus-visible:ring-transparent"
												variant="destructive"
												size="sm"
											>
												Delete account
											</Button>
										</DropdownMenuItem>
									</DialogTrigger>
								</>
							) : null}
						</DropdownMenuContent>
					</DropdownMenu>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Account</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<p className="text-muted-foreground text-sm">
								To confirm, please type your nickname:{" "}
								<span className="font-semibold">{user.name}</span>
							</p>
							<Input
								value={deleteConfirmation}
								onChange={(e) => setDeleteConfirmation(e.target.value)}
								placeholder="Enter your nickname"
								className="mt-2"
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild={true}>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button
								variant="destructive"
								onClick={handleDeleteAccount}
								disabled={deleteConfirmation !== user.name}
							>
								Delete Account
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
