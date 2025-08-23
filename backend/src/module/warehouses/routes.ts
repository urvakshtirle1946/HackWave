import { Router } from "express";
import { WarehouseController } from "./controller";

const router = Router();

router.get("/", WarehouseController.getAllWarehouses);
router.get("/:id", WarehouseController.getWarehouseById);
router.post("/", WarehouseController.createWarehouse);
router.put("/:id", WarehouseController.updateWarehouse);
router.delete("/:id", WarehouseController.deleteWarehouse);
router.get("/type/:type", WarehouseController.getWarehousesByType);
router.get("/:id/inventory", WarehouseController.getWarehouseInventory);

export default router;
