import { Location, Shipment, Disruption } from '../types';

export const mockLocations: Location[] = [
  // Ports
  {
    id: 'port_singapore',
    name: 'Port of Singapore',
    type: 'port',
    coordinates: { lat: 1.2905, lng: 103.8520 },
    country: 'Singapore',
    region: 'Southeast Asia'
  },
  {
    id: 'port_rotterdam',
    name: 'Port of Rotterdam',
    type: 'port',
    coordinates: { lat: 51.9225, lng: 4.4792 },
    country: 'Netherlands',
    region: 'Europe'
  },
  {
    id: 'port_los_angeles',
    name: 'Port of Los Angeles',
    type: 'port',
    coordinates: { lat: 33.7288, lng: -118.2604 },
    country: 'USA',
    region: 'North America'
  },
  {
    id: 'port_shanghai',
    name: 'Port of Shanghai',
    type: 'port',
    coordinates: { lat: 31.2304, lng: 121.4737 },
    country: 'China',
    region: 'Asia'
  },

  // Suppliers
  {
    id: 'supplier_china',
    name: 'Tech Manufacturing Co.',
    type: 'supplier',
    coordinates: { lat: 22.3193, lng: 114.1694 },
    country: 'China',
    region: 'Asia'
  },
  {
    id: 'supplier_india',
    name: 'Textile Industries Ltd.',
    type: 'supplier',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    country: 'India',
    region: 'Asia'
  },
  {
    id: 'supplier_germany',
    name: 'Precision Engineering GmbH',
    type: 'supplier',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    country: 'Germany',
    region: 'Europe'
  },

  // Customers
  {
    id: 'customer_usa',
    name: 'US Distribution Center',
    type: 'customer',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    country: 'USA',
    region: 'North America'
  },
  {
    id: 'customer_uk',
    name: 'UK Logistics Hub',
    type: 'customer',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    country: 'UK',
    region: 'Europe'
  },
  {
    id: 'customer_uae',
    name: 'Middle East Hub',
    type: 'customer',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    country: 'UAE',
    region: 'Middle East'
  }
];

export const mockShipments: Shipment[] = [
  {
    id: 'shipment_001',
    origin: 'port_shanghai',
    destination: 'port_los_angeles',
    supplier: 'supplier_china',
    status: 'in_transit',
    eta: new Date('2024-01-15T10:00:00Z'),
    cargo: {
      type: 'Electronics',
      weight: 5000,
      value: 250000,
      priority: 'high'
    },
    route: ['port_shanghai', 'port_singapore', 'port_los_angeles'],
    vessel: {
      name: 'Ever Given II',
      type: 'ship',
      capacity: 10000
    },
    riskScore: 0.3,
    disruptions: []
  },
  {
    id: 'shipment_002',
    origin: 'port_rotterdam',
    destination: 'port_los_angeles',
    supplier: 'supplier_germany',
    status: 'in_transit',
    eta: new Date('2024-01-18T14:00:00Z'),
    cargo: {
      type: 'Machinery',
      weight: 8000,
      value: 450000,
      priority: 'critical'
    },
    route: ['port_rotterdam', 'port_los_angeles'],
    vessel: {
      name: 'Atlantic Star',
      type: 'ship',
      capacity: 15000
    },
    riskScore: 0.2,
    disruptions: []
  },
  {
    id: 'shipment_003',
    origin: 'supplier_india',
    destination: 'customer_uk',
    supplier: 'supplier_india',
    status: 'in_transit',
    eta: new Date('2024-01-20T09:00:00Z'),
    cargo: {
      type: 'Textiles',
      weight: 3000,
      value: 75000,
      priority: 'medium'
    },
    route: ['supplier_india', 'port_singapore', 'port_rotterdam', 'customer_uk'],
    vessel: {
      name: 'Indian Ocean',
      type: 'ship',
      capacity: 8000
    },
    riskScore: 0.4,
    disruptions: []
  },
  {
    id: 'shipment_004',
    origin: 'supplier_china',
    destination: 'customer_uae',
    supplier: 'supplier_china',
    status: 'in_transit',
    eta: new Date('2024-01-22T16:00:00Z'),
    cargo: {
      type: 'Consumer Goods',
      weight: 2000,
      value: 120000,
      priority: 'low'
    },
    route: ['supplier_china', 'port_singapore', 'customer_uae'],
    vessel: {
      name: 'Silk Road',
      type: 'ship',
      capacity: 5000
    },
    riskScore: 0.5,
    disruptions: []
  },
  {
    id: 'shipment_005',
    origin: 'supplier_germany',
    destination: 'customer_usa',
    supplier: 'supplier_germany',
    status: 'in_transit',
    eta: new Date('2024-01-25T12:00:00Z'),
    cargo: {
      type: 'Automotive Parts',
      weight: 6000,
      value: 300000,
      priority: 'high'
    },
    route: ['supplier_germany', 'port_rotterdam', 'port_los_angeles', 'customer_usa'],
    vessel: {
      name: 'European Express',
      type: 'ship',
      capacity: 12000
    },
    riskScore: 0.25,
    disruptions: []
  }
];

