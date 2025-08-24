import { Shipment, ShipmentLocation } from '../types/shipmentTracking';

// Mock data for shipment tracking
const mockShipments: Shipment[] = [
  {
    id: 'SH001',
    supplierId: 'SUP001',
    customerId: 'CUST001',
    originLocationType: 'supplier',
    originLocationId: 'SUP001',
    destinationLocationType: 'customer',
    destinationLocationId: 'CUST001',
    mode: 'sea',
    departureTime: '2024-01-15T10:00:00Z',
    ETA: '2024-01-25T14:00:00Z',
    status: 'in_transit',
    riskScore: 25,
    currentLocation: {
      id: 'LOC001',
      shipmentId: 'SH001',
      latitude: 25.2048,
      longitude: 55.2708,
      timestamp: new Date().toISOString(),
      status: 'in_transit',
      speed: 15,
      heading: 45
    },
    supplier: { name: 'Dubai Ports' },
    customer: { name: 'Hamburg Logistics' }
  },
  {
    id: 'SH002',
    supplierId: 'SUP002',
    customerId: 'CUST002',
    originLocationType: 'supplier',
    originLocationId: 'SUP002',
    destinationLocationType: 'customer',
    destinationLocationId: 'CUST002',
    mode: 'air',
    departureTime: '2024-01-16T08:00:00Z',
    ETA: '2024-01-17T10:00:00Z',
    status: 'in_transit',
    riskScore: 15,
    currentLocation: {
      id: 'LOC002',
      shipmentId: 'SH002',
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date().toISOString(),
      status: 'in_transit',
      speed: 800,
      heading: 90
    },
    supplier: { name: 'NYC Air Freight' },
    customer: { name: 'London Import Co' }
  },
  {
    id: 'SH003',
    supplierId: 'SUP003',
    customerId: 'CUST003',
    originLocationType: 'supplier',
    originLocationId: 'SUP003',
    destinationLocationType: 'customer',
    destinationLocationId: 'CUST003',
    mode: 'road',
    departureTime: '2024-01-14T06:00:00Z',
    ETA: '2024-01-18T12:00:00Z',
    status: 'in_transit',
    riskScore: 35,
    currentLocation: {
      id: 'LOC003',
      shipmentId: 'SH003',
      latitude: 51.5074,
      longitude: -0.1278,
      timestamp: new Date().toISOString(),
      status: 'in_transit',
      speed: 65,
      heading: 180
    },
    supplier: { name: 'UK Trucking Ltd' },
    customer: { name: 'Paris Distribution' }
  },
  {
    id: 'SH004',
    supplierId: 'SUP004',
    customerId: 'CUST004',
    originLocationType: 'supplier',
    originLocationId: 'SUP004',
    destinationLocationType: 'customer',
    destinationLocationId: 'CUST004',
    mode: 'rail',
    departureTime: '2024-01-13T12:00:00Z',
    ETA: '2024-01-20T16:00:00Z',
    status: 'delayed',
    riskScore: 65,
    currentLocation: {
      id: 'LOC004',
      shipmentId: 'SH004',
      latitude: 52.5200,
      longitude: 13.4050,
      timestamp: new Date().toISOString(),
      status: 'delayed',
      speed: 0,
      heading: 0
    },
    supplier: { name: 'Berlin Rail Co' },
    customer: { name: 'Warsaw Manufacturing' }
  },
  {
    id: 'SH005',
    supplierId: 'SUP005',
    customerId: 'CUST005',
    originLocationType: 'supplier',
    originLocationId: 'SUP005',
    destinationLocationType: 'customer',
    destinationLocationId: 'CUST005',
    mode: 'sea',
    departureTime: '2024-01-12T14:00:00Z',
    ETA: '2024-01-22T08:00:00Z',
    status: 'in_transit',
    riskScore: 20,
    currentLocation: {
      id: 'LOC005',
      shipmentId: 'SH005',
      latitude: 35.6762,
      longitude: 139.6503,
      timestamp: new Date().toISOString(),
      status: 'in_transit',
      speed: 12,
      heading: 270
    },
    supplier: { name: 'Tokyo Shipping Co' },
    customer: { name: 'Seattle Importers' }
  },
  {
    id: 'SH006',
    supplierId: 'SUP006',
    customerId: 'CUST006',
    originLocationType: 'supplier',
    originLocationId: 'SUP006',
    destinationLocationType: 'customer',
    destinationLocationId: 'CUST006',
    mode: 'air',
    departureTime: '2024-01-17T06:00:00Z',
    ETA: '2024-01-18T08:00:00Z',
    status: 'in_transit',
    riskScore: 10,
    currentLocation: {
      id: 'LOC006',
      shipmentId: 'SH006',
      latitude: -33.8688,
      longitude: 151.2093,
      timestamp: new Date().toISOString(),
      status: 'in_transit',
      speed: 750,
      heading: 45
    },
    supplier: { name: 'Sydney Air Cargo' },
    customer: { name: 'Singapore Logistics' }
  }
];

class ShipmentTrackingService {
  private shipments: Shipment[] = [...mockShipments];

  // Get all shipments with current locations
  async getAllShipments(): Promise<Shipment[]> {
    return this.shipments;
  }

