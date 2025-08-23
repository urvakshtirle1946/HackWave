import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class ShipmentDisruptionController {
  // Get all shipment disruptions
  static async getAllShipmentDisruptions(req: Request, res: Response) {
    try {
      const shipmentDisruptions = await prisma.shipmentDisruption.findMany({
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
          disruption: true,
        },
      });
      res.json(shipmentDisruptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipment disruptions" });
    }
  }

  // Get shipment disruption by ID
  static async getShipmentDisruptionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shipmentDisruption = await prisma.shipmentDisruption.findUnique({
        where: { id },
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
          disruption: true,
        },
      });

      if (!shipmentDisruption) {
        return res.status(404).json({ error: "Shipment disruption not found" });
      }

      res.json(shipmentDisruption);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipment disruption" });
    }
  }

  // Create new shipment disruption
  static async createShipmentDisruption(req: Request, res: Response) {
    try {
      const {
        shipmentId,
        disruptionId,
        impactDelayHours,
        rerouteNeeded,
        extraCost,
      } = req.body;

      const shipmentDisruption = await prisma.shipmentDisruption.create({
        data: {
          shipmentId,
          disruptionId,
          impactDelayHours,
          rerouteNeeded,
          extraCost,
        },
        include: {
          shipment: true,
          disruption: true,
        },
      });

      res.status(201).json(shipmentDisruption);
    } catch (error) {
      res.status(500).json({ error: "Failed to create shipment disruption" });
    }
  }

  // Update shipment disruption
  static async updateShipmentDisruption(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { impactDelayHours, rerouteNeeded, extraCost } = req.body;

      const shipmentDisruption = await prisma.shipmentDisruption.update({
        where: { id },
        data: {
          impactDelayHours,
          rerouteNeeded,
          extraCost,
        },
        include: {
          shipment: true,
          disruption: true,
        },
      });

      res.json(shipmentDisruption);
    } catch (error) {
      res.status(500).json({ error: "Failed to update shipment disruption" });
    }
  }

  // Delete shipment disruption
  static async deleteShipmentDisruption(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.shipmentDisruption.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shipment disruption" });
    }
  }

  // Get shipment disruptions by shipment
  static async getShipmentDisruptionsByShipment(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params;
      const shipmentDisruptions = await prisma.shipmentDisruption.findMany({
        where: { shipmentId },
        include: {
          shipment: true,
          disruption: true,
        },
      });
      res.json(shipmentDisruptions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch shipment disruptions by shipment" });
    }
  }

  // Get shipment disruptions by disruption
  static async getShipmentDisruptionsByDisruption(req: Request, res: Response) {
    try {
      const { disruptionId } = req.params;
      const shipmentDisruptions = await prisma.shipmentDisruption.findMany({
        where: { disruptionId },
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
          disruption: true,
        },
      });
      res.json(shipmentDisruptions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch shipment disruptions by disruption" });
    }
  }

  // Get high impact disruptions (above certain delay threshold)
  static async getHighImpactDisruptions(req: Request, res: Response) {
    try {
      const { threshold = 24 } = req.query; // Default 24 hours
      const shipmentDisruptions = await prisma.shipmentDisruption.findMany({
        where: {
          impactDelayHours: {
            gte: Number(threshold),
          },
        },
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
          disruption: true,
        },
      });
      res.json(shipmentDisruptions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch high impact disruptions" });
    }
  }

  // Get disruptions requiring reroute
  static async getDisruptionsRequiringReroute(req: Request, res: Response) {
    try {
      const shipmentDisruptions = await prisma.shipmentDisruption.findMany({
        where: { rerouteNeeded: true },
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
          disruption: true,
        },
      });
      res.json(shipmentDisruptions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch disruptions requiring reroute" });
    }
  }
}
