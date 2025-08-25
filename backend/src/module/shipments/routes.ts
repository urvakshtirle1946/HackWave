import { Router } from "express";
import { ShipmentController } from "./controller";

const router = Router();

router.get("/", ShipmentController.getAllShipments);
router.get("/:id", ShipmentController.getShipmentById);
router.post("/", ShipmentController.createShipment);
router.put("/:id", ShipmentController.updateShipment);
router.delete("/:id", ShipmentController.deleteShipment);
router.get("/status/:status", ShipmentController.getShipmentsByStatus);
router.get("/supplier/:supplierId", ShipmentController.getShipmentsBySupplier);
router.get("/customer/:customerId", ShipmentController.getShipmentsByCustomer);
router.get("/:id/routes", ShipmentController.getShipmentRoutes);
router.get("/:shipmentId/risk", ShipmentController.calculateShipmentRisk);

export default router;
