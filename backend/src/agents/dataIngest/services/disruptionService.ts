import { prisma } from '../../../db/prisma';
import { ProcessedEvent, DisruptionEvent } from '../../../utils/types';
import { logger } from '../../../config/logger';

export class DisruptionService {
  async storeDisruption(event: ProcessedEvent): Promise<string> {
    try {
      logger.info('Storing disruption event', { 
        type: event.type, 
        location: event.location,
        severity: event.severity 
      });

      const disruption = await prisma.disruption.create({
        data: {
          type: event.type,
          locationType: event.locationType,
          location: event.location,
          severity: event.severity,
          description: event.description,
          startTime: new Date(event.startTime),
          endTime: event.endTime ? new Date(event.endTime) : null,
          status: 'active'
        }
      });

      logger.info('Disruption stored successfully', { id: disruption.id });
      return disruption.id;
    } catch (error) {
      logger.error('Failed to store disruption', error);
      throw error;
    }
  }

  async linkDisruptionToShipments(disruptionId: string, event: DisruptionEvent): Promise<void> {
    try {
      if (!event.affectedShipments || event.affectedShipments.length === 0) {
        return;
      }

      const shipmentDisruptions = event.affectedShipments.map(shipmentId => ({
        shipmentId,
        disruptionId,
        impactDelayHours: event.impactDelayHours || 0,
        rerouteNeeded: event.rerouteNeeded || false,
        extraCost: event.extraCost || 0
      }));

      await prisma.shipmentDisruption.createMany({
        data: shipmentDisruptions
      });

      logger.info('Linked disruption to shipments', { 
        disruptionId, 
        shipmentCount: event.affectedShipments.length 
      });
    } catch (error) {
      logger.error('Failed to link disruption to shipments', error);
      throw error;
    }
  }

  async updatePortStatus(locationId: string, status: string): Promise<void> {
    try {
      await prisma.portHub.updateMany({
        where: { name: { contains: locationId, mode: 'insensitive' } },
        data: { status }
      });

      logger.info('Updated port status', { locationId, status });
    } catch (error) {
      logger.error('Failed to update port status', error);
      throw error;
    }
  }

  async getActiveDisruptions(): Promise<any[]> {
    try {
      return await prisma.disruption.findMany({
        where: { status: 'active' },
        include: {
          affectedShipments: {
            include: {
              shipment: {
                include: {
                  supplier: true,
                  customer: true
                }
              }
            }
          }
        },
        orderBy: { startTime: 'desc' }
      });
    } catch (error) {
      logger.error('Failed to get active disruptions', error);
      throw error;
    }
  }

  async resolveDisruption(disruptionId: string): Promise<void> {
    try {
      await prisma.disruption.update({
        where: { id: disruptionId },
        data: { 
          status: 'resolved',
          endTime: new Date()
        }
      });

      logger.info('Disruption resolved', { disruptionId });
    } catch (error) {
      logger.error('Failed to resolve disruption', error);
      throw error;
    }
  }
}

