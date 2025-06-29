import type { NextRequest } from "next/server";

import { handlers } from "@repo/auth";

// @ts-ignore
export const GET: (req: NextRequest) => Promise<Response> = handlers.GET;
// @ts-ignore
export const POST: (req: NextRequest) => Promise<Response> = handlers.POST;
