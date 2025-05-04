import { prisma } from "@repo/database";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/table";
import { Suspense } from "react";
import { getUserInfos } from "~/lib/utils";

export const HistoryModal = async () => {
	return (
		<Dialog>
			<DialogTrigger asChild={true}>
				<Button variant="link" size="sm" className="mt-2">
					View History
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
				<div className="overflow-y-auto">
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="px-6 pt-6 text-base">
							History of your uploaded Spotify data packages
						</DialogTitle>
						<DialogDescription asChild={true}>
							<div className="p-6">
								<div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
									<Suspense fallback={null}>
										<HistoryTable />
									</Suspense>
								</div>
							</div>
						</DialogDescription>
					</DialogHeader>
				</div>
				<DialogFooter className="border-t px-4 py-2">
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

	return await prisma.package.findMany({
		where: { userId: userId },
		orderBy: { createdAt: "desc" },
	});
};

const HistoryTable = async () => {
	const packages = await getPackageHistory();

	if (!packages)
		return <p className="text-center">No packages uploaded yet.</p>;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Date</TableHead>
					<TableHead>Size</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{packages.map((item) => (
					<TableRow key={item.id}>
						<TableCell className="">
							<p className="line-clamp-1 break-all">{item.fileName}</p>
						</TableCell>
						<TableCell>{item.createdAt.toLocaleDateString()}</TableCell>
						<TableCell>
							<p className="text-nowrap">
								{(Number(item.fileSize) / 1024).toFixed(2)} MB
							</p>
						</TableCell>
					</TableRow>
				))}
				{packages.length === 0 && (
					<TableRow>
						<TableCell colSpan={3} className="text-center">
							No packages uploaded yet.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
