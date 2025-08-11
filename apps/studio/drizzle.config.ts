import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "../../packages/database/src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		ssl: {
			rejectUnauthorized: true,
			ca: process.env.DATABASE_CA_CERT!,
		},
	},
});
