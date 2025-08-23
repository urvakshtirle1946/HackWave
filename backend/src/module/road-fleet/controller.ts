import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class RoadFleetController {
  // Get all road fleet vehicles
  static async getAllRoadFleet(req: Request, res: Response) {
    try {
      const roadFleet = await prisma.roadFleet.findMany();
      res.json(roadFleet);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch road fleet" });
    }
  }

  // Get road fleet vehicle by ID
  static async getRoadFleetById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.roadFleet.findUnique({
        where: { id },
      });

      if (!vehicle) {
        return res.status(404).json({ error: "Road fleet vehicle not found" });
      }

      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch road fleet vehicle" });
    }
  }

  // Create new road fleet vehicle
  static async createRoadFleet(req: Request, res: Response) {
    try {
      const { vehicleType, capacity, driverName, status } = req.body;

      const vehicle = await prisma.roadFleet.create({
        data: {
          vehicleType,
          capacity,
          driverName,
          status,
        },
      });

      res.status(201).json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to create road fleet vehicle" });
    }
  }

  // Update road fleet vehicle
  static async updateRoadFleet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { vehicleType, capacity, driverName, status } = req.body;

      const vehicle = await prisma.roadFleet.update({
        where: { id },
        data: {
          vehicleType,
          capacity,
          driverName,
          status,
        },
      });

      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to update road fleet vehicle" });
    }
  }

  // Delete road fleet vehicle
  static async deleteRoadFleet(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.roadFleet.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete road fleet vehicle" });
    }
  }

  // Get road fleet by status
  static async getRoadFleetByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const vehicles = await prisma.roadFleet.findMany({
        where: { status },
      });
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch road fleet by status" });
    }
  }

  // Get road fleet by vehicle type
  static async getRoadFleetByType(req: Request, res: Response) {
    try {
      const { vehicleType } = req.params;
      const vehicles = await prisma.roadFleet.findMany({
        where: { vehicleType },
      });
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch road fleet by type" });
    }
  }
}
