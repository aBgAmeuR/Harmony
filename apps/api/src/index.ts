import { Hono } from "hono";
import { handle } from "hono/vercel";

import { getUser } from "@repo/auth";
import { db } from "@repo/database";

import { createPackageStream } from "./package";

export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

app.get("/hello", async (c) => {
	const user = await getUser();

	return c.json({
		message: "Hello from Hono on Vercel!",
		user,
	});
});

app.get("/users", async (c) => {
	const users = await db.query.users.findMany();
	return c.json({
		users,
	});
});

app.post("/package", createPackageStream);

export const GET = handle(app);
export const POST = handle(app);
