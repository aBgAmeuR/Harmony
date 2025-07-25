import { getUserOrNull } from "@repo/auth";
import { Badge } from "@repo/ui/badge";

export const DemoBadge = async () => {
	const user = await getUserOrNull();

	if (!user?.isDemo) return;

	return <Badge className="hidden min-[432px]:block">Demo</Badge>;
};
