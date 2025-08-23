import { BaseAgent } from './BaseAgent';
import { DataCollectorAgent } from './DataCollectorAgent';
import { RiskAssessmentAgent } from './RiskAssessmentAgent';
import { SimulationAgent } from './SimulationAgent';
import { StrategyRecommenderAgent } from './StrategyRecommenderAgent';
import { AgentResponse } from '../types';
import { mockShipments, mockDisruptions } from '../data/mockData';

export class AgentOrchestrator extends BaseAgent {
  private agents: Map<string, BaseAgent> = new Map();
  private workflowHistory: any[] = [];
  private isRunning: boolean = false;

  constructor(agentId: string = 'orchestrator_001') {
    super(agentId, 'Orchestrator');
    this.initializeAgents();
  }

  public getCapabilities(): string[] {
    return [
      'Multi-agent coordination',
      'Workflow management',
      'Data flow orchestration',
      'Agent communication',
      'Process automation',
      'Performance monitoring',
      'Error handling and recovery'
    ];
  }

  private initializeAgents(): void {
    // Initialize all AI agents
    this.agents.set('data_collector', new DataCollectorAgent());
    this.agents.set('risk_assessor', new RiskAssessmentAgent());
    this.agents.set('simulator', new SimulationAgent());
    this.agents.set('strategy_recommender', new StrategyRecommenderAgent());

    // Start all agents
    for (const agent of this.agents.values()) {
      agent.start();
    }
  }

  public async process(data: any): Promise<AgentResponse> {
    try {
      const { workflow, inputData } = data;
      
      if (!workflow) {
        throw new Error('No workflow specified');
      }

      const result = await this.executeWorkflow(workflow, inputData);
      
      return this.createResponse(result, 0.95);
    } catch (error) {
      console.error('Orchestration error:', error);
      return this.createResponse(
        { error: 'Orchestration failed', details: error },
        0.1
      );
    }
  }

  private async executeWorkflow(workflow: string, inputData: any): Promise<any> {
    const workflowId = `workflow_${Date.now()}`;
    const startTime = new Date();
    
    console.log(`Starting workflow: ${workflow} (ID: ${workflowId})`);

    try {
      let result: any;

      switch (workflow) {
        case 'full_risk_assessment':
          result = await this.executeFullRiskAssessment(inputData);
          break;
        case 'scenario_simulation':
          result = await this.executeScenarioSimulation(inputData);
          break;
        case 'strategic_planning':
          result = await this.executeStrategicPlanning(inputData);
          break;
        case 'real_time_monitoring':
          result = await this.executeRealTimeMonitoring(inputData);
          break;
        case 'custom_workflow':
          result = await this.executeCustomWorkflow(inputData);
          break;
        default:
          throw new Error(`Unknown workflow: ${workflow}`);
      }

      const endTime = new Date();
      const executionTime = endTime.getTime() - startTime.getTime();

      // Log workflow execution
      this.workflowHistory.push({
        workflowId,
        workflow,
        startTime,
        endTime,
        executionTime,
        status: 'completed',
        result: result ? 'success' : 'failed'
      });

      return {
        workflowId,
        workflow,
        executionTime,
        result,
        timestamp: new Date()
      };

    } catch (error) {
      const endTime = new Date();
      const executionTime = endTime.getTime() - startTime.getTime();

      // Log failed workflow
      this.workflowHistory.push({
        workflowId,
        workflow,
        startTime,
        endTime,
        executionTime,
        status: 'failed',
        error: error.message
      });

      throw error;
    }
  }

  private async executeFullRiskAssessment(inputData: any): Promise<any> {
    console.log('Executing full risk assessment workflow...');

    // Step 1: Collect real-time data
    const dataCollector = this.agents.get('data_collector') as DataCollectorAgent;
    const collectedData = await dataCollector.process({});

    // Step 2: Assess risks for all shipments
    const riskAssessor = this.agents.get('risk_assessor') as RiskAssessmentAgent;
    const riskAssessments = await riskAssessor.process({
      shipments: inputData.shipments || mockShipments,
      weatherData: collectedData.data.weather,
      newsData: collectedData.data.news,
      disruptions: inputData.disruptions || mockDisruptions
    });

    // Step 3: Generate strategic recommendations
    const strategyRecommender = this.agents.get('strategy_recommender') as StrategyRecommenderAgent;
    const recommendations = await strategyRecommender.process({
      shipments: inputData.shipments || mockShipments,
      riskAssessments: riskAssessments.data.assessments,
      simulationResults: [],
      currentPerformance: inputData.currentPerformance || {},
      optimizationGoals: inputData.optimizationGoals || {}
    });

    return {
      dataCollection: collectedData.data,
      riskAssessments: riskAssessments.data,
      strategicRecommendations: recommendations.data,
      summary: {
        totalShipments: (inputData.shipments || mockShipments).length,
        highRiskShipments: riskAssessments.data.summary.highRiskShipments,
        overallRiskLevel: riskAssessments.data.summary.riskLevel,
        totalRecommendations: recommendations.data.recommendations.summary.totalRecommendations
      }
    };
  }

