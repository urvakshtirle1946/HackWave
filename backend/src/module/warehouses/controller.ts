import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class WarehouseController {
  // Get all warehouses
  static async getAllWarehouses(req: Request, res: Response) {
    try {
      const warehouses = await prisma.warehouse.findMany({
        include: {
          inventory: true,
        },
      });
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch warehouses" });
    }
  }

  // Get warehouse by ID
  static async getWarehouseById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Warehouse id is required" });
      }
      const warehouse = await prisma.warehouse.findUnique({
        where: { id },
        include: {
          inventory: true,
        },
      });

      if (!warehouse) {
        return res.status(404).json({ error: "Warehouse not found" });
      }

      res.json(warehouse);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch warehouse" });
    }
  }

  // Create new warehouse
  static async createWarehouse(req: Request, res: Response) {
    try {
      const { name, country, capacity, type, status } = req.body;

      const warehouse = await prisma.warehouse.create({
        data: {
          name,
          country,
          capacity,
          type,
          status,
        },
      });

      res.status(201).json(warehouse);
    } catch (error) {
      res.status(500).json({ error: "Failed to create warehouse" });
    }
  }

  // Update warehouse
  static async updateWarehouse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, country, capacity, type, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Warehouse id is required" });
      }

      const warehouse = await prisma.warehouse.update({
        where: { id },
        data: {
          name,
          country,
          capacity,
          type,
          status,
        },
      });

      res.json(warehouse);
    } catch (error) {
      res.status(500).json({ error: "Failed to update warehouse" });
    }
  }

  // Delete warehouse
  static async deleteWarehouse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Warehouse id is required" });
      }

      await prisma.warehouse.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete warehouse" });
    }
  }

  // Get warehouses by type
  static async getWarehousesByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!type) {
        return res.status(400).json({ error: "Warehouse type is required" });
      }
      const warehouses = await prisma.warehouse.findMany({
        where: { type },
        include: {
          inventory: true,
        },
      });
      res.json(warehouses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch warehouses by type" });
    }
  }

  // Get warehouse inventory
  static async getWarehouseInventory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Warehouse id is required" });
      }
      const inventory = await prisma.inventory.findMany({
        where: { warehouseId: id },
        include: {
          warehouse: true,
        },
      });
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch warehouse inventory" });
    }
  }
}
