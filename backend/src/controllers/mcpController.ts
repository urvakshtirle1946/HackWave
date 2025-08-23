import { Request, Response } from "express";
import {
  MCPContext,
  MCPRequest,
  MCPResponse,
  AgentInfo,
} from "../types/mcpContext";
import { MCPContextManager } from "../utils/mcpContextManager";

export class MCPController {
  // Context management endpoints
  static async createContext(req: Request, res: Response) {
    try {
      const {
        type,
        payload,
        source,
        sourceType,
        operation,
        agentId,
        agentType,
        parentContextId,
      } = req.body;

      const context = MCPContextManager.createContext(
        type,
        payload,
        source,
        sourceType,
        operation,
        agentId,
        agentType,
        parentContextId
      );

      const response = MCPContextManager.createResponse(context, true);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "CONTEXT_CREATION_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getContext(req: Request, res: Response) {
    try {
      const { contextId } = req.params;
      if (!contextId) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_CONTEXT_ID",
            message: "Context ID is required",
          },
        });
      }

      const context = MCPContextManager.getContext(contextId);

      if (!context) {
        return res.status(404).json({
          success: false,
          error: { code: "CONTEXT_NOT_FOUND", message: "Context not found" },
        });
      }

      const response = MCPContextManager.createResponse(context, true);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "CONTEXT_RETRIEVAL_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async updateContext(req: Request, res: Response) {
    try {
      const { contextId } = req.params;
      if (!contextId) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_CONTEXT_ID",
            message: "Context ID is required",
          },
        });
      }

      const { payload, source, operation } = req.body;

      const updatedContext = MCPContextManager.updateContext(
        contextId,
        payload,
        source,
        operation
      );

      if (!updatedContext) {
        return res.status(404).json({
          success: false,
          error: { code: "CONTEXT_NOT_FOUND", message: "Context not found" },
        });
      }

      const response = MCPContextManager.createResponse(updatedContext, true);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "CONTEXT_UPDATE_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getContextHistory(req: Request, res: Response) {
    try {
      const { contextId } = req.params;
      if (!contextId) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_CONTEXT_ID",
            message: "Context ID is required",
          },
        });
      }

      const history = MCPContextManager.getContextHistory(contextId);

      res.json({
        success: true,
        contextId,
        history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "HISTORY_RETRIEVAL_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async findContextsByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (!type) {
        return res.status(400).json({
          success: false,
          error: { code: "MISSING_TYPE", message: "Type is required" },
        });
      }

      const contexts = MCPContextManager.findContextsByType(type);

      res.json({
        success: true,
        type,
        contexts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "CONTEXT_SEARCH_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async findContextsByAgent(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      if (!agentId) {
        return res.status(400).json({
          success: false,
          error: { code: "MISSING_AGENT_ID", message: "Agent ID is required" },
        });
      }

      const contexts = MCPContextManager.findContextsByAgent(agentId);

      res.json({
        success: true,
        agentId,
        contexts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "AGENT_CONTEXT_SEARCH_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  // Agent coordination endpoints
  private static agents: Map<string, AgentInfo> = new Map();

  static async registerAgent(req: Request, res: Response) {
    try {
      const agentInfo: AgentInfo = req.body;

      this.agents.set(agentInfo.id, {
        ...agentInfo,
        lastActivity: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: "Agent registered successfully",
        agentId: agentInfo.id,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "AGENT_REGISTRATION_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getAgents(req: Request, res: Response) {
    try {
      const agents = Array.from(this.agents.values());
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
  }

  static async executeAgentAction(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      if (!agentId) {
        return res.status(400).json({
          success: false,
          error: { code: "MISSING_AGENT_ID", message: "Agent ID is required" },
        });
      }

      const mcpRequest: MCPRequest = req.body;

      const agent = this.agents.get(agentId);
      if (!agent) {
        return res.status(404).json({
          success: false,
          error: { code: "AGENT_NOT_FOUND", message: "Agent not found" },
        });
      }

      // Update agent last activity
      agent.lastActivity = new Date().toISOString();
      this.agents.set(agentId, agent);

      // Add provenance for agent action
      MCPContextManager.addProvenance(mcpRequest.context.id, {
        source: "backend",
        sourceType: "system",
        timestamp: new Date().toISOString(),
        operation: mcpRequest.operation,
        agentId,
        agentType: agent.type,
      });

      // In a real implementation, you would forward this to the actual agent
      // For now, we'll just return the context with updated provenance
      const updatedContext = MCPContextManager.getContext(
        mcpRequest.context.id
      );
      if (!updatedContext) {
        return res.status(404).json({
          success: false,
          error: { code: "CONTEXT_NOT_FOUND", message: "Context not found" },
        });
      }

      const response = MCPContextManager.createResponse(updatedContext, true);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: "AGENT_ACTION_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
}
