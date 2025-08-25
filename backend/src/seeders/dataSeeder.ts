import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Realistic supplier data
const suppliers = [
  {
    name: 'Tata Steel Limited',
    country: 'India',
    industry: 'Steel Manufacturing',
    reliabilityScore: 95
  },
  {
    name: 'Reliance Industries',
    country: 'India',
    industry: 'Petrochemicals',
    reliabilityScore: 98
  },
  {
    name: 'Infosys Technologies',
    country: 'India',
    industry: 'Information Technology',
    reliabilityScore: 92
  },
  {
    name: 'Wipro Limited',
    country: 'India',
    industry: 'Information Technology',
    reliabilityScore: 90
  },
  {
    name: 'Mahindra & Mahindra',
    country: 'India',
    industry: 'Automotive',
    reliabilityScore: 88
  },
  {
    name: 'Huawei Technologies',
    country: 'China',
    industry: 'Telecommunications',
    reliabilityScore: 85
  },
  {
    name: 'Alibaba Group',
    country: 'China',
    industry: 'E-commerce',
    reliabilityScore: 96
  },
  {
    name: 'Tencent Holdings',
    country: 'China',
    industry: 'Technology',
    reliabilityScore: 94
  },
  {
    name: 'Baidu Inc.',
    country: 'China',
    industry: 'Technology',
    reliabilityScore: 89
  },
  {
    name: 'Xiaomi Corporation',
    country: 'China',
    industry: 'Electronics',
    reliabilityScore: 87
  }
];

// Realistic customer data
const customers = [
  {
    name: 'Amazon Web Services',
    country: 'United States',
    industry: 'Cloud Computing',
    demandForecast: 98
  },
  {
    name: 'Microsoft Corporation',
    country: 'United States',
    industry: 'Software',
    demandForecast: 95
  },
  {
    name: 'Apple Inc.',
    country: 'United States',
    industry: 'Consumer Electronics',
    demandForecast: 99
  },
  {
    name: 'Google LLC',
    country: 'United States',
    industry: 'Technology',
    demandForecast: 97
  },
  {
    name: 'Tesla Inc.',
    country: 'United States',
    industry: 'Automotive',
    demandForecast: 93
  },
  {
    name: 'Samsung Electronics',
    country: 'South Korea',
    industry: 'Electronics',
    demandForecast: 96
  },
  {
    name: 'Sony Corporation',
    country: 'Japan',
    industry: 'Electronics',
    demandForecast: 91
  },
  {
    name: 'Toyota Motor Corporation',
    country: 'Japan',
    industry: 'Automotive',
    demandForecast: 94
  },
  {
    name: 'Volkswagen Group',
    country: 'Germany',
    industry: 'Automotive',
    demandForecast: 92
  },
  {
    name: 'BMW Group',
    country: 'Germany',
    industry: 'Automotive',
    demandForecast: 90
  }
];

// Realistic port data
const ports = [
  {
    name: 'Jawaharlal Nehru Port Trust',
    country: 'India',
    type: 'Container Port',
    status: 'Operational',
    capacity: 5000000
  },
  {
    name: 'Mumbai Port Trust',
    country: 'India',
    type: 'Multi-purpose Port',
    status: 'Operational',
    capacity: 3000000
  },
  {
    name: 'Chennai Port Trust',
    country: 'India',
    type: 'Container Port',
    status: 'Operational',
    capacity: 2500000
  },
  {
    name: 'Shanghai Port',
    country: 'China',
    type: 'Container Port',
    status: 'Operational',
    capacity: 40000000
  },
  {
    name: 'Ningbo-Zhoushan Port',
    country: 'China',
    type: 'Container Port',
    status: 'Operational',
    capacity: 28000000
  },
  {
    name: 'Shenzhen Port',
    country: 'China',
    type: 'Container Port',
    status: 'Operational',
    capacity: 25000000
  },
  {
    name: 'Los Angeles Port',
    country: 'United States',
    type: 'Container Port',
    status: 'Operational',
    capacity: 9000000
  },
  {
    name: 'Long Beach Port',
    country: 'United States',
    type: 'Container Port',
    status: 'Operational',
    capacity: 8000000
  },
  {
    name: 'Hamburg Port',
    country: 'Germany',
    type: 'Multi-purpose Port',
    status: 'Operational',
    capacity: 8500000
  },
  {
    name: 'Rotterdam Port',
    country: 'Netherlands',
    type: 'Multi-purpose Port',
    status: 'Operational',
    capacity: 15000000
  }
];

