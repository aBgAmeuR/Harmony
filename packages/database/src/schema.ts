import { relations, sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const timeRangeStatsEnum = pgEnum("time_range_stats", [
	"short_term",
	"medium_term",
	"long_term",
]);

export const users = pgTable("User", {
	id: varchar("id", { length: 256 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 256 }),
	email: varchar("email", { length: 256 }).unique(),
	emailVerified: timestamp("emailVerified"),
	image: varchar("image", { length: 256 }),
	hasPackage: boolean("hasPackage").default(false),
	timeRangeStats: timeRangeStatsEnum("timeRangeStats").default("medium_term"),
	timeRangeDateStart: timestamp("timeRangeDateStart").default(
		new Date("2010-01-01"),
	),
	timeRangeDateEnd: timestamp("timeRangeDateEnd").defaultNow(),
	createdAt: timestamp("createdAt").defaultNow(),
	updatedAt: timestamp("updatedAt").defaultNow(),
});

export const accounts = pgTable(
	"Account",
	{
		id: varchar("id", { length: 256 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar("userId", { length: 256 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: varchar("type", { length: 256 }).notNull(),
		provider: varchar("provider", { length: 256 }).notNull(),
		providerAccountId: varchar("providerAccountId", { length: 256 }).notNull(),
		refreshToken: text("refresh_token"),
		accessToken: text("access_token"),
		expiresAt: integer("expires_at"),
		tokenType: varchar("token_type", { length: 256 }),
		scope: varchar("scope", { length: 256 }),
		idToken: text("id_token"),
		sessionState: varchar("session_state", { length: 256 }),
		createdAt: timestamp("createdAt").defaultNow(),
		updatedAt: timestamp("updatedAt").defaultNow(),
	},
	(table) => ({
		providerAccountUnique: unique().on(table.provider, table.providerAccountId),
	}),
);

export const tracks = pgTable("Track", {
	id: varchar("id", { length: 256 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	timestamp: timestamp("timestamp").notNull(),
	platform: varchar("platform", { length: 256 }).notNull(),
	msPlayed: bigint("msPlayed", { mode: "bigint" }).notNull(),
	spotifyId: varchar("spotifyId", { length: 22 }).notNull(),
	artistIds: varchar("artistIds", { length: 22 }).array().notNull(),
	albumId: varchar("albumId", { length: 22 }).notNull(),
	albumArtistIds: varchar("albumArtistIds", { length: 22 }).array().notNull(),
	reasonStart: varchar("reasonStart", { length: 256 }).notNull(),
	reasonEnd: varchar("reasonEnd", { length: 256 }).notNull(),
	shuffle: boolean("shuffle"),
	skipped: boolean("skipped"),
	offline: boolean("offline"),
	userId: varchar("userId", { length: 256 })
		.notNull()
		.references(() => users.id),
});

export const packages = pgTable("Package", {
	id: uuid("id").primaryKey().defaultRandom(),
	spotifyId: varchar("spotify_id", { length: 256 }),
	tempFileLink: varchar("tempFileLink", { length: 256 }),
	uploadStatus: varchar("uploadStatus", { length: 256 }).default("pending"),
	fileName: varchar("fileName", { length: 256 }).default("package.zip"),
	fileSize: varchar("fileSize", { length: 256 }).default("0"),
	userId: varchar("userId", { length: 256 })
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("createdAt").defaultNow(),
	updatedAt: timestamp("updatedAt").defaultNow(),
});

export const historicalTrackRankings = pgTable(
	"HistoricalTrackRanking",
	{
		id: varchar("id", { length: 256 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar("userId", { length: 256 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		trackId: varchar("trackId", { length: 256 }).notNull(),
		rank: integer("rank").notNull(),
		timeRange: timeRangeStatsEnum("timeRange").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(table) => ({
		uniqueRanking: unique().on(
			table.userId,
			table.trackId,
			table.timestamp,
			table.timeRange,
		),
	}),
);

export const historicalArtistRankings = pgTable(
	"HistoricalArtistRanking",
	{
		id: varchar("id", { length: 256 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar("userId", { length: 256 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		artistId: varchar("artistId", { length: 256 }).notNull(),
		rank: integer("rank").notNull(),
		timeRange: timeRangeStatsEnum("timeRange").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(table) => ({
		uniqueRanking: unique().on(
			table.userId,
			table.artistId,
			table.timestamp,
			table.timeRange,
		),
	}),
);

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
