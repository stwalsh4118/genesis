/*
  Warnings:

  - You are about to drop the `_GroupToGroupBook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupToGroupBook" DROP CONSTRAINT "_GroupToGroupBook_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToGroupBook" DROP CONSTRAINT "_GroupToGroupBook_B_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "pinnedBookId" TEXT;

-- DropTable
DROP TABLE "_GroupToGroupBook";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_pinnedBookId_fkey" FOREIGN KEY ("pinnedBookId") REFERENCES "GroupBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