export const mockDisruptions: Disruption[] = [
  {
    id: 'disruption_001',
    type: 'weather',
    severity: 'high',
    description: 'Tropical storm affecting Singapore port operations',
    location: 'port_singapore',
    startDate: new Date('2024-01-10T00:00:00Z'),
    endDate: new Date('2024-01-12T00:00:00Z'),
    impact: {
      delayHours: 48,
      costIncrease: 15000,
      probability: 0.8
    }
  },
  {
    id: 'disruption_002',
    type: 'geopolitical',
    severity: 'medium',
    description: 'Trade tensions affecting China-US routes',
    location: 'port_shanghai',
    startDate: new Date('2024-01-08T00:00:00Z'),
    impact: {
      delayHours: 24,
      costIncrease: 8000,
      probability: 0.6
    }
  },
  {
    id: 'disruption_003',
    type: 'congestion',
    severity: 'medium',
    description: 'Port congestion at Los Angeles due to high volume',
    location: 'port_los_angeles',
    startDate: new Date('2024-01-05T00:00:00Z'),
    impact: {
      delayHours: 36,
      costIncrease: 12000,
      probability: 0.7
    }
  }
];

export const getMockWeatherData = (locationId: string) => {
  const location = mockLocations.find(loc => loc.id === locationId);
  if (!location) return null;

  // Simulate weather conditions based on location
  const weatherConditions = [
    { conditions: 'Clear', riskLevel: 'low' as const },
    { conditions: 'Cloudy', riskLevel: 'low' as const },
    { conditions: 'Rain', riskLevel: 'medium' as const },
    { conditions: 'Storm', riskLevel: 'high' as const }
  ];

  const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  
  return {
    location: locationId,
    temperature: Math.floor(Math.random() * 40) - 10, // -10 to 30°C
    conditions: randomCondition.conditions,
    windSpeed: Math.floor(Math.random() * 50) + 5, // 5-55 km/h
    visibility: Math.floor(Math.random() * 20) + 5, // 5-25 km
    riskLevel: randomCondition.riskLevel
  };
};

export const getMockNewsData = () => {
  const newsTemplates = [
    {
      title: 'Trade tensions escalate in Asia-Pacific region',
      summary: 'Recent developments suggest potential supply chain disruptions',
      category: 'geopolitical' as const,
      riskLevel: 'high' as const
    },
    {
      title: 'New environmental regulations affect shipping industry',
      summary: 'Stricter emissions standards may impact delivery times',
      category: 'environmental' as const,
      riskLevel: 'medium' as const
    },
    {
      title: 'Port infrastructure improvements announced',
      summary: 'Major upgrades expected to reduce congestion',
      category: 'technical' as const,
      riskLevel: 'low' as const
    }
  ];

  return newsTemplates.map((template, index) => ({
    ...template,
    location: mockLocations[Math.floor(Math.random() * mockLocations.length)].id,
    publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
  }));
};
