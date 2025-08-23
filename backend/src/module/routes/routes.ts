import { Router } from "express";
import { RouteController } from "./controller";

const router = Router();

router.get("/", RouteController.getAllRoutes);
router.get("/:id", RouteController.getRouteById);
router.post("/", RouteController.createRoute);
router.put("/:id", RouteController.updateRoute);
router.delete("/:id", RouteController.deleteRoute);
router.get("/mode/:mode", RouteController.getRoutesByMode);
router.get("/carrier/:carrierName", RouteController.getRoutesByCarrier);

export default router;
