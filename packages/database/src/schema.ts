import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const timeRangeStatsEnum = pgEnum("time_range_stats", [
	"short_term",
	"medium_term",
	"long_term",
]);

export const users = pgTable("User", {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 256 }),
	email: varchar({ length: 256 }).unique(),
	emailVerified: timestamp(),
	image: varchar({ length: 256 }),
	hasPackage: boolean().default(false),
	timeRangeStats: timeRangeStatsEnum().default("medium_term"),
	timeRangeDateStart: timestamp().default(new Date("2010-01-01")),
	timeRangeDateEnd: timestamp().defaultNow(),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp().defaultNow(),
});

export const accounts = pgTable(
	"Account",
	{
		id: uuid().primaryKey().defaultRandom(),
		userId: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text().notNull(),
		provider: text().notNull(),
		providerAccountId: text().notNull(),
		refresh_token: text(),
		access_token: text(),
		expires_at: integer(),
		token_type: text(),
		scope: text(),
		id_token: text(),
		session_state: text(),
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId],
			}),
		},
	],
);

export const tracks = pgTable("Track", {
	id: uuid().primaryKey().defaultRandom(),
	timestamp: timestamp().notNull(),
	platform: varchar({ length: 256 }).notNull(),
	msPlayed: bigint({ mode: "bigint" }).notNull(),
	spotifyId: varchar({ length: 22 }).notNull(),
	artistIds: varchar({ length: 22 }).array().notNull(),
	albumId: varchar({ length: 22 }).notNull(),
	albumArtistIds: varchar({ length: 22 }).array().notNull(),
	reasonStart: varchar({ length: 256 }).notNull(),
	reasonEnd: varchar({ length: 256 }).notNull(),
	shuffle: boolean(),
	skipped: boolean(),
	offline: boolean(),
	userId: uuid()
		.notNull()
		.references(() => users.id),
});

export const packages = pgTable("Package", {
	id: uuid().primaryKey().defaultRandom(),
	spotifyId: varchar({ length: 256 }),
	tempFileLink: varchar({ length: 256 }),
	uploadStatus: varchar({ length: 256 }).default("pending"),
	fileName: varchar({ length: 256 }).default("package.zip"),
	fileSize: varchar({ length: 256 }).default("0"),
	userId: uuid()
		.notNull()
		.references(() => users.id),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp().defaultNow(),
});

export const historicalTrackRankings = pgTable("HistoricalTrackRanking", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	trackId: varchar({ length: 256 }).notNull(),
	rank: integer().notNull(),
	timeRange: timeRangeStatsEnum().notNull(),
	timestamp: timestamp().defaultNow(),
});

export const historicalArtistRankings = pgTable("HistoricalArtistRanking", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	artistId: varchar({ length: 256 }).notNull(),
	rank: integer().notNull(),
	timeRange: timeRangeStatsEnum().notNull(),
	timestamp: timestamp().defaultNow(),
});

export const profileShareLinks = pgTable("ProfileShareLink", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	token: varchar({ length: 64 }).notNull().unique(),
	usageLimit: integer().notNull().default(1),
	usageCount: integer().notNull().default(0),
	expiresAt: timestamp(),
	revoked: boolean().notNull().default(false),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	packages: many(packages),
	tracks: many(tracks),
	historicalTrackRankings: many(historicalTrackRankings),
	historicalArtistRankings: many(historicalArtistRankings),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const tracksRelations = relations(tracks, ({ one }) => ({
	user: one(users, {
		fields: [tracks.userId],
		references: [users.id],
	}),
}));

export const packagesRelations = relations(packages, ({ one }) => ({
	user: one(users, {
		fields: [packages.userId],
		references: [users.id],
	}),
}));

export const historicalTrackRankingsRelations = relations(
	historicalTrackRankings,
	({ one }) => ({
		user: one(users, {
			fields: [historicalTrackRankings.userId],
			references: [users.id],
		}),
	}),
);

export const historicalArtistRankingsRelations = relations(
	historicalArtistRankings,
	({ one }) => ({
		user: one(users, {
			fields: [historicalArtistRankings.userId],
			references: [users.id],
		}),
	}),
);

export const profileShareLinksRelations = relations(
	profileShareLinks,
	({ one }) => ({
		user: one(users, {
			fields: [profileShareLinks.userId],
			references: [users.id],
		}),
	}),
);
