/*
  Warnings:

  - The primary key for the `Documents` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Documents_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Documents_id_seq";
