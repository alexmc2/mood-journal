-- CreateTable
CREATE TABLE "Document" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
