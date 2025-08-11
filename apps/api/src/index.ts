import { Hono } from "hono";
import { handle } from "hono/vercel";

import { createPackageStream } from "./package";

export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

app.post("/package", createPackageStream);

export const GET = handle(app);
export const POST = handle(app);
