import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const getEnvVariable = (name: string) => {
	const value = process.env[name];
	if (value == null) throw new Error(`environment variable ${name} not found`);
	return value;
};

export const pool = postgres(getEnvVariable("DATABASE_URL"), {
	max: 1,
	ssl: 'require'
});

export const db = drizzle(pool, { schema });
