/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "Documents" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);
