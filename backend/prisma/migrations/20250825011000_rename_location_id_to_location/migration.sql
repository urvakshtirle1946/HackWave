/*
  Warnings:

  - You are about to drop the column `locationId` on the `Disruption` table. All the data in the column will be lost.
  - You are about to drop the column `fromLocationId` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `toLocationId` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `destinationLocationId` on the `Shipment` table. All the data in the column will be lost.
  - You are about to drop the column `originLocationId` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `fromLocation` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLocation` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationLocation` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originLocation` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Disruption" DROP COLUMN "locationId",
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "public"."Route" DROP COLUMN "fromLocationId",
DROP COLUMN "toLocationId",
ADD COLUMN     "fromLocation" TEXT NOT NULL,
ADD COLUMN     "toLocation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Shipment" DROP COLUMN "destinationLocationId",
DROP COLUMN "originLocationId",
ADD COLUMN     "destinationLocation" TEXT NOT NULL,
ADD COLUMN     "originLocation" TEXT NOT NULL;
