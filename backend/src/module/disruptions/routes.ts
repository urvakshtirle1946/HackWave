import { Router } from "express";
import { DisruptionController } from "./controller";

const router = Router();

router.get("/", DisruptionController.getAllDisruptions);
router.get("/active", DisruptionController.getActiveDisruptions);
router.get("/:id", DisruptionController.getDisruptionById);
router.post("/", DisruptionController.createDisruption);
router.put("/:id", DisruptionController.updateDisruption);
router.delete("/:id", DisruptionController.deleteDisruption);
router.get("/type/:type", DisruptionController.getDisruptionsByType);
router.get(
  "/severity/:severity",
  DisruptionController.getDisruptionsBySeverity
);
router.get(
  "/location/:locationType/:locationId",
  DisruptionController.getDisruptionsByLocation
);

export default router;
