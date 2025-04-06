import { handlers } from "@repo/auth";

import { NextRequest } from "next/server";

// @ts-ignore 
export const GET: (req: NextRequest) => Promise<Response> = handlers.GET;
// @ts-ignore
export const POST: (req: NextRequest) => Promise<Response> = handlers.POST;
