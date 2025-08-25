export interface ShipmentLocation {
  id: string;
  shipmentId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: string;
  speed?: number;
  heading?: number;
}

export interface Shipment {
  id: string;
  supplierId: string;
  customerId: string;
  originLocationType: string;
  originLocation: string;
  destinationLocationType: string;
  destinationLocation: string;
  mode: string;
  departureTime: string;
  ETA: string;
  status: string;
  riskScore: number;
  currentLocation?: ShipmentLocation;
  supplier?: { name: string };
  customer?: { name: string };
}

export interface ShipmentStats {
  total: number;
  inTransit: number;
  completed: number;
  delayed: number;
  planned: number;
  byMode: Record<string, number>;
  byRiskLevel: { low: number; medium: number; high: number };
}

export interface LocationUpdateRequest {
  shipmentId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  status?: string;
}

export interface SearchRequest {
  query: string;
  mode?: string;
  status?: string;
  minRisk?: number;
  maxRisk?: number;
}

export interface GeographicAreaRequest {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
