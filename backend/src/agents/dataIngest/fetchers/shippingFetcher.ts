import { ShippingData } from '../../../utils/types';
import { logger } from '../../../config/logger';

export class ShippingFetcher {
  // Simulated vessel tracking data
  private vessels = [
    { id: 'VESSEL001', name: 'Ever Given', location: 'Shanghai', status: 'berthed' },
    { id: 'VESSEL002', name: 'MSC Oscar', location: 'Rotterdam', status: 'anchored' },
    { id: 'VESSEL003', name: 'CMA CGM Marco Polo', location: 'Singapore', status: 'departed' },
    { id: 'VESSEL004', name: 'Mærsk Mc-Kinney Møller', location: 'Los Angeles', status: 'berthed' },
    { id: 'VESSEL005', name: 'OOCL Hong Kong', location: 'Hamburg', status: 'in_transit' },
    { id: 'VESSEL006', name: 'COSCO Shipping Universe', location: 'Dubai', status: 'anchored' },
    { id: 'VESSEL007', name: 'MSC Gülsün', location: 'Mumbai', status: 'berthed' },
    { id: 'VESSEL008', name: 'HMM Algeciras', location: 'Busan', status: 'departed' },
    { id: 'VESSEL009', name: 'Ever Ace', location: 'Antwerp', status: 'in_transit' },
    { id: 'VESSEL010', name: 'MSC Irina', location: 'Long Beach', status: 'anchored' }
  ];

  async fetchShippingData(): Promise<ShippingData[]> {
    try {
      logger.info('Fetching simulated shipping data');
      
      return this.vessels.map(vessel => ({
        vesselId: vessel.id,
        location: vessel.location,
        status: vessel.status,
        eta: this.generateETA(vessel.status),
        delay: this.generateDelay(vessel.status)
      }));
    } catch (error) {
      logger.error('Failed to fetch shipping data', error);
      return [];
    }
  }

  async fetchPortStatus(): Promise<any[]> {
    const ports = [
      { name: 'Port of Shanghai', status: 'congested', waitTime: 48 },
      { name: 'Port of Rotterdam', status: 'normal', waitTime: 12 },
      { name: 'Port of Singapore', status: 'congested', waitTime: 36 },
      { name: 'Port of Los Angeles', status: 'normal', waitTime: 8 },
      { name: 'Port of Hamburg', status: 'normal', waitTime: 6 },
      { name: 'Port of Dubai', status: 'normal', waitTime: 4 },
      { name: 'Port of Mumbai', status: 'congested', waitTime: 24 },
      { name: 'Port of Busan', status: 'normal', waitTime: 10 },
      { name: 'Port of Antwerp', status: 'normal', waitTime: 8 },
      { name: 'Port of Long Beach', status: 'congested', waitTime: 30 }
    ];

    return ports.map(port => ({
      ...port,
      timestamp: new Date().toISOString()
    }));
  }

  private generateETA(status: string): string {
    const now = new Date();
    let etaHours = 0;

    switch (status) {
      case 'berthed':
        etaHours = Math.floor(Math.random() * 24) + 1; // 1-24 hours
        break;
      case 'anchored':
        etaHours = Math.floor(Math.random() * 48) + 12; // 12-60 hours
        break;
      case 'departed':
        etaHours = Math.floor(Math.random() * 168) + 24; // 1-8 days
        break;
      case 'in_transit':
        etaHours = Math.floor(Math.random() * 336) + 48; // 2-14 days
        break;
      default:
        etaHours = Math.floor(Math.random() * 72) + 12;
    }

    const eta = new Date(now.getTime() + etaHours * 60 * 60 * 1000);
    return eta.toISOString();
  }

  private generateDelay(status: string): number {
    switch (status) {
      case 'berthed':
        return 0; // No delay when berthed
      case 'anchored':
        return Math.floor(Math.random() * 24) + 6; // 6-30 hours
      case 'departed':
        return Math.floor(Math.random() * 12) + 2; // 2-14 hours
      case 'in_transit':
        return Math.floor(Math.random() * 48) + 12; // 12-60 hours
      default:
        return Math.floor(Math.random() * 24) + 6;
    }
  }
}