  private async executeScenarioSimulation(inputData: any): Promise<any> {
    console.log('Executing scenario simulation workflow...');

    const { scenarioType, scenarioParams } = inputData;
    
    if (!scenarioType) {
      throw new Error('Scenario type is required for simulation workflow');
    }

    // Step 1: Collect current data
    const dataCollector = this.agents.get('data_collector') as DataCollectorAgent;
    const collectedData = await dataCollector.process({});

    // Step 2: Run simulation
    const simulator = this.agents.get('simulator') as SimulationAgent;
    const simulationResult = await simulator.process({
      scenarioType,
      scenarioParams,
      shipments: inputData.shipments || mockShipments
    });

    // Step 3: Assess impact on other shipments
    const riskAssessor = this.agents.get('risk_assessor') as RiskAssessmentAgent;
    const impactAssessment = await riskAssessor.process({
      shipments: inputData.shipments || mockShipments,
      weatherData: collectedData.data.weather,
      newsData: collectedData.data.news,
      disruptions: simulationResult.data.disruptions
    });

    // Step 4: Generate recommendations for the scenario
    const strategyRecommender = this.agents.get('strategy_recommender') as StrategyRecommenderAgent;
    const scenarioRecommendations = await strategyRecommender.process({
      shipments: inputData.shipments || mockShipments,
      riskAssessments: impactAssessment.data.assessments,
      simulationResults: [simulationResult.data],
      currentPerformance: inputData.currentPerformance || {},
      optimizationGoals: inputData.optimizationGoals || {}
    });

    return {
      simulation: simulationResult.data,
      impactAssessment: impactAssessment.data,
      recommendations: scenarioRecommendations.data,
      summary: {
        scenarioName: simulationResult.data.name,
        affectedShipments: simulationResult.data.affectedShipments.length,
        totalDelay: simulationResult.data.impact.totalDelay,
        totalCostIncrease: simulationResult.data.impact.totalCostIncrease,
        riskLevel: simulationResult.data.impact.riskLevel
      }
    };
  }

  private async executeStrategicPlanning(inputData: any): Promise<any> {
    console.log('Executing strategic planning workflow...');

    // Step 1: Collect comprehensive data
    const dataCollector = this.agents.get('data_collector') as DataCollectorAgent;
    const collectedData = await dataCollector.process({});

    // Step 2: Run multiple scenario simulations
    const simulator = this.agents.get('simulator') as SimulationAgent;
    const scenarios = inputData.scenarios || [
      { type: 'port_closure', params: { portId: 'port_singapore', closureDuration: 72, reason: 'technical failure' } },
      { type: 'weather_event', params: { locationId: 'port_rotterdam', eventType: 'Storm', severity: 'high', duration: 48 } },
      { type: 'geopolitical_crisis', params: { region: 'Asia', crisisType: 'Trade Dispute', severity: 'high', duration: 168 } }
    ];

    const simulationResults = [];
    for (const scenario of scenarios) {
      const result = await simulator.process({
        scenarioType: scenario.type,
        scenarioParams: scenario.params,
        shipments: inputData.shipments || mockShipments
      });
      simulationResults.push(result.data);
    }

    // Step 3: Generate comprehensive strategic recommendations
    const strategyRecommender = this.agents.get('strategy_recommender') as StrategyRecommenderAgent;
    const strategicRecommendations = await strategyRecommender.process({
      shipments: inputData.shipments || mockShipments,
      riskAssessments: [],
      simulationResults,
      currentPerformance: inputData.currentPerformance || {},
      optimizationGoals: inputData.optimizationGoals || {}
    });

    return {
      scenarios: simulationResults,
      strategicRecommendations: strategicRecommendations.data,
      summary: {
        totalScenarios: scenarios.length,
        totalRecommendations: strategicRecommendations.data.recommendations.summary.totalRecommendations,
        totalInvestment: strategicRecommendations.data.recommendations.summary.totalCost,
        expectedROI: strategicRecommendations.data.recommendations.summary.roi
      }
    };
  }

