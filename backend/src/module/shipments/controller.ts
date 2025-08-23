import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class ShipmentController {
  // Get all shipments
  static async getAllShipments(req: Request, res: Response) {
    try {
      const shipments = await prisma.shipment.findMany({
        include: {
          supplier: true,
          customer: true,
          routes: true,
          disruptions: {
            include: {
              disruption: true,
            },
          },
        },
      });
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments" });
    }
  }

  // Get shipment by ID
  static async getShipmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shipment = await prisma.shipment.findUnique({
        where: { id },
        include: {
          supplier: true,
          customer: true,
          routes: true,
          disruptions: {
            include: {
              disruption: true,
            },
          },
        },
      });

      if (!shipment) {
        return res.status(404).json({ error: "Shipment not found" });
      }

      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipment" });
    }
  }

  // Create new shipment
  static async createShipment(req: Request, res: Response) {
    try {
      const {
        supplierId,
        customerId,
        originLocationType,
        originLocationId,
        destinationLocationType,
        destinationLocationId,
        mode,
        departureTime,
        ETA,
        status,
        riskScore,
      } = req.body;

      const shipment = await prisma.shipment.create({
        data: {
          supplierId,
          customerId,
          originLocationType,
          originLocationId,
          destinationLocationType,
          destinationLocationId,
          mode,
          departureTime: new Date(departureTime),
          ETA: new Date(ETA),
          status,
          riskScore,
        },
        include: {
          supplier: true,
          customer: true,
        },
      });

      res.status(201).json(shipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create shipment" });
    }
  }

  // Update shipment
  static async updateShipment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        originLocationType,
        originLocationId,
        destinationLocationType,
        destinationLocationId,
        mode,
        departureTime,
        ETA,
        status,
        riskScore,
      } = req.body;

      const shipment = await prisma.shipment.update({
        where: { id },
        data: {
          originLocationType,
          originLocationId,
          destinationLocationType,
          destinationLocationId,
          mode,
          departureTime: departureTime ? new Date(departureTime) : undefined,
          ETA: ETA ? new Date(ETA) : undefined,
          status,
          riskScore,
        },
        include: {
          supplier: true,
          customer: true,
        },
      });

      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update shipment" });
    }
  }

  // Delete shipment
  static async deleteShipment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.shipment.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shipment" });
    }
  }

  // Get shipments by status
  static async getShipmentsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const shipments = await prisma.shipment.findMany({
        where: { status },
        include: {
          supplier: true,
          customer: true,
        },
      });
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments by status" });
    }
  }

  // Get shipments by supplier
  static async getShipmentsBySupplier(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const shipments = await prisma.shipment.findMany({
        where: { supplierId },
        include: {
          supplier: true,
          customer: true,
          routes: true,
        },
      });
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments by supplier" });
    }
  }

  // Get shipments by customer
  static async getShipmentsByCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const shipments = await prisma.shipment.findMany({
        where: { customerId },
        include: {
          supplier: true,
          customer: true,
          routes: true,
        },
      });
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipments by customer" });
    }
  }

  // Get shipment routes
  static async getShipmentRoutes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const routes = await prisma.route.findMany({
        where: { shipmentId: id },
        orderBy: { sequenceNumber: "asc" },
      });
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipment routes" });
    }
  }
}
