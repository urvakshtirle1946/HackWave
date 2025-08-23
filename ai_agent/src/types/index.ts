export interface Location {
  id: string;
  name: string;
  type: 'port' | 'supplier' | 'customer' | 'warehouse';
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  region: string;
}

export interface Shipment {
  id: string;
  origin: string; // Location ID
  destination: string; // Location ID
  supplier: string; // Location ID
  status: 'in_transit' | 'delayed' | 'delivered' | 'cancelled';
  eta: Date;
  actualArrival?: Date;
  cargo: {
    type: string;
    weight: number;
    value: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  };
  route: string[];
  vessel: {
    name: string;
    type: 'ship' | 'plane' | 'truck';
    capacity: number;
  };
  riskScore: number;
  disruptions: Disruption[];
}

export interface Disruption {
  id: string;
  type: 'weather' | 'geopolitical' | 'technical' | 'congestion' | 'customs';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string; // Location ID
  startDate: Date;
  endDate?: Date;
  impact: {
    delayHours: number;
    costIncrease: number;
    probability: number;
  };
}

export interface RiskAssessment {
  shipmentId: string;
  overallRisk: number;
  factors: {
    weather: number;
    geopolitical: number;
    technical: number;
    congestion: number;
    customs: number;
  };
  recommendations: string[];
  alternativeRoutes: string[][];
  alternativeSuppliers: string[];
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  disruptions: Disruption[];
  affectedShipments: string[];
  impact: {
    totalDelay: number;
    totalCostIncrease: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  recommendations: string[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  windSpeed: number;
  visibility: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface NewsData {
  title: string;
  summary: string;
  location: string;
  category: 'geopolitical' | 'economic' | 'environmental' | 'technical';
  riskLevel: 'low' | 'medium' | 'high';
  publishedAt: Date;
}

export interface AgentResponse {
  agentId: string;
  agentType: string;
  timestamp: Date;
  data: any;
  confidence: number;
}
