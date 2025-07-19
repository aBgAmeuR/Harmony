-- Migration UUID avec colonnes temporaires pour éviter les erreurs de cast

BEGIN;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TimeRangeStats') THEN
        ALTER TYPE "public"."TimeRangeStats" RENAME TO "time_range_stats";
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Package' AND column_name = 'spotify_id') THEN
        ALTER TABLE "Package" RENAME COLUMN "spotify_id" TO "spotifyId";
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Track_userId_fkey') THEN
        ALTER TABLE "Track" DROP CONSTRAINT "Track_userId_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Package_userId_fkey') THEN
        ALTER TABLE "Package" DROP CONSTRAINT "Package_userId_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Account_userId_fkey') THEN
        ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'HistoricalTrackRanking_userId_fkey') THEN
        ALTER TABLE "HistoricalTrackRanking" DROP CONSTRAINT "HistoricalTrackRanking_userId_fkey";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'HistoricalArtistRanking_userId_fkey') THEN
        ALTER TABLE "HistoricalArtistRanking" DROP CONSTRAINT "HistoricalArtistRanking_userId_fkey";
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'User_email_key') THEN
        DROP INDEX "User_email_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Account_provider_providerAccountId_key') THEN
        DROP INDEX "Account_provider_providerAccountId_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'HistoricalTrackRanking_userId_timestamp_idx') THEN
        DROP INDEX "HistoricalTrackRanking_userId_timestamp_idx";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'HistoricalTrackRanking_userId_trackId_timestamp_timeRange_key') THEN
        DROP INDEX "HistoricalTrackRanking_userId_trackId_timestamp_timeRange_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'HistoricalArtistRanking_userId_artistId_timestamp_timeRange_key') THEN
        DROP INDEX "HistoricalArtistRanking_userId_artistId_timestamp_timeRange_key";
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'HistoricalArtistRanking_userId_timestamp_idx') THEN
        DROP INDEX "HistoricalArtistRanking_userId_timestamp_idx";
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'temp_uuid_id') THEN
        ALTER TABLE "User" ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Track' AND column_name = 'temp_uuid_id') THEN
        ALTER TABLE "Track" ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Track' AND column_name = 'temp_userId') THEN
        ALTER TABLE "Track" ADD COLUMN temp_userId UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Package' AND column_name = 'temp_uuid_id') THEN
        ALTER TABLE "Package" ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Package' AND column_name = 'temp_userId') THEN
        ALTER TABLE "Package" ADD COLUMN temp_userId UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'temp_uuid_id') THEN
        ALTER TABLE "Account" ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'temp_userId') THEN
        ALTER TABLE "Account" ADD COLUMN temp_userId UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'HistoricalTrackRanking' AND column_name = 'temp_uuid_id') THEN
        ALTER TABLE "HistoricalTrackRanking" ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'HistoricalTrackRanking' AND column_name = 'temp_userId') THEN
        ALTER TABLE "HistoricalTrackRanking" ADD COLUMN temp_userId UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'HistoricalArtistRanking' AND column_name = 'temp_uuid_id') THEN
        ALTER TABLE "HistoricalArtistRanking" ADD COLUMN temp_uuid_id UUID DEFAULT gen_random_uuid();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'HistoricalArtistRanking' AND column_name = 'temp_userId') THEN
        ALTER TABLE "HistoricalArtistRanking" ADD COLUMN temp_userId UUID;
    END IF;
END
$$ LANGUAGE plpgsql;

UPDATE "User" 
SET temp_uuid_id = (
    CONCAT(
        SUBSTRING(MD5(CONCAT('legacy', id)), 1, 8), '-',
        SUBSTRING(MD5(CONCAT('legacy', id)), 9, 4), '-',
        SUBSTRING(MD5(CONCAT('legacy', id)), 13, 4), '-',
        SUBSTRING(MD5(CONCAT('legacy', id)), 17, 4), '-',
        SUBSTRING(MD5(CONCAT('legacy', id)), 21, 12)
    )
)::UUID;

UPDATE "Track" 
SET temp_userId = (
    SELECT temp_uuid_id FROM "User" 
    WHERE "User".id = "Track"."userId"
);

UPDATE "Package" 
SET temp_userId = (
    SELECT temp_uuid_id FROM "User" 
    WHERE "User".id = "Package"."userId"
);

