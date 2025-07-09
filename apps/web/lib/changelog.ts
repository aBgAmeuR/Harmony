import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

export interface ChangelogEntry {
	version: string;
	date: string;
	type: "major" | "minor" | "patch";
	content: string;
	slug: string;
}

const CHANGELOG_DIR = join(process.cwd(), "contents/changelog");

export function getAllChangelogEntries(): ChangelogEntry[] {
	try {
		const files = readdirSync(CHANGELOG_DIR);
		const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

		const entries = mdxFiles.map((file) => {
			const filePath = join(CHANGELOG_DIR, file);
			const fileContent = readFileSync(filePath, "utf8");
			const { data, content } = matter(fileContent);

			const slug = file.replace(/\.mdx$/, "");

			return {
				version: data.version,
				date: data.date,
				type: data.type,
				content,
				slug,
			};
		});

		return entries.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);
	} catch (error) {
		console.error("Error reading changelog entries:", error);
		return [];
	}
}

export function getVersionBadgeVariant(type: ChangelogEntry["type"]) {
	switch (type) {
		case "major":
			return "destructive" as const;
		case "minor":
			return "default" as const;
		case "patch":
			return "secondary" as const;
		default:
			return "outline" as const;
	}
}