// Realistic warehouse data
const warehouses = [
  {
    name: 'Mumbai Central Warehouse',
    country: 'India',
    capacity: 50000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'Delhi Logistics Hub',
    country: 'India',
    capacity: 75000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'Bangalore Tech Warehouse',
    country: 'India',
    capacity: 40000,
    type: 'Specialized',
    status: 'Operational'
  },
  {
    name: 'Shanghai Mega Warehouse',
    country: 'China',
    capacity: 150000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'Shenzhen Electronics Hub',
    country: 'China',
    capacity: 80000,
    type: 'Specialized',
    status: 'Operational'
  },
  {
    name: 'Beijing Distribution Center',
    country: 'China',
    capacity: 100000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'Los Angeles West Coast Hub',
    country: 'United States',
    capacity: 120000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'New York East Coast Hub',
    country: 'United States',
    capacity: 90000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'Chicago Midwest Hub',
    country: 'United States',
    capacity: 110000,
    type: 'Distribution Center',
    status: 'Operational'
  },
  {
    name: 'Frankfurt European Hub',
    country: 'Germany',
    capacity: 85000,
    type: 'Distribution Center',
    status: 'Operational'
  }
];

// Realistic road fleet data
const roadFleets = [
  {
    vehicleType: 'Container Truck',
    capacity: 20,
    driverName: 'Rajesh Kumar',
    status: 'Available'
  },
  {
    vehicleType: 'Refrigerated Truck',
    capacity: 15,
    driverName: 'Amit Patel',
    status: 'In Transit'
  },
  {
    vehicleType: 'Flatbed Truck',
    capacity: 25,
    driverName: 'Suresh Singh',
    status: 'Available'
  },
  {
    vehicleType: 'Container Truck',
    capacity: 20,
    driverName: 'Li Wei',
    status: 'Available'
  },
  {
    vehicleType: 'Refrigerated Truck',
    capacity: 15,
    driverName: 'Zhang Ming',
    status: 'Maintenance'
  },
  {
    vehicleType: 'Container Truck',
    capacity: 20,
    driverName: 'John Smith',
    status: 'Available'
  },
  {
    vehicleType: 'Flatbed Truck',
    capacity: 25,
    driverName: 'Mike Johnson',
    status: 'In Transit'
  },
  {
    vehicleType: 'Refrigerated Truck',
    capacity: 15,
    driverName: 'David Wilson',
    status: 'Available'
  }
];

// Realistic air cargo data
const airCargos = [
  {
    airline: 'Air India Cargo',
    flightNo: 'AI-1234',
    capacity: 50,
    departureAirportId: 'BOM',
    arrivalAirportId: 'DEL',
    status: 'Scheduled'
  },
  {
    airline: 'Cathay Pacific Cargo',
    flightNo: 'CX-5678',
    capacity: 80,
    departureAirportId: 'HKG',
    arrivalAirportId: 'LAX',
    status: 'In Flight'
  },
  {
    airline: 'Lufthansa Cargo',
    flightNo: 'LH-9012',
    capacity: 100,
    departureAirportId: 'FRA',
    arrivalAirportId: 'JFK',
    status: 'Scheduled'
  },
  {
    airline: 'Emirates SkyCargo',
    flightNo: 'EK-3456',
    capacity: 120,
    departureAirportId: 'DXB',
    arrivalAirportId: 'LHR',
    status: 'Available'
  },
  {
    airline: 'FedEx Express',
    flightNo: 'FX-7890',
    capacity: 90,
    departureAirportId: 'MEM',
    arrivalAirportId: 'CDG',
    status: 'In Flight'
  }
];

