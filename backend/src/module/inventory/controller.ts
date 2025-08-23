import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class InventoryController {
  // Get all inventory
  static async getAllInventory(req: Request, res: Response) {
    try {
      const inventory = await prisma.inventory.findMany({
        include: {
          warehouse: true,
        },
      });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  }

  // Get inventory by ID
  static async getInventoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const inventory = await prisma.inventory.findUnique({
        where: { id },
        include: {
          warehouse: true,
        },
      });

      if (!inventory) {
        return res.status(404).json({ error: "Inventory item not found" });
      }

      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory item" });
    }
  }

  // Create new inventory item
  static async createInventory(req: Request, res: Response) {
    try {
      const { warehouseId, productName, sku, quantity, reorderPoint } =
        req.body;

      const inventory = await prisma.inventory.create({
        data: {
          warehouseId,
          productName,
          sku,
          quantity,
          reorderPoint,
        },
        include: {
          warehouse: true,
        },
      });

      res.status(201).json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  }

  // Update inventory item
  static async updateInventory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { productName, sku, quantity, reorderPoint } = req.body;

      const inventory = await prisma.inventory.update({
        where: { id },
        data: {
          productName,
          sku,
          quantity,
          reorderPoint,
        },
        include: {
          warehouse: true,
        },
      });

      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  }

  // Delete inventory item
  static async deleteInventory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.inventory.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  }

  // Get inventory by warehouse
  static async getInventoryByWarehouse(req: Request, res: Response) {
    try {
      const { warehouseId } = req.params;
      const inventory = await prisma.inventory.findMany({
        where: { warehouseId },
        include: {
          warehouse: true,
        },
      });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory by warehouse" });
    }
  }

  // Get low stock items
  static async getLowStockItems(req: Request, res: Response) {
    try {
      // Get all inventory items and filter on the application side
      const allInventory = await prisma.inventory.findMany({
        include: {
          warehouse: true,
        },
      });

      // Filter items where quantity is less than or equal to reorder point
      const lowStockItems = allInventory.filter(
        (item: any) => item.quantity <= item.reorderPoint
      );

      res.json(lowStockItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch low stock items" });
    }
  }

  // Search inventory by product name
  static async searchInventoryByProduct(req: Request, res: Response) {
    try {
      const { productName } = req.params;
      const inventory = await prisma.inventory.findMany({
        where: {
          productName: {
            contains: productName,
            mode: "insensitive",
          },
        },
        include: {
          warehouse: true,
        },
      });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to search inventory by product" });
    }
  }

  // Get inventory by SKU
  static async getInventoryBySKU(req: Request, res: Response) {
    try {
      const { sku } = req.params;
      const inventory = await prisma.inventory.findMany({
        where: { sku },
        include: {
          warehouse: true,
        },
      });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory by SKU" });
    }
  }

  // Update inventory quantity
  static async updateInventoryQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const inventory = await prisma.inventory.update({
        where: { id },
        data: { quantity },
        include: {
          warehouse: true,
        },
      });

      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory quantity" });
    }
  }
}
