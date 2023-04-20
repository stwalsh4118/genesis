-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "pinnedBookId" TEXT;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_pinnedBookId_fkey" FOREIGN KEY ("pinnedBookId") REFERENCES "GroupBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