// Realistic rail cargo data
const railCargos = [
  {
    trainNo: 'IR-12345',
    railOperator: 'Indian Railways',
    capacity: 200,
    departureHubId: 'Mumbai Central',
    arrivalHubId: 'Delhi Junction',
    status: 'Scheduled'
  },
  {
    trainNo: 'IR-67890',
    railOperator: 'Indian Railways',
    capacity: 180,
    departureHubId: 'Chennai Central',
    arrivalHubId: 'Bangalore City',
    status: 'In Transit'
  },
  {
    trainNo: 'CR-11111',
    railOperator: 'China Railway',
    capacity: 250,
    departureHubId: 'Beijing West',
    arrivalHubId: 'Shanghai Hongqiao',
    status: 'Scheduled'
  },
  {
    trainNo: 'CR-22222',
    railOperator: 'China Railway',
    capacity: 220,
    departureHubId: 'Guangzhou East',
    arrivalHubId: 'Shenzhen North',
    status: 'Available'
  },
  {
    trainNo: 'DB-33333',
    railOperator: 'Deutsche Bahn',
    capacity: 150,
    departureHubId: 'Frankfurt Central',
    arrivalHubId: 'Berlin Central',
    status: 'In Transit'
  }
];

// Realistic disruption data
const disruptions = [
  {
    type: 'Weather',
    locationType: 'Port',
    severity: 'High',
    description: 'Cyclone warning affecting port operations',
    startTime: new Date('2024-01-15T10:00:00Z'),
    endTime: new Date('2024-01-17T18:00:00Z'),
    status: 'Active',
    location: 'Mumbai Port'
  },
  {
    type: 'Technical',
    locationType: 'Warehouse',
    severity: 'Medium',
    description: 'Power outage affecting warehouse operations',
    startTime: new Date('2024-01-20T14:00:00Z'),
    endTime: new Date('2024-01-20T20:00:00Z'),
    status: 'Resolved',
    location: 'Delhi Logistics Hub'
  },
  {
    type: 'Labor',
    locationType: 'Port',
    severity: 'High',
    description: 'Port workers strike affecting container handling',
    startTime: new Date('2024-01-25T08:00:00Z'),
    endTime: new Date('2024-01-27T16:00:00Z'),
    status: 'Active',
    location: 'Shanghai Port'
  },
  {
    type: 'Infrastructure',
    locationType: 'Road',
    severity: 'Medium',
    description: 'Bridge maintenance causing traffic delays',
    startTime: new Date('2024-01-30T06:00:00Z'),
    endTime: new Date('2024-02-02T18:00:00Z'),
    status: 'Monitoring',
    location: 'Mumbai-Delhi Highway'
  }
];

