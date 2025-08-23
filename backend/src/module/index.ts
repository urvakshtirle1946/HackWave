import { Router } from "express";

// Import all route modules
import supplierRoutes from "./suppliers/routes";
import customerRoutes from "./customers/routes";
import portHubRoutes from "./port-hubs/routes";
import warehouseRoutes from "./warehouses/routes";
import shipmentRoutes from "./shipments/routes";
import routeRoutes from "./routes/routes";
import roadFleetRoutes from "./road-fleet/routes";
import airCargoRoutes from "./air-cargo/routes";
import railCargoRoutes from "./rail-cargo/routes";
import disruptionRoutes from "./disruptions/routes";
import inventoryRoutes from "./inventory/routes";
import shipmentDisruptionRoutes from "./shipment-disruptions/routes";
import mcpRoutes from "../routes/mcpRoutes";

const router = Router();

// API Routes
router.use("/suppliers", supplierRoutes);
router.use("/customers", customerRoutes);
router.use("/port-hubs", portHubRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/routes", routeRoutes);
router.use("/road-fleet", roadFleetRoutes);
router.use("/air-cargo", airCargoRoutes);
router.use("/rail-cargo", railCargoRoutes);
router.use("/disruptions", disruptionRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/shipment-disruptions", shipmentDisruptionRoutes);
router.use("/mcp", mcpRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Supply Chain Management API is running",
  });
});

// API Documentation endpoint
router.get("/endpoints", (req, res) => {
  res.json({
    message: "Supply Chain Management API Endpoints",
    baseUrl: "/api",
    endpoints: {
      suppliers: {
        base: "/suppliers",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: ["GET /", "GET /:id", "POST /", "PUT /:id", "DELETE /:id"],
      },
      customers: {
        base: "/customers",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: ["GET /", "GET /:id", "POST /", "PUT /:id", "DELETE /:id"],
      },
      portHubs: {
        base: "/port-hubs",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /type/:type",
          "GET /status/:status",
        ],
      },
      warehouses: {
        base: "/warehouses",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /type/:type",
          "GET /:id/inventory",
        ],
      },
      shipments: {
        base: "/shipments",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /status/:status",
          "GET /supplier/:supplierId",
          "GET /customer/:customerId",
          "GET /:id/routes",
        ],
      },
      routes: {
        base: "/routes",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /mode/:mode",
          "GET /carrier/:carrierName",
        ],
      },
      roadFleet: {
        base: "/road-fleet",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /status/:status",
          "GET /type/:vehicleType",
        ],
      },
      airCargo: {
        base: "/air-cargo",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /airline/:airline",
          "GET /status/:status",
          "GET /route/:departureAirportId/:arrivalAirportId",
        ],
      },
      railCargo: {
        base: "/rail-cargo",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /operator/:railOperator",
          "GET /status/:status",
          "GET /route/:departureHubId/:arrivalHubId",
        ],
      },
      disruptions: {
        base: "/disruptions",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /active",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /type/:type",
          "GET /severity/:severity",
          "GET /location/:locationType/:locationId",
        ],
      },
      inventory: {
        base: "/inventory",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        endpoints: [
          "GET /",
          "GET /low-stock",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /warehouse/:warehouseId",
          "GET /product/:productName",
          "GET /sku/:sku",
          "PATCH /:id/quantity",
        ],
      },
      shipmentDisruptions: {
        base: "/shipment-disruptions",
        methods: ["GET", "POST", "PUT", "DELETE"],
        endpoints: [
          "GET /",
          "GET /high-impact",
          "GET /reroute-needed",
          "GET /:id",
          "POST /",
          "PUT /:id",
          "DELETE /:id",
          "GET /shipment/:shipmentId",
          "GET /disruption/:disruptionId",
        ],
      },
    },
  });
});

export default router;
