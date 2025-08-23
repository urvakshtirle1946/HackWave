import { Router } from "express";
import { MCPController } from "../controllers/mcpController";

const router = Router();

// Context management routes
router.post("/context", MCPController.createContext);
router.get("/context/:contextId", MCPController.getContext);
router.put("/context/:contextId", MCPController.updateContext);
router.get("/context/:contextId/history", MCPController.getContextHistory);
router.get("/contexts/type/:type", MCPController.findContextsByType);
router.get("/contexts/agent/:agentId", MCPController.findContextsByAgent);

// Agent coordination routes
router.post("/agents/register", MCPController.registerAgent);
router.get("/agents", MCPController.getAgents);
router.post("/agents/:agentId/execute", MCPController.executeAgentAction);

export default router;
