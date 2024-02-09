/*
  Warnings:

  - You are about to drop the column `vector` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `vector` on the `ChatSession` table. All the data in the column will be lost.
  - You are about to drop the column `vector` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `vector` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "vector",
ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "ChatSession" DROP COLUMN "vector",
ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "vector",
ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "vector",
ADD COLUMN     "embedding" vector(1536);