// Realistic inventory data
const inventories = [
  {
    warehouseId: '', // Will be set after warehouse creation
    productName: 'Steel Coils',
    sku: 'STL-001',
    quantity: 5000,
    reorderPoint: 1000
  },
  {
    warehouseId: '', // Will be set after warehouse creation
    productName: 'Electronics Components',
    sku: 'ELC-002',
    quantity: 15000,
    reorderPoint: 3000
  },
  {
    warehouseId: '', // Will be set after warehouse creation
    productName: 'Automotive Parts',
    sku: 'AUT-003',
    quantity: 8000,
    reorderPoint: 2000
  },
  {
    warehouseId: '', // Will be set after warehouse creation
    productName: 'Pharmaceuticals',
    sku: 'PHA-004',
    quantity: 3000,
    reorderPoint: 500
  },
  {
    warehouseId: '', // Will be set after warehouse creation
    productName: 'Textiles',
    sku: 'TXT-005',
    quantity: 12000,
    reorderPoint: 2500
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.shipmentDisruption.deleteMany();
    await prisma.disruption.deleteMany();
    await prisma.route.deleteMany();
    await prisma.shipment.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.portHub.deleteMany();
    await prisma.roadFleet.deleteMany();
    await prisma.airCargo.deleteMany();
    await prisma.railCargo.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.supplier.deleteMany();

    // Seed suppliers
    console.log('🏭 Seeding suppliers...');
    const createdSuppliers = await Promise.all(
      suppliers.map(supplier => prisma.supplier.create({ data: supplier }))
    );
    console.log(`✅ Created ${createdSuppliers.length} suppliers`);

    // Seed customers
    console.log('👥 Seeding customers...');
    const createdCustomers = await Promise.all(
      customers.map(customer => prisma.customer.create({ data: customer }))
    );
    console.log(`✅ Created ${createdCustomers.length} customers`);

    // Seed ports
    console.log('🚢 Seeding ports...');
    const createdPorts = await Promise.all(
      ports.map(port => prisma.portHub.create({ data: port }))
    );
    console.log(`✅ Created ${createdPorts.length} ports`);

    // Seed warehouses
    console.log('🏪 Seeding warehouses...');
    const createdWarehouses = await Promise.all(
      warehouses.map(warehouse => prisma.warehouse.create({ data: warehouse }))
    );
    console.log(`✅ Created ${createdWarehouses.length} warehouses`);

    // Seed road fleets
    console.log('🚛 Seeding road fleets...');
    const createdRoadFleets = await Promise.all(
      roadFleets.map(fleet => prisma.roadFleet.create({ data: fleet }))
    );
    console.log(`✅ Created ${createdRoadFleets.length} road fleets`);

    // Seed air cargo
    console.log('✈️ Seeding air cargo...');
    const createdAirCargos = await Promise.all(
      airCargos.map(cargo => prisma.airCargo.create({ data: cargo }))
    );
    console.log(`✅ Created ${createdAirCargos.length} air cargo flights`);

    // Seed rail cargo
    console.log('🚂 Seeding rail cargo...');
    const createdRailCargos = await Promise.all(
      railCargos.map(cargo => prisma.railCargo.create({ data: cargo }))
    );
    console.log(`✅ Created ${createdRailCargos.length} rail cargo trains`);

    // Seed disruptions
    console.log('⚠️ Seeding disruptions...');
    const createdDisruptions = await Promise.all(
      disruptions.map(disruption => prisma.disruption.create({ data: disruption }))
    );
    console.log(`✅ Created ${createdDisruptions.length} disruptions`);

    // Seed inventory with warehouse references
    console.log('📦 Seeding inventory...');
    const inventoryWithWarehouses = inventories.map((inventory, index) => ({
      ...inventory,
      warehouseId: createdWarehouses[index % createdWarehouses.length]!.id
    }));
    
    const createdInventories = await Promise.all(
      inventoryWithWarehouses.map(inventory => prisma.inventory.create({ data: inventory }))
    );
    console.log(`✅ Created ${createdInventories.length} inventory items`);

    // Create realistic shipments with routes
    console.log('📦 Creating shipments with routes...');
    const shipments = [
      {
        supplierId: createdSuppliers[0]!.id, // Tata Steel
        customerId: createdCustomers[0]!.id, // AWS
        originLocationType: 'supplier',
        destinationLocationType: 'customer',
        mode: 'multimodal',
        departureTime: new Date('2024-02-01T08:00:00Z'),
        ETA: new Date('2024-02-15T16:00:00Z'),
        status: 'in_transit',
        riskScore: 25,
        destinationLocation: 'Seattle, Washington',
        originLocation: 'Jamshedpur, India',
        routes: [
          {
            fromLocationType: 'supplier',
            toLocationType: 'port',
            sequenceNumber: 1,
            mode: 'road',
            carrierName: 'Tata Logistics',
            travelTimeEst: 8,
            costEst: 2500,
            fromLocation: 'Jamshedpur, India',
            toLocation: 'Mumbai Port'
          },
          {
            fromLocationType: 'port',
            toLocationType: 'port',
            sequenceNumber: 2,
            mode: 'sea',
            carrierName: 'Maersk Line',
            travelTimeEst: 240,
            costEst: 15000,
            fromLocation: 'Mumbai Port',
            toLocation: 'Los Angeles Port'
          },
          {
            fromLocationType: 'port',
            toLocationType: 'warehouse',
            sequenceNumber: 3,
            mode: 'road',
            carrierName: 'FedEx Ground',
            travelTimeEst: 48,
            costEst: 3500,
            fromLocation: 'Los Angeles Port',
            toLocation: 'Seattle Distribution Center'
          }
        ]
      },
      {
        supplierId: createdSuppliers[1]!.id, // Reliance
        customerId: createdCustomers[1]!.id, // Microsoft
        originLocationType: 'supplier',
        destinationLocationType: 'customer',
        mode: 'multimodal',
        departureTime: new Date('2024-02-05T10:00:00Z'),
        ETA: new Date('2024-02-20T14:00:00Z'),
        status: 'planned',
        riskScore: 15,
        destinationLocation: 'Redmond, Washington',
        originLocation: 'Mumbai, India',
        routes: [
          {
            fromLocationType: 'supplier',
            toLocationType: 'port',
            sequenceNumber: 1,
            mode: 'road',
            carrierName: 'Reliance Logistics',
            travelTimeEst: 4,
            costEst: 1200,
            fromLocation: 'Mumbai, India',
            toLocation: 'Mumbai Port'
          },
          {
            fromLocationType: 'port',
            toLocationType: 'port',
            sequenceNumber: 2,
            mode: 'sea',
            carrierName: 'MSC',
            travelTimeEst: 288,
            costEst: 18000,
            fromLocation: 'Mumbai Port',
            toLocation: 'Seattle Port'
          },
          {
            fromLocationType: 'port',
            toLocationType: 'customer',
            sequenceNumber: 3,
            mode: 'road',
            carrierName: 'UPS',
            travelTimeEst: 2,
            costEst: 800,
            fromLocation: 'Seattle Port',
            toLocation: 'Redmond, Washington'
          }
        ]
      },
      {
        supplierId: createdSuppliers[5]!.id, // Huawei
        customerId: createdCustomers[5]!.id, // Samsung
        originLocationType: 'supplier',
        destinationLocationType: 'customer',
        mode: 'multimodal',
        departureTime: new Date('2024-02-10T12:00:00Z'),
        ETA: new Date('2024-02-25T10:00:00Z'),
        status: 'delayed',
        riskScore: 45,
        destinationLocation: 'Seoul, South Korea',
        originLocation: 'Shenzhen, China',
        routes: [
          {
            fromLocationType: 'supplier',
            toLocationType: 'port',
            sequenceNumber: 1,
            mode: 'road',
            carrierName: 'Huawei Logistics',
            travelTimeEst: 6,
            costEst: 1800,
            fromLocation: 'Shenzhen, China',
            toLocation: 'Shenzhen Port'
          },
          {
            fromLocationType: 'port',
            toLocationType: 'port',
            sequenceNumber: 2,
            mode: 'sea',
            carrierName: 'COSCO Shipping',
            travelTimeEst: 168,
            costEst: 12000,
            fromLocation: 'Shenzhen Port',
            toLocation: 'Busan Port'
          },
          {
            fromLocationType: 'port',
            toLocationType: 'customer',
            sequenceNumber: 3,
            mode: 'road',
            carrierName: 'Samsung Logistics',
            travelTimeEst: 8,
            costEst: 2200,
            fromLocation: 'Busan Port',
            toLocation: 'Seoul, South Korea'
          }
        ]
      }
    ];

    // Create shipments and their routes
    for (const shipmentData of shipments) {
      const { routes, ...shipmentInfo } = shipmentData;
      
      const shipment = await prisma.shipment.create({
        data: shipmentInfo
      });

      // Create routes for this shipment
      await Promise.all(
        routes.map(route => 
          prisma.route.create({
            data: {
              ...route,
              shipmentId: shipment.id
            }
          })
        )
      );
    }

    console.log(`✅ Created ${shipments.length} shipments with routes`);

    // Create some shipment disruptions
    console.log('🔗 Creating shipment disruptions...');
    const shipmentDisruptions = [
      {
        shipmentId: '', // Will be set
        disruptionId: createdDisruptions[0]!.id, // Weather disruption
        impactDelayHours: 48,
        rerouteNeeded: true,
        extraCost: 5000
      },
      {
        shipmentId: '', // Will be set
        disruptionId: createdDisruptions[2]!.id, // Labor disruption
        impactDelayHours: 72,
        rerouteNeeded: false,
        extraCost: 3000
      }
    ];

    // Get the first shipment to associate with disruptions
    const firstShipment = await prisma.shipment.findFirst();
    if (firstShipment) {
      await Promise.all(
        shipmentDisruptions.map(disruption => 
          prisma.shipmentDisruption.create({
            data: {
              ...disruption,
              shipmentId: firstShipment.id
            }
          })
        )
      );
      console.log(`✅ Created ${shipmentDisruptions.length} shipment disruptions`);
    }

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdSuppliers.length} suppliers`);
    console.log(`- ${createdCustomers.length} customers`);
    console.log(`- ${createdPorts.length} ports`);
    console.log(`- ${createdWarehouses.length} warehouses`);
    console.log(`- ${createdRoadFleets.length} road fleets`);
    console.log(`- ${createdAirCargos.length} air cargo flights`);
    console.log(`- ${createdRailCargos.length} rail cargo trains`);
    console.log(`- ${createdDisruptions.length} disruptions`);
    console.log(`- ${createdInventories.length} inventory items`);
    console.log(`- ${shipments.length} shipments with routes`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedData };
