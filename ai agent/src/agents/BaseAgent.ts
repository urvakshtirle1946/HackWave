import { AgentResponse } from '../types';

export abstract class BaseAgent {
  protected agentId: string;
  protected agentType: string;
  protected isActive: boolean = false;

  constructor(agentId: string, agentType: string) {
    this.agentId = agentId;
    this.agentType = agentType;
  }

  public getAgentInfo() {
    return {
      id: this.agentId,
      type: this.agentType,
      isActive: this.isActive
    };
  }

  public start(): void {
    this.isActive = true;
    console.log(`Agent ${this.agentId} (${this.agentType}) started`);
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
      confidence
    };
  }

  abstract process(data: any): Promise<AgentResponse>;
  abstract getCapabilities(): string[];
}
