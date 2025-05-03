-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "tempFileLink" TEXT,
ADD COLUMN     "uploadStatus" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "spotify_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" SET DEFAULT now() - interval '10 years';
