/*
  Warnings:

  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Documents";

-- CreateTable
CREATE TABLE "documents" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
