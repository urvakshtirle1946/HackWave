import {
  MCPContext,
  MCPProvenance,
  MCPMetadata,
  MCPResponse,
} from "../types/mcpContext";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export class MCPContextManager {
  private static contexts: Map<string, MCPContext> = new Map();

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

    this.contexts.set(contextId, context);
    return context;
  }

  static addProvenance(contextId: string, provenance: MCPProvenance): void {
    const context = this.contexts.get(contextId);
    if (context) {
      context.provenance.push(provenance);
      this.contexts.set(contextId, context);
    }
  }

  static getContext(contextId: string): MCPContext | undefined {
    return this.contexts.get(contextId);
  }

  static updateContext<T>(
    contextId: string,
    newPayload: T,
    source: string,
    operation: string
  ): MCPContext<T> | null {
    const context = this.contexts.get(contextId) as MCPContext<T>;
    if (!context) return null;

    const updatedProvenance: MCPProvenance = {
      source,
      sourceType: "system",
      timestamp: new Date().toISOString(),
      operation,
      inputHash: this.generateHash(newPayload),
    };

    const updatedContext: MCPContext<T> = {
      ...context,
      payload: newPayload,
      timestamp: new Date().toISOString(),
      provenance: [...context.provenance, updatedProvenance],
    };

    this.contexts.set(contextId, updatedContext);
    return updatedContext;
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

  static getContextHistory(contextId: string): MCPProvenance[] {
    const context = this.contexts.get(contextId);
    return context ? context.provenance : [];
  }

  static findContextsByType(type: string): MCPContext[] {
    return Array.from(this.contexts.values()).filter(
      (ctx) => ctx.type === type
    );
  }

  static findContextsByAgent(agentId: string): MCPContext[] {
    return Array.from(this.contexts.values()).filter((ctx) =>
      ctx.provenance.some((p) => p.agentId === agentId)
    );
  }
}
