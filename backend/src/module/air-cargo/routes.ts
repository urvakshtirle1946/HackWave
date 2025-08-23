import { Router } from "express";
import { AirCargoController } from "./controller";

const router = Router();

router.get("/", AirCargoController.getAllAirCargo);
router.get("/airline/:airline", AirCargoController.getAirCargoByAirline);
router.get("/status/:status", AirCargoController.getAirCargoByStatus);
router.get(
  "/route/:departureAirportId/:arrivalAirportId",
  AirCargoController.getAirCargoByRoute
);
router.get("/:id", AirCargoController.getAirCargoById);
router.post("/", AirCargoController.createAirCargo);
router.put("/:id", AirCargoController.updateAirCargo);
router.delete("/:id", AirCargoController.deleteAirCargo);

export default router;