  private async executeRealTimeMonitoring(inputData: any): Promise<any> {
    console.log('Executing real-time monitoring workflow...');

    // Step 1: Collect real-time data
    const dataCollector = this.agents.get('data_collector') as DataCollectorAgent;
    const collectedData = await dataCollector.process({});

    // Step 2: Quick risk assessment
    const riskAssessor = this.agents.get('risk_assessor') as RiskAssessmentAgent;
    const riskSnapshot = await riskAssessor.process({
      shipments: inputData.shipments || mockShipments,
      weatherData: collectedData.data.weather,
      newsData: collectedData.data.news,
      disruptions: inputData.disruptions || mockDisruptions
    });

    // Step 3: Generate immediate alerts
    const alerts = this.generateAlerts(riskSnapshot.data, collectedData.data);

    return {
      timestamp: new Date(),
      dataSnapshot: collectedData.data,
      riskSnapshot: riskSnapshot.data,
      alerts,
      summary: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter((a: any) => a.severity === 'critical').length,
        highRiskShipments: riskSnapshot.data.summary.highRiskShipments
      }
    };
  }

  private async executeCustomWorkflow(inputData: any): Promise<any> {
    console.log('Executing custom workflow...');

    const { steps } = inputData;
    
    if (!steps || !Array.isArray(steps)) {
      throw new Error('Custom workflow must include steps array');
    }

    const results = [];
    
    for (const step of steps) {
      const { agent, action, data } = step;
      
      if (!this.agents.has(agent)) {
        throw new Error(`Unknown agent: ${agent}`);
      }

      const targetAgent = this.agents.get(agent)!;
      const result = await targetAgent.process(data);
      
      results.push({
        step: step.name || `Step ${results.length + 1}`,
        agent,
        action,
        result: result.data
      });
    }

    return {
      workflowType: 'custom',
      steps: results,
      summary: {
        totalSteps: steps.length,
        completedSteps: results.length,
        status: 'completed'
      }
    };
  }

  private generateAlerts(riskSnapshot: any, dataSnapshot: any): any[] {
    const alerts: any[] = [];

    // High-risk shipment alerts
    if (riskSnapshot.summary.highRiskShipments > 0) {
      alerts.push({
        id: `alert_${Date.now()}_1`,
        type: 'risk_alert',
        severity: 'high',
        title: 'High-Risk Shipments Detected',
        message: `${riskSnapshot.summary.highRiskShipments} shipments have high risk levels`,
        timestamp: new Date(),
        actionable: true
      });
    }

    // Weather alerts
    const severeWeather = dataSnapshot.weather.filter((w: any) => w.riskLevel === 'high');
    if (severeWeather.length > 0) {
      alerts.push({
        id: `alert_${Date.now()}_2`,
        type: 'weather_alert',
        severity: 'medium',
        title: 'Severe Weather Conditions',
        message: `Severe weather detected at ${severeWeather.length} locations`,
        timestamp: new Date(),
        actionable: true
      });
    }

    // Port congestion alerts
    const highCongestion = dataSnapshot.congestion.filter((c: any) => c.congestionLevel === 'high');
    if (highCongestion.length > 0) {
      alerts.push({
        id: `alert_${Date.now()}_3`,
        type: 'congestion_alert',
        severity: 'medium',
        title: 'Port Congestion Detected',
        message: `High congestion at ${highCongestion.length} ports`,
        timestamp: new Date(),
        actionable: true
      });
    }

    return alerts;
  }

  public getAgentStatus(): any {
    const status: any = {};
    
    for (const [name, agent] of this.agents) {
      status[name] = agent.getAgentInfo();
    }

    return {
      orchestrator: this.getAgentInfo(),
      agents: status,
      totalAgents: this.agents.size,
      activeAgents: Array.from(this.agents.values()).filter(a => a.getAgentInfo().isActive).length
    };
  }

  public getWorkflowHistory(): any[] {
    return this.workflowHistory;
  }

  public getAvailableWorkflows(): string[] {
    return [
      'full_risk_assessment',
      'scenario_simulation',
      'strategic_planning',
      'real_time_monitoring',
      'custom_workflow'
    ];
  }

  public stopAllAgents(): void {
    for (const agent of this.agents.values()) {
      agent.stop();
    }
    this.isRunning = false;
  }

  public startAllAgents(): void {
    for (const agent of this.agents.values()) {
      agent.start();
    }
    this.isRunning = true;
  }
}
