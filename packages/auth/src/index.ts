import { SessionProvider, useSession } from "next-auth/react";

import { handlers } from "./auth";
import type { User } from "./type";
import { getUser, signIn, signInDemo, signOut } from "./utils";

export {
	handlers,
	signIn,
	signOut,
	signInDemo,
	getUser,
	SessionProvider,
	useSession,
	type User,
};
