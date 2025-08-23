import {
  MCPContext,
  MCPProvenance,
  MCPMetadata,
  MCPResponse,
} from "../types/mcpContext";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import axios from "axios";

export class MCPContextManager {
  private static backendUrl =
    process.env.BACKEND_URL || "http://localhost:3000/api";

  static createContext<T>(
    type: string,
    payload: T,
    source: string,
    sourceType: MCPProvenance["sourceType"],
    operation: string,
    agentId?: string,
    agentType?: string,
    parentContextId?: string
  ): MCPContext<T> {
    const contextId = uuidv4();
    const timestamp = new Date().toISOString();

    const provenance: MCPProvenance = {
      source,
      sourceType,
      timestamp,
      operation,
      inputHash: this.generateHash(payload),
      ...(agentId && { agentId }),
      ...(agentType && { agentType }),
      ...(parentContextId && { parentContextId }),
    };

    const metadata: MCPMetadata = {
      version: "1.0.0",
      schema: `mcp://${type}`,
      tags: [type, operation],
      priority: "medium",
      security: {
        classification: "internal",
      },
    };

    const context: MCPContext<T> = {
      id: contextId,
      type,
      timestamp,
      version: "1.0.0",
      provenance: [provenance],
      metadata,
      payload,
      ...(parentContextId && { relationships: { parent: parentContextId } }),
    };

    return context;
  }

  static addProvenance(
    context: MCPContext,
    provenance: MCPProvenance
  ): MCPContext {
    return {
      ...context,
      provenance: [...context.provenance, provenance],
      timestamp: new Date().toISOString(),
    };
  }

  static createResponse<T>(
    context: MCPContext<T>,
    success: boolean,
    error?: any,
    executionTime?: number
  ): MCPResponse<T> {
    return {
      context,
      success,
      ...(error && { error }),
      ...(executionTime && { executionTime }),
    };
  }

  private static generateHash(data: any): string {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
  }

  // Backend integration methods
  static async sendToBackend<T>(
    context: MCPContext<T>
  ): Promise<MCPResponse<T>> {
    try {
      const response = await axios.post(`${this.backendUrl}/mcp/context`, {
        type: context.type,
        payload: context.payload,
        source: "ai_agent",
        sourceType: "agent",
        operation: "create_context",
        agentId: context.provenance[0]?.agentId,
        agentType: context.provenance[0]?.agentType,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to send context to backend:", error);
      throw error;
    }
  }

  static async getFromBackend(contextId: string): Promise<MCPResponse<any>> {
    try {
      const response = await axios.get(
        `${this.backendUrl}/mcp/context/${contextId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get context from backend:", error);
      throw error;
    }
  }

  static async updateBackend<T>(
    contextId: string,
    newPayload: T,
    source: string,
    operation: string
  ): Promise<MCPResponse<T>> {
    try {
      const response = await axios.put(
        `${this.backendUrl}/mcp/context/${contextId}`,
        {
          payload: newPayload,
          source,
          operation,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update context in backend:", error);
      throw error;
    }
  }

  static async registerAgent(agentInfo: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.backendUrl}/mcp/agents/register`,
        agentInfo
      );
      return response.data;
    } catch (error) {
      console.error("Failed to register agent with backend:", error);
      throw error;
    }
  }

  static async executeAgentAction(
    agentId: string,
    mcpRequest: any
  ): Promise<MCPResponse<any>> {
    try {
      const response = await axios.post(
        `${this.backendUrl}/mcp/agents/${agentId}/execute`,
        mcpRequest
      );
      return response.data;
    } catch (error) {
      console.error("Failed to execute agent action:", error);
      throw error;
    }
  }
}
