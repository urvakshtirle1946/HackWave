export interface MCPProvenance {
  source: string;
  sourceType: "user" | "agent" | "system" | "external_api";
  timestamp: string;
  agentId?: string;
  agentType?: string;
  operation: string;
  inputHash?: string;
  confidence?: number;
  parentContextId?: string;
  metadata?: Record<string, any>;
}

export interface MCPMetadata {
  version: string;
  schema: string;
  tags?: string[];
  priority?: "low" | "medium" | "high" | "critical";
  ttl?: number; // time to live in seconds
  security?: {
    classification: "public" | "internal" | "confidential" | "restricted";
    access_control?: string[];
  };
}

export interface MCPContext<T = any> {
  id: string;
  type: string;
  timestamp: string;
  version: string;
  provenance: MCPProvenance[];
  metadata: MCPMetadata;
  payload: T;
  relationships?: {
    parent?: string;
    children?: string[];
    dependencies?: string[];
  };
}

export interface MCPRequest<T = any> {
  context: MCPContext<T>;
  operation: string;
  parameters?: Record<string, any>;
}

export interface MCPResponse<T = any> {
  context: MCPContext<T>;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  executionTime?: number;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  parameters?: Record<string, any>;
}

export interface AgentInfo {
  id: string;
  type: string;
  version: string;
  status: "active" | "inactive" | "busy" | "error";
  capabilities: AgentCapability[];
  lastActivity?: string;
  metadata?: Record<string, any>;
}
