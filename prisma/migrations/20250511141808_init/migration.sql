-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "expirationTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
