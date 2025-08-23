-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "reliabilityScore" INTEGER NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "demandForecast" INTEGER NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PortHub" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "PortHub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shipment" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "originLocationType" TEXT NOT NULL,
    "originLocationId" TEXT NOT NULL,
    "destinationLocationType" TEXT NOT NULL,
    "destinationLocationId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "ETA" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Route" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "fromLocationType" TEXT NOT NULL,
    "fromLocationId" TEXT NOT NULL,
    "toLocationType" TEXT NOT NULL,
    "toLocationId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "carrierName" TEXT NOT NULL,
    "travelTimeEst" INTEGER NOT NULL,
    "costEst" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoadFleet" (
    "id" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "driverName" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "RoadFleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AirCargo" (
    "id" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "flightNo" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "departureAirportId" TEXT NOT NULL,
    "arrivalAirportId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "AirCargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RailCargo" (
    "id" TEXT NOT NULL,
    "trainNo" TEXT NOT NULL,
    "railOperator" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "departureHubId" TEXT NOT NULL,
    "arrivalHubId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "RailCargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Disruption" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "Disruption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShipmentDisruption" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "disruptionId" TEXT NOT NULL,
    "impactDelayHours" INTEGER NOT NULL,
    "rerouteNeeded" BOOLEAN NOT NULL,
    "extraCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShipmentDisruption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inventory" (
    "id" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reorderPoint" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Shipment" ADD CONSTRAINT "Shipment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Route" ADD CONSTRAINT "Route_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "public"."Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentDisruption" ADD CONSTRAINT "ShipmentDisruption_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "public"."Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShipmentDisruption" ADD CONSTRAINT "ShipmentDisruption_disruptionId_fkey" FOREIGN KEY ("disruptionId") REFERENCES "public"."Disruption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventory" ADD CONSTRAINT "Inventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
