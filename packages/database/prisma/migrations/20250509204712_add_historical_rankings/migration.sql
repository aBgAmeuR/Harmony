-- AlterTable
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" SET DEFAULT now() - interval '10 years';

-- CreateTable
CREATE TABLE "HistoricalTrackRanking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricalTrackRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalArtistRanking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricalArtistRanking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoricalTrackRanking_userId_timestamp_idx" ON "HistoricalTrackRanking"("userId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalTrackRanking_userId_trackId_timestamp_key" ON "HistoricalTrackRanking"("userId", "trackId", "timestamp");

-- CreateIndex
CREATE INDEX "HistoricalArtistRanking_userId_timestamp_idx" ON "HistoricalArtistRanking"("userId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalArtistRanking_userId_artistId_timestamp_key" ON "HistoricalArtistRanking"("userId", "artistId", "timestamp");

-- AddForeignKey
ALTER TABLE "HistoricalTrackRanking" ADD CONSTRAINT "HistoricalTrackRanking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalArtistRanking" ADD CONSTRAINT "HistoricalArtistRanking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
