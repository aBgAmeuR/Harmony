import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const getEnvVariable = (name: string) => {
	const value = process.env[name];
	if (value == null) throw new Error(`environment variable ${name} not found`);
	return value;
};

export default defineConfig({
	schema: "./src/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: getEnvVariable("DATABASE_URL"),
	},
	strict: true,
	verbose: true,
});
