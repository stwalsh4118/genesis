-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupCollection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "GroupCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupBook" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "pages" INTEGER,
    "pagesRead" INTEGER DEFAULT 0,
    "isbn10" TEXT,
    "isbn13" TEXT,
    "coverUrl" TEXT,
    "rating" INTEGER,
    "review" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupBookToGroupCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupCollection_groupId_name_key" ON "GroupCollection"("groupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "GroupBook_title_author_key" ON "GroupBook"("title", "author");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToUser_AB_unique" ON "_GroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupBookToGroupCollection_AB_unique" ON "_GroupBookToGroupCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupBookToGroupCollection_B_index" ON "_GroupBookToGroupCollection"("B");

-- AddForeignKey
ALTER TABLE "GroupCollection" ADD CONSTRAINT "GroupCollection_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupBookToGroupCollection" ADD CONSTRAINT "_GroupBookToGroupCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupBookToGroupCollection" ADD CONSTRAINT "_GroupBookToGroupCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
