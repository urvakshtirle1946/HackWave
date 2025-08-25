# HackWave Backend

A comprehensive logistics and supply chain management backend system with AI-powered disruption detection and risk assessment.

## Features

- **Multi-modal Transportation**: Support for sea, air, road, and rail cargo
- **Real-time Tracking**: Shipment tracking with location updates
- **Disruption Management**: AI-powered disruption detection and mitigation
- **Risk Assessment**: Intelligent risk scoring for shipments
- **Inventory Management**: Warehouse and inventory tracking
- **API Integration**: RESTful APIs for frontend integration

## Database Schema

The system includes the following main entities:

- **Suppliers**: Manufacturing companies and suppliers
- **Customers**: End customers and buyers
- **Shipments**: Multi-route shipments with tracking
- **Routes**: Individual route segments with carriers
- **Ports**: Port hubs for sea cargo
- **Warehouses**: Distribution centers and storage facilities
- **Disruptions**: Real-time disruption tracking
- **Inventory**: Warehouse inventory management
- **Transportation**: Road fleets, air cargo, and rail cargo

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hackwave"
   PORT=3001
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Seed the Database**
   ```bash
   npm run seed
   ```
   
   This will populate the database with realistic data including:
   - 10 suppliers (Tata Steel, Reliance, Huawei, etc.)
   - 10 customers (AWS, Microsoft, Apple, etc.)
   - 10 ports (Mumbai, Shanghai, Los Angeles, etc.)
   - 10 warehouses (Distribution centers worldwide)
   - 8 road fleets with drivers
   - 5 air cargo flights
   - 5 rail cargo trains
   - 4 active disruptions
   - 5 inventory items
   - 3 complete shipments with multi-route tracking

### Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Mode**
   ```bash
   npm run build
   npm start
   ```

3. **Database Studio** (for data visualization)
   ```bash
   npm run db:studio
   ```

## API Endpoints

### Shipments
- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create new shipment
- `GET /api/shipments/:id` - Get shipment by ID
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create new route
- `GET /api/routes/:id` - Get route by ID

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer

### Disruptions
- `GET /api/disruptions` - Get all disruptions
- `POST /api/disruptions` - Create new disruption

### Ports
- `GET /api/ports` - Get all ports
- `POST /api/ports` - Create new port

### Warehouses
- `GET /api/warehouses` - Get all warehouses
- `POST /api/warehouses` - Create new warehouse

## Data Seeder

The data seeder creates realistic logistics data:

### Suppliers
- **Tata Steel Limited** (India) - Steel Manufacturing
- **Reliance Industries** (India) - Petrochemicals
- **Infosys Technologies** (India) - Information Technology
- **Huawei Technologies** (China) - Telecommunications
- **Alibaba Group** (China) - E-commerce
- And 5 more...

### Customers
- **Amazon Web Services** (USA) - Cloud Computing
- **Microsoft Corporation** (USA) - Software
- **Apple Inc.** (USA) - Consumer Electronics
- **Samsung Electronics** (South Korea) - Electronics
- **Toyota Motor Corporation** (Japan) - Automotive
- And 5 more...

### Sample Shipments
1. **Tata Steel → AWS**: Jamshedpur → Seattle (3 routes)
2. **Reliance → Microsoft**: Mumbai → Redmond (3 routes)
3. **Huawei → Samsung**: Shenzhen → Seoul (3 routes)

Each shipment includes:
- Multi-modal routes (road → sea → road)
- Realistic carriers (Maersk, MSC, FedEx, etc.)
- Accurate travel times and costs
- Risk assessments

## AI Agents

The system includes AI agents for:
- **Disruption Detection**: Real-time monitoring of potential disruptions
- **Risk Assessment**: Intelligent risk scoring based on multiple factors
- **Route Optimization**: Finding optimal routes considering disruptions
- **Predictive Analytics**: Forecasting delays and costs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
