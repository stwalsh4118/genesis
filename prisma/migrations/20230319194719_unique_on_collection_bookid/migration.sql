/*
  Warnings:

  - A unique constraint covering the columns `[collectionId,id]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Book_collectionId_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Book_collectionId_id_key" ON "Book"("collectionId", "id");
