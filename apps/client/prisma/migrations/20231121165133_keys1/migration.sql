-- AlterTable
ALTER TABLE "User" ALTER COLUMN "publicKey" DROP NOT NULL,
ALTER COLUMN "privateKey" DROP NOT NULL;