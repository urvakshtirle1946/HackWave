# 🚀 Supply Chain AI Agents System

A sophisticated multi-agent AI system for supply chain risk assessment, simulation, and strategic planning built with **LangChain**, **Node.js**, **Express**, and **TypeScript**.

## 🌟 Features

### 🤖 AI Agents
- **Data Collector Agent**: Real-time data collection from weather APIs, news sources, and port congestion data
- **Risk Assessment Agent**: Multi-factor risk analysis (weather, geopolitical, technical, congestion, customs)
- **Simulation Agent**: What-if scenario analysis for supply chain disruptions
- **Strategy Recommender Agent**: AI-powered recommendations for optimization and risk mitigation
- **Agent Orchestrator**: Coordinates all agents and manages complex workflows

### 🔄 Workflows
- **Full Risk Assessment**: Comprehensive risk analysis of all shipments
- **Scenario Simulation**: Port closures, weather events, geopolitical crises
- **Strategic Planning**: Long-term planning with multiple scenario analysis
- **Real-time Monitoring**: Continuous monitoring with instant alerts
- **Custom Workflows**: Flexible, user-defined agent workflows

### 📊 Capabilities
- Real-time risk scoring and categorization
- Alternative route and supplier recommendations
- Cost-benefit analysis and ROI calculations
- Priority-based action recommendations
- Comprehensive reporting and analytics

## 🛠️ Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **AI Framework**: LangChain
- **Data Sources**: Mock data + Real-time API integrations (weather, news, port data)
- **Architecture**: Multi-agent system with orchestration
- **API**: RESTful API with comprehensive endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional, for enhanced AI capabilities)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd supply-chain-ai-agents
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
```
Edit `.env` file with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
NEWS_API_KEY=your_news_api_key_here
PORT=3000
```

4. **Build the project**
```bash
npm run build
```

5. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📡 API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api/agents/status` - Agent status and capabilities

### Workflows
- `GET /api/workflows` - Available workflows
- `POST /api/workflows/execute` - Execute any workflow
- `GET /api/workflows/history` - Workflow execution history

### Core Operations
- `POST /api/risk-assessment` - Full risk assessment
- `POST /api/simulation` - Run scenario simulations
- `POST /api/strategic-planning` - Strategic planning analysis
- `GET /api/monitoring` - Real-time monitoring

### Data Access
- `GET /api/data/shipments` - Mock shipment data
- `GET /api/data/locations` - Mock location data
- `GET /api/data/disruptions` - Mock disruption data

### Agent Control
- `POST /api/agents/start` - Start all agents
- `POST /api/agents/stop` - Stop all agents

## 🔧 Usage Examples

### 1. Risk Assessment
```bash
curl -X POST http://localhost:3000/api/risk-assessment \
  -H "Content-Type: application/json" \
  -d '{
    "shipments": [],
    "disruptions": [],
    "currentPerformance": {},
    "optimizationGoals": {}
  }'
```

### 2. Scenario Simulation
```bash
curl -X POST http://localhost:3000/api/simulation \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioType": "port_closure",
    "scenarioParams": {
      "portId": "port_singapore",
      "closureDuration": 72,
      "reason": "technical failure"
    }
  }'
```

### 3. Strategic Planning
```bash
curl -X POST http://localhost:3000/api/strategic-planning \
  -H "Content-Type: application/json" \
  -d '{
    "scenarios": [
      {
        "type": "port_closure",
        "params": {
          "portId": "port_singapore",
          "closureDuration": 72,
          "reason": "technical failure"
        }
      }
    ]
  }'
```

## 🏗️ Architecture

### Agent System
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Data Collector  │    │ Risk Assessment │    │   Simulation    │
│     Agent       │    │     Agent       │    │     Agent       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Orchestrator  │
                    │     Agent       │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Strategy      │
                    │ Recommender     │
                    │     Agent       │
                    └─────────────────┘
```

### Data Flow
1. **Data Collection** → Weather, news, port congestion
2. **Risk Assessment** → Multi-factor analysis
3. **Simulation** → What-if scenarios
4. **Strategy** → AI-powered recommendations
5. **Orchestration** → Coordinated workflow execution

## 📁 Project Structure

```
src/
├── agents/                 # AI agent implementations
│   ├── BaseAgent.ts       # Base agent class
│   ├── DataCollectorAgent.ts
│   ├── RiskAssessmentAgent.ts
│   ├── SimulationAgent.ts
│   ├── StrategyRecommenderAgent.ts
│   └── AgentOrchestrator.ts
├── data/                  # Mock data and data utilities
│   └── mockData.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
└── server.ts              # Express server and API endpoints
```

## 🔍 Mock Data

The system includes comprehensive mock data for demonstration:

- **5 Shipments** with different routes and priorities
- **10 Locations** including ports, suppliers, and customers
- **3 Disruptions** (weather, geopolitical, congestion)
- **Real-time weather simulation** for all locations
- **News data** for geopolitical risk assessment

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
npm test
```

## 📈 Performance

- **Response Time**: < 2 seconds for complex workflows
- **Concurrent Requests**: Supports multiple simultaneous workflows
- **Memory Usage**: Efficient agent lifecycle management
- **Scalability**: Horizontal scaling ready with agent pools

## 🔮 Future Enhancements

- **Real-time APIs**: Integration with AIS ship tracking, flight APIs
- **Machine Learning**: Predictive analytics and pattern recognition
- **Blockchain**: Supply chain transparency and traceability
- **IoT Integration**: Real-time sensor data from containers and vessels
- **Advanced AI**: LLM integration for natural language queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Check the API documentation at `/api/workflows`
- Review the agent status at `/api/agents/status`

## 🎯 Use Cases

- **Logistics Companies**: Route optimization and risk management
- **Manufacturers**: Supplier diversification and contingency planning
- **Retailers**: Inventory optimization and delivery risk assessment
- **Ports**: Congestion management and capacity planning
- **Insurance**: Risk assessment and premium calculation

---

**Built with ❤️ using LangChain, Node.js, and TypeScript**
