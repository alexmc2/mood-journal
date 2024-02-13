-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
