/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,title,author]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_collectionId_fkey";

-- DropIndex
DROP INDEX "Book_collectionId_id_key";

-- DropIndex
DROP INDEX "Book_userId_title_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "collectionId";

-- CreateTable
CREATE TABLE "_BookToCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookToCollection_AB_unique" ON "_BookToCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToCollection_B_index" ON "_BookToCollection"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_title_author_key" ON "Book"("userId", "title", "author");

-- AddForeignKey
ALTER TABLE "_BookToCollection" ADD CONSTRAINT "_BookToCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToCollection" ADD CONSTRAINT "_BookToCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
