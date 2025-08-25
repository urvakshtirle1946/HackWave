import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class SupplierController {
  // Get all suppliers
  static async getAllSuppliers(req: Request, res: Response) {
    console.log("getAllSuppliers called:"); 
    try {
      const suppliers = await prisma.supplier.findMany({
        include: {
          shipments: true,
        },
      });
      res.json(suppliers);
    } catch (error) {
      console.error("Error in getAllSuppliers:", error);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  }

  // Get supplier by ID
  static async getSupplierById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Supplier ID is required" });
      }

      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          shipments: true,
        },
      });

      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  }

  // Create new supplier
  static async createSupplier(req: Request, res: Response) {
    try {
      const { name, country, industry, reliabilityScore } = req.body;

      const supplier = await prisma.supplier.create({
        data: {
          name,
          country,
          industry,
          reliabilityScore,
        },
      });

      res.status(201).json(supplier);
    } catch (error) {
      res.status(500).json({ error: "Failed to create supplier" });
    }
  }

  // Update supplier
  static async updateSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, country, industry, reliabilityScore } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Supplier ID is required" });
      }

      const supplier = await prisma.supplier.update({
        where: { id },
        data: {
          name,
          country,
          industry,
          reliabilityScore,
        },
      });

      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: "Failed to update supplier" });
    }
  }

  // Delete supplier
  static async deleteSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Supplier ID is required" });
      }

      await prisma.supplier.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete supplier" });
    }
  }
}
