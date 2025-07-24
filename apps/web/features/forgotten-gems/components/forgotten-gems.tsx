import { getUser } from "@repo/auth";

import { getForgottenGems } from "../data/forgotten-gems-service";
import { ForgottenGemsClient } from "./forgotten-gems-client";

export const ForgottenGems = async () => {
    const { userId } = await getUser();
    const forgottenGems = await getForgottenGems(userId);

    return <ForgottenGemsClient forgottenGems={forgottenGems} />;
};