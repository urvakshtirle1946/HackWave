import { Router } from "express";
import { InventoryController } from "./controller";

const router = Router();

router.get("/", InventoryController.getAllInventory);
router.get("/low-stock", InventoryController.getLowStockItems);
router.get("/:id", InventoryController.getInventoryById);
router.post("/", InventoryController.createInventory);
router.put("/:id", InventoryController.updateInventory);
router.delete("/:id", InventoryController.deleteInventory);
router.get(
  "/warehouse/:warehouseId",
  InventoryController.getInventoryByWarehouse
);
router.get(
  "/product/:productName",
  InventoryController.searchInventoryByProduct
);
router.get("/sku/:sku", InventoryController.getInventoryBySKU);
router.patch("/:id/quantity", InventoryController.updateInventoryQuantity);

export default router;