UPDATE "Account" 
SET temp_userId = (
    SELECT temp_uuid_id FROM "User" 
    WHERE "User".id = "Account"."userId"
);

UPDATE "HistoricalTrackRanking" 
SET temp_userId = (
    SELECT temp_uuid_id FROM "User" 
    WHERE "User".id = "HistoricalTrackRanking"."userId"
);

UPDATE "HistoricalArtistRanking" 
SET temp_userId = (
    SELECT temp_uuid_id FROM "User" 
    WHERE "User".id = "HistoricalArtistRanking"."userId"
);

SELECT 'Track' as table_name, COUNT(*) as null_refs FROM "Track" WHERE temp_userId IS NULL AND "userId" IS NOT NULL
UNION ALL
SELECT 'Package' as table_name, COUNT(*) as null_refs FROM "Package" WHERE temp_userId IS NULL AND "userId" IS NOT NULL
UNION ALL
SELECT 'Account' as table_name, COUNT(*) as null_refs FROM "Account" WHERE temp_userId IS NULL AND "userId" IS NOT NULL
UNION ALL
SELECT 'HistoricalTrackRanking' as table_name, COUNT(*) as null_refs FROM "HistoricalTrackRanking" WHERE temp_userId IS NULL AND "userId" IS NOT NULL
UNION ALL
SELECT 'HistoricalArtistRanking' as table_name, COUNT(*) as null_refs FROM "HistoricalArtistRanking" WHERE temp_userId IS NULL AND "userId" IS NOT NULL;

-- User table
ALTER TABLE "User" DROP COLUMN id;
ALTER TABLE "User" RENAME COLUMN temp_uuid_id TO id;

-- Track table
ALTER TABLE "Track" DROP COLUMN id;
ALTER TABLE "Track" RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE "Track" DROP COLUMN "userId";
ALTER TABLE "Track" RENAME COLUMN temp_userId TO "userId";

-- Package table
ALTER TABLE "Package" DROP COLUMN id;
ALTER TABLE "Package" RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE "Package" DROP COLUMN "userId";
ALTER TABLE "Package" RENAME COLUMN temp_userId TO "userId";

-- Account table
ALTER TABLE "Account" DROP COLUMN id;
ALTER TABLE "Account" RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE "Account" DROP COLUMN "userId";
ALTER TABLE "Account" RENAME COLUMN temp_userId TO "userId";

-- HistoricalTrackRanking table
ALTER TABLE "HistoricalTrackRanking" DROP COLUMN id;
ALTER TABLE "HistoricalTrackRanking" RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE "HistoricalTrackRanking" DROP COLUMN "userId";
ALTER TABLE "HistoricalTrackRanking" RENAME COLUMN temp_userId TO "userId";

-- HistoricalArtistRanking table
ALTER TABLE "HistoricalArtistRanking" DROP COLUMN id;
ALTER TABLE "HistoricalArtistRanking" RENAME COLUMN temp_uuid_id TO id;
ALTER TABLE "HistoricalArtistRanking" DROP COLUMN "userId";
ALTER TABLE "HistoricalArtistRanking" RENAME COLUMN temp_userId TO "userId";

