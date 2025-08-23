import { Router } from "express";
import { PortHubController } from "./controller";

const router = Router();

router.get("/", PortHubController.getAllPortHubs);
router.get("/:id", PortHubController.getPortHubById);
router.post("/", PortHubController.createPortHub);
router.put("/:id", PortHubController.updatePortHub);
router.delete("/:id", PortHubController.deletePortHub);
router.get("/type/:type", PortHubController.getPortHubsByType);
router.get("/status/:status", PortHubController.getPortHubsByStatus);

export default router;
