import { AgentResponse } from "../types";
import {
  MCPContext,
  MCPResponse,
  AgentInfo,
  AgentCapability,
} from "../types/mcpContext";
import { MCPContextManager } from "../utils/mcpContextManager";

export abstract class BaseAgent {
  protected agentId: string;
  protected agentType: string;
  protected isActive: boolean = false;
  protected version: string = "1.0.0";

  constructor(agentId: string, agentType: string) {
    this.agentId = agentId;
    this.agentType = agentType;
  }

  public getAgentInfo(): AgentInfo {
    return {
      id: this.agentId,
      type: this.agentType,
      version: this.version,
      status: this.isActive ? "active" : "inactive",
      capabilities: this.getCapabilities(),
      lastActivity: new Date().toISOString(),
    };
  }

  public async start(): Promise<void> {
    this.isActive = true;
    console.log(`Agent ${this.agentId} (${this.agentType}) started`);

    // Register with backend
    try {
      await MCPContextManager.registerAgent(this.getAgentInfo());
      console.log(`Agent ${this.agentId} registered with backend`);
    } catch (error) {
      console.error(`Failed to register agent ${this.agentId}:`, error);
    }
  }

  public stop(): void {
    this.isActive = false;
    console.log(`Agent ${this.agentId} (${this.agentType}) stopped`);
  }

  protected createResponse(data: any, confidence: number = 0.8): AgentResponse {
    return {
      agentId: this.agentId,
      agentType: this.agentType,
      timestamp: new Date(),
      data,
      confidence,
    };
  }

  protected createMCPContext<T>(
    type: string,
    payload: T,
    operation: string,
    parentContextId?: string
  ): MCPContext<T> {
    return MCPContextManager.createContext(
      type,
      payload,
      this.agentId,
      "agent",
      operation,
      this.agentId,
      this.agentType,
      parentContextId
    );
  }

  protected addProvenance(
    context: MCPContext,
    operation: string,
    confidence?: number
  ): MCPContext {
    return MCPContextManager.addProvenance(context, {
      source: this.agentId,
      sourceType: "agent",
      timestamp: new Date().toISOString(),
      agentId: this.agentId,
      agentType: this.agentType,
      operation,
      confidence,
    });
  }

  protected async sendToBackend<T>(
    context: MCPContext<T>
  ): Promise<MCPResponse<T>> {
    return MCPContextManager.sendToBackend(context);
  }

  // Abstract methods
  abstract process(data: any): Promise<AgentResponse>;
  abstract processMCP<T>(context: MCPContext<T>): Promise<MCPResponse<T>>;
  abstract getCapabilities(): AgentCapability[];
}
