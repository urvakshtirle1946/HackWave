import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AgentOrchestrator } from "./agents/AgentOrchestrator";
import { DataCollectorAgent } from "./agents/DataCollectorAgent";
import { MCPContextManager } from "./utils/mcpContextManager";
import { mockShipments, mockLocations, mockDisruptions } from "./data/mockData";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Use different port from backend

// Initialize the AI agent orchestrator and individual agents
const orchestrator = new AgentOrchestrator();
const dataCollector = new DataCollectorAgent();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Supply Chain AI Agents",
    version: "1.0.0",
    mcpEnabled: true,
  });
});

// MCP Endpoints
app.post("/mcp/process", async (req, res) => {
  try {
    const { agentType, context } = req.body;

    let result;
    switch (agentType) {
      case "DataCollector":
        result = await dataCollector.processMCP(context);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: { code: "UNKNOWN_AGENT_TYPE", message: "Unknown agent type" },
        });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "MCP_PROCESSING_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
});

app.get("/mcp/agents", async (req, res) => {
  try {
    const agents = [dataCollector.getAgentInfo()];
    res.json({
      success: true,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "AGENT_LIST_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
});

// Agent status endpoint
app.get("/api/agents/status", (req, res) => {
  try {
    const status = orchestrator.getAgentStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get agent status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get available workflows
app.get("/api/workflows", (req, res) => {
  try {
    const workflows = orchestrator.getAvailableWorkflows();
    res.json({
      success: true,
      data: workflows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get workflows",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Execute workflow endpoint
app.post("/api/workflows/execute", async (req, res) => {
  try {
    const { workflow, inputData } = req.body;

    if (!workflow) {
      return res.status(400).json({
        success: false,
        error: "Workflow parameter is required",
      });
    }

    const result = await orchestrator.process({ workflow, inputData });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Workflow execution failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get mock data endpoints
app.get("/api/data/shipments", (req, res) => {
  res.json({
    success: true,
    data: mockShipments,
  });
});

app.get("/api/data/locations", (req, res) => {
  res.json({
    success: true,
    data: mockLocations,
  });
});

app.get("/api/data/disruptions", (req, res) => {
  res.json({
    success: true,
    data: mockDisruptions,
  });
});

// Risk assessment endpoint
app.post("/api/risk-assessment", async (req, res) => {
  try {
    const result = await orchestrator.process({
      workflow: "full_risk_assessment",
      inputData: req.body,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Risk assessment failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Scenario simulation endpoint
app.post("/api/simulation", async (req, res) => {
  try {
    const { scenarioType, scenarioParams } = req.body;

    if (!scenarioType) {
      return res.status(400).json({
        success: false,
        error: "Scenario type is required",
      });
    }

    const result = await orchestrator.process({
      workflow: "scenario_simulation",
      inputData: { scenarioType, scenarioParams },
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Simulation failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Strategic planning endpoint
app.post("/api/strategic-planning", async (req, res) => {
  try {
    const result = await orchestrator.process({
      workflow: "strategic_planning",
      inputData: req.body,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Strategic planning failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Real-time monitoring endpoint
app.get("/api/monitoring", async (req, res) => {
  try {
    const result = await orchestrator.process({
      workflow: "real_time_monitoring",
      inputData: {},
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Monitoring failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Custom workflow endpoint
app.post("/api/custom-workflow", async (req, res) => {
  try {
    const { steps } = req.body;

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({
        success: false,
        error: "Steps array is required for custom workflow",
      });
    }

    const result = await orchestrator.process({
      workflow: "custom_workflow",
      inputData: { steps },
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Custom workflow failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get workflow history
app.get("/api/workflows/history", (req, res) => {
  try {
    const history = orchestrator.getWorkflowHistory();
    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get workflow history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Agent control endpoints
app.post("/api/agents/start", (req, res) => {
  try {
    orchestrator.startAllAgents();
    res.json({
      success: true,
      message: "All agents started successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to start agents",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/agents/stop", (req, res) => {
  try {
    orchestrator.stopAllAgents();
    res.json({
      success: true,
      message: "All agents stopped successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to stop agents",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /health",
      "GET /api/agents/status",
      "GET /api/workflows",
      "POST /api/workflows/execute",
      "GET /api/data/shipments",
      "GET /api/data/locations",
      "GET /api/data/disruptions",
      "POST /api/risk-assessment",
      "POST /api/simulation",
      "POST /api/strategic-planning",
      "GET /api/monitoring",
      "POST /api/custom-workflow",
      "GET /api/workflows/history",
      "POST /api/agents/start",
      "POST /api/agents/stop",
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Supply Chain AI Agents Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 API documentation: http://localhost:${PORT}/api/workflows`);
  console.log(`🤖 Agent status: http://localhost:${PORT}/api/agents/status`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...");
  orchestrator.stopAllAgents();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down gracefully...");
  orchestrator.stopAllAgents();
  process.exit(0);
});

export default app;
