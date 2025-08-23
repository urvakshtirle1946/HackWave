import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class PortHubController {
  // Get all port hubs
  static async getAllPortHubs(req: Request, res: Response) {
    try {
      const portHubs = await prisma.portHub.findMany();
      res.json(portHubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch port hubs" });
    }
  }

  // Get port hub by ID
  static async getPortHubById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Customer id is required');
      }
      const portHub = await prisma.portHub.findUnique({
        where: { id },
      });

      if (!portHub) {
        return res.status(404).json({ error: "Port hub not found" });
      }

      res.json(portHub);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch port hub" });
    }
  }

  // Create new port hub
  static async createPortHub(req: Request, res: Response) {
    try {
      const { name, country, type, status, capacity } = req.body;

      const portHub = await prisma.portHub.create({
        data: {
          name,
          country,
          type,
          status,
          capacity,
        },
      });

      res.status(201).json(portHub);
    } catch (error) {
      res.status(500).json({ error: "Failed to create port hub" });
    }
  }

  // Update port hub
  static async updatePortHub(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, country, type, status, capacity } = req.body;

      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Customer id is required');
      }

      const portHub = await prisma.portHub.update({
        where: { id },
        data: {
          name,
          country,
          type,
          status,
          capacity,
        },
      });

      res.json(portHub);
    } catch (error) {
      res.status(500).json({ error: "Failed to update port hub" });
    }
  }

  // Delete port hub
  static async deletePortHub(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Customer id is required');
      }

      await prisma.portHub.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete port hub" });
    }
  }

  // Get port hubs by type
  static async getPortHubsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;

      if (!type) {
        // handle error, e.g. throw or return a response
        throw new Error('Port hub type is required');
      }
      const portHubs = await prisma.portHub.findMany({
        where: { type },
      });
      res.json(portHubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch port hubs by type" });
    }
  }

  // Get port hubs by status
  static async getPortHubsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;

      if (!status) {
        // handle error, e.g. throw or return a response
        throw new Error('Port hub status is required');
      }

      const portHubs = await prisma.portHub.findMany({
        where: { status },
      });
      res.json(portHubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch port hubs by status" });
    }
  }
}
