import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class RouteController {
  // Get all routes
  static async getAllRoutes(req: Request, res: Response) {
    try {
      const routes = await prisma.route.findMany({
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
        },
      });
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  }

  // Get route by ID
  static async getRouteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const route = await prisma.route.findUnique({
        where: { id },
        include: {
          shipment: {
            include: {
              supplier: true,
              customer: true,
            },
          },
        },
      });

      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }

      res.json(route);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch route" });
    }
  }

  // Create new route
  static async createRoute(req: Request, res: Response) {
    try {
      const {
        shipmentId,
        fromLocationType,
        fromLocationId,
        toLocationType,
        toLocationId,
        sequenceNumber,
        mode,
        carrierName,
        travelTimeEst,
        costEst,
      } = req.body;

      const route = await prisma.route.create({
        data: {
          shipmentId,
          fromLocationType,
          fromLocationId,
          toLocationType,
          toLocationId,
          sequenceNumber,
          mode,
          carrierName,
          travelTimeEst,
          costEst,
        },
        include: {
          shipment: true,
        },
      });

      res.status(201).json(route);
    } catch (error) {
      res.status(500).json({ error: "Failed to create route" });
    }
  }

  // Update route
  static async updateRoute(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        fromLocationType,
        fromLocationId,
        toLocationType,
        toLocationId,
        sequenceNumber,
        mode,
        carrierName,
        travelTimeEst,
        costEst,
      } = req.body;

      const route = await prisma.route.update({
        where: { id },
        data: {
          fromLocationType,
          fromLocationId,
          toLocationType,
          toLocationId,
          sequenceNumber,
          mode,
          carrierName,
          travelTimeEst,
          costEst,
        },
        include: {
          shipment: true,
        },
      });

      res.json(route);
    } catch (error) {
      res.status(500).json({ error: "Failed to update route" });
    }
  }

  // Delete route
  static async deleteRoute(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.route.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete route" });
    }
  }

  // Get routes by mode
  static async getRoutesByMode(req: Request, res: Response) {
    try {
      const { mode } = req.params;
      const routes = await prisma.route.findMany({
        where: { mode },
        include: {
          shipment: true,
        },
      });
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes by mode" });
    }
  }

  // Get routes by carrier
  static async getRoutesByCarrier(req: Request, res: Response) {
    try {
      const { carrierName } = req.params;
      const routes = await prisma.route.findMany({
        where: { carrierName },
        include: {
          shipment: true,
        },
      });
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes by carrier" });
    }
  }
}
