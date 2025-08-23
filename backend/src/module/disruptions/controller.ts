import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class DisruptionController {
  // Get all disruptions
  static async getAllDisruptions(req: Request, res: Response) {
    try {
      const disruptions = await prisma.disruption.findMany({
        include: {
          affectedShipments: {
            include: {
              shipment: {
                include: {
                  supplier: true,
                  customer: true,
                },
              },
            },
          },
        },
      });
      res.json(disruptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch disruptions" });
    }
  }

  // Get disruption by ID
  static async getDisruptionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const disruption = await prisma.disruption.findUnique({
        where: { id },
        include: {
          affectedShipments: {
            include: {
              shipment: {
                include: {
                  supplier: true,
                  customer: true,
                },
              },
            },
          },
        },
      });

      if (!disruption) {
        return res.status(404).json({ error: "Disruption not found" });
      }

      res.json(disruption);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch disruption" });
    }
  }

  // Create new disruption
  static async createDisruption(req: Request, res: Response) {
    try {
      const {
        type,
        locationType,
        locationId,
        severity,
        description,
        startTime,
        endTime,
      } = req.body;

      const disruption = await prisma.disruption.create({
        data: {
          type,
          locationType,
          locationId,
          severity,
          description,
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
        },
      });

      res.status(201).json(disruption);
    } catch (error) {
      res.status(500).json({ error: "Failed to create disruption" });
    }
  }

  // Update disruption
  static async updateDisruption(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        type,
        locationType,
        locationId,
        severity,
        description,
        startTime,
        endTime,
      } = req.body;

      const disruption = await prisma.disruption.update({
        where: { id },
        data: {
          type,
          locationType,
          locationId,
          severity,
          description,
          startTime: startTime ? new Date(startTime) : undefined,
          endTime: endTime ? new Date(endTime) : null,
        },
      });

      res.json(disruption);
    } catch (error) {
      res.status(500).json({ error: "Failed to update disruption" });
    }
  }

  // Delete disruption
  static async deleteDisruption(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.disruption.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete disruption" });
    }
  }

  // Get disruptions by type
  static async getDisruptionsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const disruptions = await prisma.disruption.findMany({
        where: { type },
        include: {
          affectedShipments: {
            include: {
              shipment: true,
            },
          },
        },
      });
      res.json(disruptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch disruptions by type" });
    }
  }

  // Get disruptions by severity
  static async getDisruptionsBySeverity(req: Request, res: Response) {
    try {
      const { severity } = req.params;
      const disruptions = await prisma.disruption.findMany({
        where: { severity },
        include: {
          affectedShipments: {
            include: {
              shipment: true,
            },
          },
        },
      });
      res.json(disruptions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch disruptions by severity" });
    }
  }

  // Get active disruptions
  static async getActiveDisruptions(req: Request, res: Response) {
    try {
      const now = new Date();
      const disruptions = await prisma.disruption.findMany({
        where: {
          startTime: {
            lte: now,
          },
          OR: [{ endTime: null }, { endTime: { gte: now } }],
        },
        include: {
          affectedShipments: {
            include: {
              shipment: true,
            },
          },
        },
      });
      res.json(disruptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active disruptions" });
    }
  }

  // Get disruptions by location
  static async getDisruptionsByLocation(req: Request, res: Response) {
    try {
      const { locationType, locationId } = req.params;
      const disruptions = await prisma.disruption.findMany({
        where: {
          locationType,
          locationId,
        },
        include: {
          affectedShipments: {
            include: {
              shipment: true,
            },
          },
        },
      });
      res.json(disruptions);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch disruptions by location" });
    }
  }
}
