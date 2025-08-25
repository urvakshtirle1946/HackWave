// Raw data types from external APIs
export interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  source: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  riskLevel: number;
}

export interface ShippingData {
  vesselId: string;
  location: string;
  status: string;
  eta: string;
  delay: number;
}

// AI-processed event types
export interface ProcessedEvent {
  type: 'strike' | 'weather' | 'congestion' | 'geopolitical' | 'technical' | 'other';
  locationType: 'port' | 'warehouse' | 'route' | 'supplier' | 'customer';
  locationId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  startTime: string;
  endTime?: string;
  confidence: number;
  source: string;
  rawData?: any;
}

export interface DisruptionEvent extends ProcessedEvent {
  affectedShipments?: string[];
  impactDelayHours?: number;
  rerouteNeeded?: boolean;
  extraCost?: number;
}

// Agent response types
export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface IngestResult {
  processed: number;
  stored: number;
  errors: number;
  events: ProcessedEvent[];
}

