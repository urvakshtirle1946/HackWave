import { Request, Response } from "express";
import prisma from "../../config/prisma";

export class AirCargoController {
  // Get all air cargo
  static async getAllAirCargo(req: Request, res: Response) {
    try {
      const airCargo = await prisma.airCargo.findMany();
      res.json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch air cargo" });
    }
  }

  // Get air cargo by ID
  static async getAirCargoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Air cargo ID is required" });
      }
      const airCargo = await prisma.airCargo.findUnique({
        where: { id },
      });

      if (!airCargo) {
        return res.status(404).json({ error: "Air cargo not found" });
      }

      res.json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch air cargo" });
    }
  }

  // Create new air cargo
  static async createAirCargo(req: Request, res: Response) {
    try {
      const {
        airline,
        flightNo,
        capacity,
        departureAirportId,
        arrivalAirportId,
        status,
      } = req.body;

      const airCargo = await prisma.airCargo.create({
        data: {
          airline,
          flightNo,
          capacity,
          departureAirportId,
          arrivalAirportId,
          status,
        },
      });

      res.status(201).json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create air cargo" });
    }
  }

  // Update air cargo
  static async updateAirCargo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        airline,
        flightNo,
        capacity,
        departureAirportId,
        arrivalAirportId,
        status,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Air cargo ID is required" });
      }

      const airCargo = await prisma.airCargo.update({
        where: { id },
        data: {
          airline,
          flightNo,
          capacity,
          departureAirportId,
          arrivalAirportId,
          status,
        },
      });

      res.json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update air cargo" });
    }
  }

  // Delete air cargo
  static async deleteAirCargo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Air cargo ID is required" });
      }

      await prisma.airCargo.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete air cargo" });
    }
  }

  // Get air cargo by airline
  static async getAirCargoByAirline(req: Request, res: Response) {
    try {
      const { airline } = req.params;

      if (!airline) {
        return res.status(400).json({ error: "Airline is required" });
      }
      const airCargo = await prisma.airCargo.findMany({
        where: { airline },
      });
      res.json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch air cargo by airline" });
    }
  }

  // Get air cargo by status
  static async getAirCargoByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const airCargo = await prisma.airCargo.findMany({
        where: { status },
      });
      res.json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch air cargo by status" });
    }
  }

  // Get air cargo by route
  static async getAirCargoByRoute(req: Request, res: Response) {
    try {
      const { departureAirportId, arrivalAirportId } = req.params;

      if (!departureAirportId || !arrivalAirportId) {
        return res.status(400).json({ error: "Both departure and arrival airport IDs are required" });
      }

      const airCargo = await prisma.airCargo.findMany({
        where: {
          departureAirportId,
          arrivalAirportId,
        },
      });
      res.json(airCargo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch air cargo by route" });
    }
  }
}
