/*
  Warnings:

  - You are about to drop the column `pinnedBookId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_pinnedBookId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "pinnedBookId";

-- CreateTable
CREATE TABLE "_GroupToGroupBook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToGroupBook_AB_unique" ON "_GroupToGroupBook"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToGroupBook_B_index" ON "_GroupToGroupBook"("B");

-- AddForeignKey
ALTER TABLE "_GroupToGroupBook" ADD CONSTRAINT "_GroupToGroupBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToGroupBook" ADD CONSTRAINT "_GroupToGroupBook_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
