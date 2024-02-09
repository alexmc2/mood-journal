/*
  Warnings:

  - The primary key for the `Documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Documents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "Documents_pkey" PRIMARY KEY ("id");
