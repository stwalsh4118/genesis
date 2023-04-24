-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY['N/A']::TEXT[];

-- AlterTable
ALTER TABLE "GroupBook" ADD COLUMN     "genres" TEXT[] DEFAULT ARRAY['N/A']::TEXT[];