  // Get shipment by ID
  async getShipmentById(id: string): Promise<Shipment | null> {
    return this.shipments.find(shipment => shipment.id === id) || null;
  }

  // Get shipments by status
  async getShipmentsByStatus(status: string): Promise<Shipment[]> {
    return this.shipments.filter(shipment => shipment.status === status);
  }

  // Get shipments by transport mode
  async getShipmentsByMode(mode: string): Promise<Shipment[]> {
    return this.shipments.filter(shipment => shipment.mode === mode);
  }

  // Update shipment location (simulate real-time updates)
  async updateShipmentLocation(shipmentId: string, location: Partial<ShipmentLocation>): Promise<Shipment | null> {
    const shipmentIndex = this.shipments.findIndex(s => s.id === shipmentId);
    if (shipmentIndex === -1) return null;

    const shipment = this.shipments[shipmentIndex];
    if (shipment && shipment.currentLocation) {
      this.shipments[shipmentIndex] = {
        ...shipment,
        currentLocation: {
          ...shipment.currentLocation,
          ...location,
          timestamp: new Date().toISOString()
        }
      };
    }

    return this.shipments[shipmentIndex] ?? null;
  }

  // Simulate real-time movement updates
  async simulateMovement(): Promise<void> {
    this.shipments = this.shipments.map(shipment => {
      if (shipment.currentLocation && shipment.status === 'in_transit') {
        const speed = shipment.currentLocation.speed || 0;
        const heading = shipment.currentLocation.heading || 0;

        // Simulate movement based on speed and heading
        const timeDiff = 30; // 30 seconds
        const distance = (speed * timeDiff) / 3600; // Convert to degrees (rough approximation)

        const newLat = shipment.currentLocation.latitude + (distance * Math.cos(heading * Math.PI / 180));
        const newLng = shipment.currentLocation.longitude + (distance * Math.sin(heading * Math.PI / 180));

        return {
          ...shipment,
          currentLocation: {
            ...shipment.currentLocation,
            latitude: newLat,
            longitude: newLng,
            timestamp: new Date().toISOString()
          }
        };
      }
      return shipment;
    });
  }

  // Get shipment statistics
  async getShipmentStats(): Promise<{
    total: number;
    inTransit: number;
    completed: number;
    delayed: number;
    planned: number;
    byMode: Record<string, number>;
    byRiskLevel: { low: number; medium: number; high: number };
  }> {
    const total = this.shipments.length;
    const inTransit = this.shipments.filter(s => s.status === 'in_transit').length;
    const completed = this.shipments.filter(s => s.status === 'completed').length;
    const delayed = this.shipments.filter(s => s.status === 'delayed').length;
    const planned = this.shipments.filter(s => s.status === 'planned').length;

    const byMode = this.shipments.reduce((acc, shipment) => {
      acc[shipment.mode] = (acc[shipment.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRiskLevel = this.shipments.reduce((acc, shipment) => {
      if (shipment.riskScore < 30) acc.low++;
      else if (shipment.riskScore < 60) acc.medium++;
      else acc.high++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    return {
      total,
      inTransit,
      completed,
      delayed,
      planned,
      byMode,
      byRiskLevel
    };
  }

  // Search shipments
  async searchShipments(query: string): Promise<Shipment[]> {
    const lowerQuery = query.toLowerCase();
    return this.shipments.filter(shipment =>
      shipment.id.toLowerCase().includes(lowerQuery) ||
      shipment.supplier?.name.toLowerCase().includes(lowerQuery) ||
      shipment.customer?.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Get shipments in a geographic area
  async getShipmentsInArea(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Promise<Shipment[]> {
    return this.shipments.filter(shipment =>
      shipment.currentLocation &&
      shipment.currentLocation.latitude >= minLat &&
      shipment.currentLocation.latitude <= maxLat &&
      shipment.currentLocation.longitude >= minLng &&
      shipment.currentLocation.longitude <= maxLng
    );
  }

  // Get shipment history (mock implementation)
  async getShipmentHistory(shipmentId: string): Promise<ShipmentLocation[]> {
    const shipment = this.shipments.find(s => s.id === shipmentId);
    if (!shipment) return [];

    // Generate mock history points
    const history: ShipmentLocation[] = [];
    const baseLocation = shipment.currentLocation;
    if (!baseLocation) return history;

    // Generate 10 historical points
    for (let i = 9; i >= 0; i--) {
      const timeOffset = i * 3600000; // 1 hour intervals
      const speed = baseLocation.speed || 0;
      const heading = baseLocation.heading || 0;
      const distance = (speed * timeOffset) / 3600000; // Distance traveled

      history.push({
        id: `HIST_${shipmentId}_${i}`,
        shipmentId,
        latitude: baseLocation.latitude - (distance * Math.cos(heading * Math.PI / 180)),
        longitude: baseLocation.longitude - (distance * Math.sin(heading * Math.PI / 180)),
        timestamp: new Date(Date.now() - timeOffset).toISOString(),
        status: shipment.status,
        speed: baseLocation.speed ?? 0,
        heading: baseLocation.heading ?? 0
      });
    }

    return history;
  }
}

export default new ShipmentTrackingService();
