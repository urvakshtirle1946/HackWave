# MCP (Model Context Protocol) Implementation

This document describes the full MCP implementation for the Supply Chain AI Agent system.

## Overview

The MCP implementation provides standardized context sharing, provenance tracking, and agent coordination across the entire supply chain management system.

## Architecture

### Backend MCP Components

#### 1. MCP Context Types (`backend/src/types/mcpContext.ts`)

- **MCPContext**: Core context object with provenance, metadata, and payload
- **MCPProvenance**: Tracks data source, operations, and transformations
- **MCPMetadata**: Schema, versioning, and security information
- **MCPRequest/Response**: Standardized request/response wrappers
- **AgentInfo**: Agent capabilities and status tracking

#### 2. MCP Context Manager (`backend/src/utils/mcpContextManager.ts`)

- Context creation, updating, and retrieval
- Provenance tracking and history management
- Context relationship management
- Hash generation for data integrity

#### 3. MCP Controller (`backend/src/controllers/mcpController.ts`)

- REST endpoints for context management
- Agent registration and coordination
- Context search and filtering capabilities

#### 4. MCP Routes (`backend/src/routes/mcpRoutes.ts`)

```
POST   /api/mcp/context              - Create new context
GET    /api/mcp/context/:id          - Get context by ID
PUT    /api/mcp/context/:id          - Update context
GET    /api/mcp/context/:id/history  - Get context history
GET    /api/mcp/contexts/type/:type  - Find contexts by type
GET    /api/mcp/contexts/agent/:id   - Find contexts by agent
POST   /api/mcp/agents/register      - Register agent
GET    /api/mcp/agents               - List agents
POST   /api/mcp/agents/:id/execute   - Execute agent action
```

### AI Agent MCP Components

#### 1. MCP Context Manager (`ai_agent/src/utils/mcpContextManager.ts`)

- Local context creation and management
- Backend integration via HTTP APIs
- Agent registration with backend
- Context synchronization

#### 2. Enhanced Base Agent (`ai_agent/src/agents/BaseAgent.ts`)

- MCP-aware agent interface
- Automatic agent registration
- Context creation and provenance tracking
- Backend communication utilities

#### 3. Updated Data Collector Agent (`ai_agent/src/agents/DataCollectorAgent.ts`)

- Replaces mock data with backend API calls
- MCP context processing
- Real-time supply chain data collection
- Context-aware data aggregation

## Key Features

### 1. Context-Aware Processing

```typescript
// Create MCP context
const context = MCPContextManager.createContext(
  "supply_chain_analysis",
  { analysisType: "risk_assessment" },
  "data_collector",
  "agent",
  "risk_analysis",
  agentId,
  agentType
);

// Process with full traceability
const result = await agent.processMCP(context);
```

### 2. Provenance Tracking

Every operation is tracked with:

- Source identification
- Timestamp and operation type
- Agent information
- Input data hash
- Confidence scores

### 3. Backend Integration

Agents now connect to real backend data:

```typescript
// Real supply chain data instead of mocks
const suppliersResponse = await axios.get(`${backendUrl}/suppliers`);
const shipmentsResponse = await axios.get(`${backendUrl}/shipments`);
const inventoryResponse = await axios.get(`${backendUrl}/inventory/low-stock`);
```

### 4. Agent Coordination

- Agents register with backend on startup
- Shared context enables collaboration
- Distributed processing with centralized coordination

## Usage Examples

### Starting MCP-Enabled Agent

```typescript
import { DataCollectorAgent } from "./agents/DataCollectorAgent";

const agent = new DataCollectorAgent();
await agent.start(); // Automatically registers with backend

// Process with MCP
const context = agent.createMCPContext(
  "data_request",
  { priority: "high" },
  "collect_all"
);
const result = await agent.processMCP(context);
```

### Backend Context Management

```typescript
// Create context via API
POST /api/mcp/context
{
  "type": "supply_chain_analysis",
  "payload": { "analysisType": "risk" },
  "source": "dashboard",
  "sourceType": "user",
  "operation": "analysis_request"
}

// Get context history
GET /api/mcp/context/{contextId}/history
```

## Benefits

### 1. **Full Traceability**

- Every decision tracked to its source
- Complete audit trail for compliance
- Context reconstruction for debugging

### 2. **Real-Time Integration**

- Live backend data instead of mocks
- Immediate updates from supply chain events
- Context-aware processing

### 3. **Agent Collaboration**

- Shared context between agents
- Coordinated multi-agent workflows
- Distributed processing capabilities

### 4. **Extensibility**

- Easy to add new agents
- Standardized integration patterns
- Version-aware context evolution

## Testing

### Backend Testing

```bash
cd backend
npm start
# Test MCP endpoints with Postman or curl
```

### AI Agent Testing

```bash
cd ai_agent
npm run build
npm start
# Run MCP test: node dist/test-mcp.js
```

### Integration Testing

1. Start backend server (port 3000)
2. Start AI agent server (port 3001)
3. Test agent registration and context sharing
4. Verify provenance tracking

## Migration Path

### Phase 1: MCP Infrastructure ✅

- [x] Backend MCP types and managers
- [x] API endpoints for context management
- [x] Agent registration system

### Phase 2: Agent Integration ✅

- [x] Enhanced BaseAgent with MCP
- [x] DataCollectorAgent backend integration
- [x] Context-aware processing

### Phase 3: Additional Agents (Next)

- [ ] RiskAssessmentAgent MCP integration
- [ ] SimulationAgent MCP support
- [ ] StrategyRecommenderAgent MCP adoption

### Phase 4: Frontend Integration (Future)

- [ ] Real-time context updates in dashboard
- [ ] Provenance visualization
- [ ] Interactive scenario testing

## Monitoring & Debugging

### Context Tracking

- All contexts stored with full provenance
- API endpoints for context history
- Agent activity monitoring

### Performance Metrics

- Execution time tracking
- Context payload sizes
- Agent response times

### Error Handling

- Structured error responses
- Context preservation on failures
- Graceful degradation strategies

## Security Considerations

### Context Security

- Classification levels (public, internal, confidential, restricted)
- Access control per context type
- Secure context transmission

### Agent Authentication

- Agent registration required
- Capability-based access control
- Audit logging for all operations

This MCP implementation provides a robust foundation for scalable, traceable, and collaborative AI agent systems in supply chain management.
