import { ChevronRight } from "lucide-react";
import Link from "next/link";

type MusicItemCardActionProps = {
	href?: string;
};

export const MusicItemCardAction = ({ href }: MusicItemCardActionProps) => (
	<Link
		href={href || "#"}
		passHref={true}
		className="flex cursor-pointer items-center duration-100 hover:translate-x-0.5"
	>
		<ChevronRight />
	</Link>
);
