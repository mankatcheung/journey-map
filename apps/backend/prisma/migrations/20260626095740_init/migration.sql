-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Journey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "journeyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Location_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "journeyId" TEXT NOT NULL,
    "fromLocationId" TEXT NOT NULL,
    "toLocationId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Route_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Route_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Route_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Journey_userId_idx" ON "Journey"("userId");

-- CreateIndex
CREATE INDEX "Journey_userId_createdAt_idx" ON "Journey"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Location_journeyId_idx" ON "Location"("journeyId");

-- CreateIndex
CREATE INDEX "Location_journeyId_order_idx" ON "Location"("journeyId", "order");

-- CreateIndex
CREATE INDEX "Route_journeyId_idx" ON "Route"("journeyId");

-- CreateIndex
CREATE UNIQUE INDEX "Route_fromLocationId_toLocationId_key" ON "Route"("fromLocationId", "toLocationId");
