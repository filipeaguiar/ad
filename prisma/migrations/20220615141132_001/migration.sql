-- CreateTable
CREATE TABLE "Manchete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT,
    "expiration" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
