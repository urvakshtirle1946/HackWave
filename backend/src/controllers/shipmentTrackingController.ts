import { Request, Response } from 'express';
import shipmentTrackingService from '../services/shipmentTrackingService';
import { LocationUpdateRequest, SearchRequest, GeographicAreaRequest } from '../types/shipmentTracking';

export default class ShipmentTrackingController {
  // Get all shipments
  async getAllShipments(req: Request, res: Response) {
    try {
      const shipments = await shipmentTrackingService.getAllShipments();
      res.json(shipments);
    } catch (error) {
      console.error('Error in getAllShipments:', error);
      res.status(500).json({ 
        error: 'Failed to fetch shipments',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      });
    }
  }

  // Get shipment by ID
  async getShipmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Shipment ID is required' });
      }
      const shipment = await shipmentTrackingService.getShipmentById(id);

      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      res.json(shipment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipment' });
    }
  }

  // Get shipments by status
  async getShipmentsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const shipments = await shipmentTrackingService.getShipmentsByStatus(status);
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipments by status' });
    }
  }

  // Get shipments by transport mode
  async getShipmentsByMode(req: Request, res: Response) {
    try {
      const { mode } = req.params;
      if (!mode) {
        return res.status(400).json({ error: 'Transport mode is required' });
      }
      const shipments = await shipmentTrackingService.getShipmentsByMode(mode);
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipments by mode' });
    }
  }

  // Update shipment location
  async updateShipmentLocation(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params;
      const locationData: LocationUpdateRequest = req.body;

      if (!shipmentId) {
        return res.status(400).json({ error: 'Shipment ID is required' });
      }

      const updatedShipment = await shipmentTrackingService.updateShipmentLocation(
        shipmentId,
        locationData
      );

      if (!updatedShipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      res.json(updatedShipment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update shipment location' });
    }
  }

  // Get shipment statistics
  async getShipmentStats(req: Request, res: Response) {
    try {
      const stats = await shipmentTrackingService.getShipmentStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipment statistics' });
    }
  }

  // Search shipments
  async searchShipments(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const shipments = await shipmentTrackingService.searchShipments(query);
      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search shipments' });
    }
  }

  // Get shipments in geographic area
  async getShipmentsInArea(req: Request, res: Response) {
    try {
      const { minLat, maxLat, minLng, maxLng } = req.query;

      if (!minLat || !maxLat || !minLng || !maxLng) {
        return res.status(400).json({
          error: 'Geographic bounds (minLat, maxLat, minLng, maxLng) are required'
        });
      }

      const shipments = await shipmentTrackingService.getShipmentsInArea(
        Number(minLat),
        Number(maxLat),
        Number(minLng),
        Number(maxLng)
      );

      res.json(shipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipments in area' });
    }
  }

  // Get shipment history
  async getShipmentHistory(req: Request, res: Response) {
    try {
      const { shipmentId } = req.params;
      if (!shipmentId) {
        return res.status(400).json({ error: 'Shipment ID is required' });
      }
      const history = await shipmentTrackingService.getShipmentHistory(shipmentId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipment history' });
    }
  }

  // Simulate movement (for testing)
  async simulateMovement(req: Request, res: Response) {
    try {
      await shipmentTrackingService.simulateMovement();
      const updatedShipments = await shipmentTrackingService.getAllShipments();
      res.json(updatedShipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to simulate movement' });
    }
  }

  // Get real-time updates (SSE endpoint)
  async getRealTimeUpdates(req: Request, res: Response) {
    try {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Send initial data
      const shipments = await shipmentTrackingService.getAllShipments();
      res.write(`data: ${JSON.stringify(shipments)}\n\n`);

      // Set up interval to send updates
      const interval = setInterval(async () => {
        try {
          await shipmentTrackingService.simulateMovement();
          const updatedShipments = await shipmentTrackingService.getAllShipments();
          res.write(`data: ${JSON.stringify(updatedShipments)}\n\n`);
        } catch (error) {
          console.error('Error in real-time update:', error);
        }
      }, 30000); // Update every 30 seconds

      // Clean up on client disconnect
      req.on('close', () => {
        clearInterval(interval);
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to establish real-time connection' });
    }
  }
}
