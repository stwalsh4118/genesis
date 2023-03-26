-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "pagesRead" INTEGER DEFAULT 0,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "review" TEXT;
