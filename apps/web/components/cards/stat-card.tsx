import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

type StatCardProps = {
	title: string;
	value: number | string | React.ReactNode;
	icon: React.ElementType;
	description: string | React.ReactNode;
};

export const StatCard = ({
	title,
	value,
	icon: Icon,
	description,
}: StatCardProps) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">{title}</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{value}</div>
				<p className="text-muted-foreground text-xs">{description}</p>
			</CardContent>
		</Card>
	);
};

type StatCardSkeletonProps = {
	title: string;
	icon: React.ElementType;
	description: string;
	value: string;
};

export const StatCardSkeleton = ({
	title,
	icon: Icon,
	description,
	value,
}: StatCardSkeletonProps) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">{title}</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="flex font-bold text-2xl">
					<Skeleton className="my-0.5 h-7">{value}</Skeleton>
				</div>
				<div className="flex text-muted-foreground text-xs">
					<Skeleton className="my-0.5 h-3">{description}</Skeleton>
				</div>
			</CardContent>
		</Card>
	);
};
