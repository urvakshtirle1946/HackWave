import { Router } from "express";
import { ShipmentDisruptionController } from "./controller";

const router = Router();

router.get("/", ShipmentDisruptionController.getAllShipmentDisruptions);
router.get(
  "/high-impact",
  ShipmentDisruptionController.getHighImpactDisruptions
);
router.get(
  "/reroute-needed",
  ShipmentDisruptionController.getDisruptionsRequiringReroute
);
router.get("/:id", ShipmentDisruptionController.getShipmentDisruptionById);
router.post("/", ShipmentDisruptionController.createShipmentDisruption);
router.put("/:id", ShipmentDisruptionController.updateShipmentDisruption);
router.delete("/:id", ShipmentDisruptionController.deleteShipmentDisruption);
router.get(
  "/shipment/:shipmentId",
  ShipmentDisruptionController.getShipmentDisruptionsByShipment
);
router.get(
  "/disruption/:disruptionId",
  ShipmentDisruptionController.getShipmentDisruptionsByDisruption
);

export default router;
