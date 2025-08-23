import { Router } from "express";
import { RoadFleetController } from "./controller";

const router = Router();

router.get("/", RoadFleetController.getAllRoadFleet);
router.get("/:id", RoadFleetController.getRoadFleetById);
router.post("/", RoadFleetController.createRoadFleet);
router.put("/:id", RoadFleetController.updateRoadFleet);
router.delete("/:id", RoadFleetController.deleteRoadFleet);
router.get("/status/:status", RoadFleetController.getRoadFleetByStatus);
router.get("/type/:vehicleType", RoadFleetController.getRoadFleetByType);

export default router;
