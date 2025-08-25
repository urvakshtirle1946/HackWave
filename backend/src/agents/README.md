# Vaylor Agent - Data Ingest AI Agent

A focused AI-powered data ingestion system that continuously monitors supply chain data from multiple sources, processes it using Gemini AI, and stores structured events in a PostgreSQL database.

## 🚀 Features

### Core Data Ingest Agent

- **Real-time Data Collection**: Fetches data from news, weather, and shipping APIs
- **AI-Powered Classification**: Uses Gemini to extract and classify supply chain events
- **Automatic Storage**: Stores processed events directly into your Prisma database
- **Scheduled Execution**: Runs automatically every 15 minutes (configurable)
- **Error Handling**: Robust error handling with fallback to simulated data

### Data Sources

- **News APIs**: Real-time supply chain disruption news
- **Weather APIs**: Port and route weather conditions
- **Shipping APIs**: Vessel tracking and port status
- **Simulated Data**: Fallback data when APIs are unavailable

### AI-Powered Processing

- **Gemini Pro Integration**: Advanced event classification and extraction
- **Structured Output**: Converts unstructured data into normalized events
- **Confidence Scoring**: AI-generated confidence levels for each event

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Data Ingest   │    │   Database      │
│   APIs          │───▶│   Agent         │───▶│   (Prisma)      │
│                 │    │                 │    │                 │
│ • News API      │    │ • AI Classifier │    │ • Disruptions   │
│ • Weather API   │    │ • Event Normalizer│   │ • Shipments     │
│ • Shipping API  │    │ • Data Storage  │    │ • Routes        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vaylor-agent
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/vaylor_agent"

   # Google Gemini AI API Key (Required)
   GEMINI_API_KEY="your_gemini_api_key_here"

   # Optional: External APIs for real-time data
   OPENWEATHER_API_KEY="your_openweather_api_key_here"
   NEWS_API_KEY="your_news_api_key_here"
   RAPIDAPI_KEY="your_rapidapi_key_here"

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   INGEST_INTERVAL_MINUTES=15
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📊 Data Ingest Agent

The Data Ingest Agent is the core component that continuously monitors and processes supply chain data:

### Features

- **Real-time Data Collection**: Fetches data from multiple external APIs
- **AI-Powered Classification**: Uses Gemini to classify and extract structured events
- **Automatic Storage**: Stores processed events in the database
- **Scheduled Execution**: Runs automatically every 15 minutes (configurable)

### Data Sources

- **News Articles**: Supply chain disruptions, strikes, geopolitical events
- **Weather Data**: Port conditions, storms, weather-related delays
- **Shipping Data**: Vessel tracking, port congestion, delays

### API Endpoints

```bash
# Run data ingestion once
POST /api/ingest/run

# Start scheduled ingestion
POST /api/ingest/start

# Stop scheduled ingestion
POST /api/ingest/stop

# Check ingestion status
GET /api/ingest/status

# Health check
GET /health
```

### Example Usage

```bash
# Test the data ingest agent
curl -X POST http://localhost:3000/api/ingest/run

# Check status
curl http://localhost:3000/api/ingest/status

# Start scheduled ingestion
curl -X POST http://localhost:3000/api/ingest/start
```

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini AI API key (required)
- `OPENWEATHER_API_KEY`: OpenWeather API key (optional)
- `NEWS_API_KEY`: NewsAPI key (optional)
- `INGEST_INTERVAL_MINUTES`: Data ingestion frequency (default: 15)

### Database Schema

The system uses your existing Prisma schema with:

- Suppliers, Customers, Ports, Warehouses
- Shipments, Routes, Disruptions
- Event storage and classification

## 🧪 Testing

```bash
# Test data ingestion
npm run test

# Or run manually
npx ts-node src/test-ingest.ts

# Test API endpoints
curl -X POST http://localhost:3000/api/ingest/run
```

## 🚀 Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set up production environment**

   ```bash
   NODE_ENV=production
   DATABASE_URL="your_production_db_url"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 📝 API Documentation

### Data Ingest Endpoints

- `POST /api/ingest/run` - Run data ingestion once
- `POST /api/ingest/start` - Start scheduled ingestion
- `POST /api/ingest/stop` - Stop scheduled ingestion
- `GET /api/ingest/status` - Get ingestion status
- `GET /health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Check the documentation
- Review the API endpoints
- Test with the provided examples
- Open an issue for bugs or feature requests
