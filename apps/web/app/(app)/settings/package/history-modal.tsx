import { Suspense } from "react";
import { History } from "lucide-react";

import { db, desc, eq, packages } from "@repo/database";
import { Button } from "@repo/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/table";

import { getUserInfos } from "~/lib/utils-server";

export const HistoryModal = async () => {
	return (
		<Dialog>
			<DialogTrigger asChild={true}>
				<Button variant="link" size="sm">
					<History className="size-4" />
					View History
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-0 overflow-hidden p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
				<DialogHeader className="sticky top-0 z-10 border-b bg-background">
					<DialogTitle className="p-4">
						History of your uploaded Spotify data packages
					</DialogTitle>
				</DialogHeader>
				<div className="overflow-y-auto px-4 py-2">
					<Suspense fallback={null}>
						<HistoryTable />
					</Suspense>
				</div>
				<DialogFooter className="sticky bottom-0 border-t bg-background p-2">
					<DialogClose asChild={true}>
						<Button type="button" size="sm">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const getPackageHistory = async () => {
	const { userId, isDemo } = await getUserInfos();
	if (!userId || isDemo) return null;

	return await db
		.select()
		.from(packages)
		.where(eq(packages.userId, userId))
		.orderBy(desc(packages.createdAt));
};

const HistoryTable = async () => {
	const packages = await getPackageHistory();

	if (!packages)
		return (
			<p className="text-center text-muted-foreground">
				No packages uploaded yet.
			</p>
		);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-full">Name</TableHead>
					<TableHead>Date</TableHead>
					<TableHead className="text-right">Size</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{packages.map((item) => (
					<TableRow key={item.id}>
						<TableCell>
							<p className="line-clamp-1 break-all font-medium">
								{item.fileName}
							</p>
						</TableCell>
						<TableCell className="text-muted-foreground">
							{item.createdAt
								? item.createdAt.toLocaleDateString()
								: <span className="text-xs italic">Unknown</span>}
						</TableCell>
						<TableCell className="text-right text-muted-foreground">
							{item.fileSize}
						</TableCell>
					</TableRow>
				))}
				{packages.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={3}
							className="text-center text-muted-foreground"
						>
							No packages uploaded yet.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
