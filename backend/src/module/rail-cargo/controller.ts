import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class RailCargoController {
  // Get all rail cargo
  static async getAllRailCargo(req: Request, res: Response) {
    try {
      const railCargo = await prisma.railCargo.findMany();
      res.json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rail cargo" });
    }
  }

  // Get rail cargo by ID
  static async getRailCargoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Rail cargo ID is required" });
      }
      const railCargo = await prisma.railCargo.findUnique({
        where: { id },
      });

      if (!railCargo) {
        return res.status(404).json({ error: "Rail cargo not found" });
      }

      res.json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rail cargo" });
    }
  }

  // Create new rail cargo
  static async createRailCargo(req: Request, res: Response) {
    try {
      const {
        trainNo,
        railOperator,
        capacity,
        departureHubId,
        arrivalHubId,
        status,
      } = req.body;

      const railCargo = await prisma.railCargo.create({
        data: {
          trainNo,
          railOperator,
          capacity,
          departureHubId,
          arrivalHubId,
          status,
        },
      });

      res.status(201).json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create rail cargo" });
    }
  }

  // Update rail cargo
  static async updateRailCargo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        trainNo,
        railOperator,
        capacity,
        departureHubId,
        arrivalHubId,
        status,
      } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Rail cargo ID is required" });
      }

      const railCargo = await prisma.railCargo.update({
        where: { id },
        data: {
          trainNo,
          railOperator,
          capacity,
          departureHubId,
          arrivalHubId,
          status,
        },
      });

      res.json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update rail cargo" });
    }
  }

  // Delete rail cargo
  static async deleteRailCargo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Rail cargo ID is required" });
      }

      await prisma.railCargo.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete rail cargo" });
    }
  }

  // Get rail cargo by operator
  static async getRailCargoByOperator(req: Request, res: Response) {
    try {
      const { railOperator } = req.params;

      if (!railOperator) {
        return res.status(400).json({ error: "Rail operator is required" });
      }

      const railCargo = await prisma.railCargo.findMany({
        where: { railOperator },
      });
      res.json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rail cargo by operator" });
    }
  }

  // Get rail cargo by status
  static async getRailCargoByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const railCargo = await prisma.railCargo.findMany({
        where: { status },
      });
      res.json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rail cargo by status" });
    }
  }

  // Get rail cargo by route
  static async getRailCargoByRoute(req: Request, res: Response) {
    try {
      const { departureHubId, arrivalHubId } = req.params;

      if (!departureHubId || !arrivalHubId) {
        return res.status(400).json({ error: "Both departure and arrival hub IDs are required" });
      }

      const railCargo = await prisma.railCargo.findMany({
        where: {
          departureHubId,
          arrivalHubId,
        },
      });
      res.json(railCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rail cargo by route" });
    }
  }
}
