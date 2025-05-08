-- AlterTable
ALTER TABLE "User" ALTER COLUMN "timeRangeDateStart" SET DEFAULT now() - interval '10 years';
