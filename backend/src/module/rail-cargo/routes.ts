import { Router } from "express";
import { RailCargoController } from "./controller";

const router = Router();

router.get("/", RailCargoController.getAllRailCargo);
router.get(
  "/operator/:railOperator",
  RailCargoController.getRailCargoByOperator
);
router.get("/status/:status", RailCargoController.getRailCargoByStatus);
router.get(
  "/route/:departureHubId/:arrivalHubId",
  RailCargoController.getRailCargoByRoute
);
router.get("/:id", RailCargoController.getRailCargoById);
router.post("/", RailCargoController.createRailCargo);
router.put("/:id", RailCargoController.updateRailCargo);
router.delete("/:id", RailCargoController.deleteRailCargo);

export default router;
