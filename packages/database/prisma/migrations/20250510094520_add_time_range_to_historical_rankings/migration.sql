/*
  Warnings:

  - A unique constraint covering the columns `[userId,artistId,timestamp,timeRange]` on the table `HistoricalArtistRanking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,trackId,timestamp,timeRange]` on the table `HistoricalTrackRanking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `timeRange` to the `HistoricalArtistRanking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeRange` to the `HistoricalTrackRanking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HistoricalArtistRanking_userId_artistId_timestamp_key";

-- DropIndex
DROP INDEX "HistoricalTrackRanking_userId_trackId_timestamp_key";

-- AlterTable
ALTER TABLE "HistoricalArtistRanking" ADD COLUMN     "timeRange" "TimeRangeStats" NOT NULL;

-- AlterTable
ALTER TABLE "HistoricalTrackRanking" ADD COLUMN     "timeRange" "TimeRangeStats" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" SET DEFAULT now() - interval '10 years';

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalArtistRanking_userId_artistId_timestamp_timeRange_key" ON "HistoricalArtistRanking"("userId", "artistId", "timestamp", "timeRange");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalTrackRanking_userId_trackId_timestamp_timeRange_key" ON "HistoricalTrackRanking"("userId", "trackId", "timestamp", "timeRange");