ALTER TABLE "Track" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Track" ALTER COLUMN "timestamp" SET DATA TYPE timestamp;
ALTER TABLE "Track" ALTER COLUMN "platform" SET DATA TYPE varchar(256);
ALTER TABLE "Track" ALTER COLUMN "artistIds" SET NOT NULL;
ALTER TABLE "Track" ALTER COLUMN "albumArtistIds" SET NOT NULL;
ALTER TABLE "Track" ALTER COLUMN "reasonStart" SET DATA TYPE varchar(256);
ALTER TABLE "Track" ALTER COLUMN "reasonEnd" SET DATA TYPE varchar(256);
ALTER TABLE "Track" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Package" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Package" ALTER COLUMN "tempFileLink" SET DATA TYPE varchar(256);
ALTER TABLE "Package" ALTER COLUMN "uploadStatus" SET DATA TYPE varchar(256);
ALTER TABLE "Package" ALTER COLUMN "uploadStatus" SET DEFAULT 'pending';
ALTER TABLE "Package" ALTER COLUMN "uploadStatus" DROP NOT NULL;
ALTER TABLE "Package" ALTER COLUMN "fileName" SET DATA TYPE varchar(256);
ALTER TABLE "Package" ALTER COLUMN "fileName" SET DEFAULT 'package.zip';
ALTER TABLE "Package" ALTER COLUMN "fileName" DROP NOT NULL;
ALTER TABLE "Package" ALTER COLUMN "fileSize" SET DATA TYPE varchar(256);
ALTER TABLE "Package" ALTER COLUMN "fileSize" SET DEFAULT '0';
ALTER TABLE "Package" ALTER COLUMN "fileSize" DROP NOT NULL;
ALTER TABLE "Package" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Package" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;
ALTER TABLE "Package" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "Package" ALTER COLUMN "createdAt" DROP NOT NULL;
ALTER TABLE "Package" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;
ALTER TABLE "Package" ALTER COLUMN "updatedAt" SET DEFAULT now();
ALTER TABLE "Package" ALTER COLUMN "updatedAt" DROP NOT NULL;

ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE varchar(256);
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE varchar(256);
ALTER TABLE "User" ALTER COLUMN "emailVerified" SET DATA TYPE timestamp;
ALTER TABLE "User" ALTER COLUMN "image" SET DATA TYPE varchar(256);
ALTER TABLE "User" ALTER COLUMN "hasPackage" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "timeRangeStats" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" SET DATA TYPE timestamp;
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" SET DEFAULT '2010-01-01 00:00:00.000';
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "timeRangeDateEnd" SET DATA TYPE timestamp;
ALTER TABLE "User" ALTER COLUMN "timeRangeDateEnd" SET DEFAULT now();
ALTER TABLE "User" ALTER COLUMN "timeRangeDateEnd" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();
ALTER TABLE "User" ALTER COLUMN "createdAt" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT now();
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;

ALTER TABLE "Account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Account" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "HistoricalTrackRanking" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "HistoricalTrackRanking" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "HistoricalTrackRanking" ALTER COLUMN "trackId" SET DATA TYPE varchar(256);
ALTER TABLE "HistoricalTrackRanking" ALTER COLUMN "timestamp" SET DATA TYPE timestamp;
ALTER TABLE "HistoricalTrackRanking" ALTER COLUMN "timestamp" SET DEFAULT now();
ALTER TABLE "HistoricalTrackRanking" ALTER COLUMN "timestamp" DROP NOT NULL;

ALTER TABLE "HistoricalArtistRanking" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "HistoricalArtistRanking" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "HistoricalArtistRanking" ALTER COLUMN "artistId" SET DATA TYPE varchar(256);
ALTER TABLE "HistoricalArtistRanking" ALTER COLUMN "timestamp" SET DATA TYPE timestamp;
ALTER TABLE "HistoricalArtistRanking" ALTER COLUMN "timestamp" SET DEFAULT now();
ALTER TABLE "HistoricalArtistRanking" ALTER COLUMN "timestamp" DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'User' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "User" ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'Track' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "Track" ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'Package' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "Package" ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'Account' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "Account" ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'HistoricalTrackRanking' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "HistoricalTrackRanking" ADD PRIMARY KEY (id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'HistoricalArtistRanking' AND constraint_type = 'PRIMARY KEY') THEN
        ALTER TABLE "HistoricalArtistRanking" ADD PRIMARY KEY (id);
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Track_userId_User_id_fk') THEN
        ALTER TABLE "Track" ADD CONSTRAINT "Track_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Package_userId_User_id_fk') THEN
        ALTER TABLE "Package" ADD CONSTRAINT "Package_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Account_userId_User_id_fk') THEN
        ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'HistoricalTrackRanking_userId_User_id_fk') THEN
        ALTER TABLE "HistoricalTrackRanking" ADD CONSTRAINT "HistoricalTrackRanking_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'HistoricalArtistRanking_userId_User_id_fk') THEN
        ALTER TABLE "HistoricalArtistRanking" ADD CONSTRAINT "HistoricalArtistRanking_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'createdAt') THEN
        ALTER TABLE "Account" DROP COLUMN "createdAt";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'updatedAt') THEN
        ALTER TABLE "Account" DROP COLUMN "updatedAt";
    END IF;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'User_email_unique') THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");
    END IF;
END
$$ LANGUAGE plpgsql;

COMMIT;