import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ShipmentRiskService } from "../../services/shipmentRiskService";

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
      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Customer id is required');
      }
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
        originLocation,
        destinationLocationType,
        destinationLocation,
        mode,
        departureTime,
        ETA,
        status,
        riskScore,
      } = req.body;

      // Calculate risk score if not provided
      let calculatedRiskScore = riskScore;
      if (calculatedRiskScore === undefined || calculatedRiskScore === null) {
        calculatedRiskScore = 0; // Default risk score
      }

      const shipment = await prisma.shipment.create({
        data: {
          supplierId,
          customerId,
          originLocationType,
          originLocation,
          destinationLocationType,
          destinationLocation,
          mode,
          departureTime: new Date(departureTime),
          ETA: new Date(ETA),
          status,
          riskScore: calculatedRiskScore,
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
        originLocation,
        destinationLocationType,
        destinationLocation,
        mode,
        departureTime,
        ETA,
        status,
        riskScore,
      } = req.body;

      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Shipment id is required');
      }

      const shipment = await prisma.shipment.update({
        where: { id },
        data: {
          originLocationType,
          originLocation,
          destinationLocationType,
          destinationLocation,
          mode,
          ...(departureTime !== undefined ? { departureTime: new Date(departureTime) } : {}),
          ...(ETA !== undefined ? { ETA: new Date(ETA) } : {}),
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

      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Shipment id is required');
      }

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

      if (!status) {
        // handle error, e.g. throw or return a response
        throw new Error('Shipment status is required');
      }
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

      if (!supplierId) {
        // handle error, e.g. throw or return a response
        throw new Error('Supplier id is required');
      }

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

      if (!customerId) {
        // handle error, e.g. throw or return a response
        throw new Error('Customer id is required');
      }
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

      if (!id) {
        // handle error, e.g. throw or return a response
        throw new Error('Shipment id is required');
      }

      const routes = await prisma.route.findMany({
        where: { shipmentId: id },
        orderBy: { sequenceNumber: "asc" },
      });
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shipment routes" });
    }
  }

  // Calculate risk score for shipment routes
  static async calculateShipmentRisk(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params;
      
      if (!shipmentId) {
        return res.status(400).json({ error: "Shipment ID is required" });
      }

      // Verify shipment exists
      const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId }
      });

      if (!shipment) {
        return res.status(404).json({ error: "Shipment not found" });
      }

      // Get routes and disruptions for the shipment with error handling
      let routes: any[] = [];
      let disruptions: any[] = [];

      try {
        routes = await prisma.route.findMany({
          where: { shipmentId }
        });
      } catch (error) {
        console.error('Error fetching routes:', error);
        // Continue with empty routes array
      }

      try {
        disruptions = await prisma.shipmentDisruption.findMany({
          where: { shipmentId },
          include: {
            disruption: true
          }
        });
      } catch (error) {
        console.error('Error fetching disruptions:', error);
        // Continue with empty disruptions array
      }

      // Calculate enhanced risk using the service
      const enhancedRisk = ShipmentRiskService.calculateEnhancedShipmentRisk(routes, disruptions);

      // Prepare response with error handling for individual items
      const safeRoutes = routes.map(route => {
        try {
          return {
            id: route.id,
            mode: route.mode || 'unknown',
            travelTimeEst: route.travelTimeEst || 0,
            costEst: route.costEst || 0,
            fromLocationType: route.fromLocationType || 'unknown',
            toLocationType: route.toLocationType || 'unknown',
            routeRisk: ShipmentRiskService.calculateRouteRisk({
              mode: route.mode || 'unknown',
              travelTimeEst: route.travelTimeEst || 0,
              costEst: route.costEst || 0,
              fromLocationType: route.fromLocationType || 'unknown',
              toLocationType: route.toLocationType || 'unknown'
            })
          };
        } catch (error) {
          console.error('Error processing route:', error, route);
          return {
            id: route.id,
            mode: 'unknown',
            travelTimeEst: 0,
            costEst: 0,
            fromLocationType: 'unknown',
            toLocationType: 'unknown',
            routeRisk: 0
          };
        }
      });

      const safeDisruptions = disruptions.map(sd => {
        try {
          // Validate disruption data
          if (!sd.disruption) {
            console.warn('Disruption without disruption data:', sd);
            return null;
          }

          return {
            id: sd.id,
            disruptionType: sd.disruption.type || 'unknown',
            severity: sd.disruption.severity || 'medium',
            status: sd.disruption.status || 'monitoring',
            location: sd.disruption.location || 'Unknown',
            impactDelayHours: sd.impactDelayHours || 0,
            rerouteNeeded: sd.rerouteNeeded || false,
            extraCost: sd.extraCost || 0,
            disruptionRisk: ShipmentRiskService.calculateDisruptionRisk({
              type: sd.disruption.type || 'unknown',
              severity: sd.disruption.severity || 'medium',
              status: sd.disruption.status || 'monitoring',
              location: sd.disruption.location || 'Unknown',
              impactDelayHours: sd.impactDelayHours || 0,
              rerouteNeeded: sd.rerouteNeeded || false,
              extraCost: sd.extraCost || 0
            })
          };
        } catch (error) {
          console.error('Error processing disruption:', error, sd);
          return null;
        }
      }).filter(Boolean); // Remove null entries

      res.json({
        shipmentId,
        ...enhancedRisk,
        routes: safeRoutes,
        disruptions: safeDisruptions,
        calculationStatus: {
          routesFetched: routes.length,
          disruptionsFetched: disruptions.length,
          validRoutes: safeRoutes.length,
          validDisruptions: safeDisruptions.length,
          hasErrors: safeRoutes.length !== routes.length || safeDisruptions.length !== disruptions.length
        }
      });
    } catch (error) {
      console.error('Error in calculateShipmentRisk:', error);
      res.status(500).json({ 
        error: "Failed to calculate shipment risk",
        message: error instanceof Error ? error.message : 'Unknown error',
        fallback: {
          baseRisk: 0,
          disruptionRisk: 0,
          totalRisk: 0,
          riskLevel: 'low',
          disruptionCount: 0,
          activeDisruptions: 0
        }
      });
    }
  }
}
