-- CreateTable
CREATE TABLE "Visitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referer" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Visitor_timestamp_idx" ON "Visitor"("timestamp");

-- CreateIndex
CREATE INDEX "Visitor_ip_idx" ON "Visitor"("ip");

-- CreateIndex
CREATE INDEX "Visitor_path_idx" ON "Visitor"("path");
