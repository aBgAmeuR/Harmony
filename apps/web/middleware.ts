// export { middleware } from "@repo/auth";

import { NextResponse } from "next/server";

export default function middleware() {
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|demo|images).*)"],
	// unstable_allowDynamic: ["**/node_modules/@prisma/client/runtime/library.js"],
};
