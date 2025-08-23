import { BaseAgent } from './BaseAgent';
import { AgentResponse, Shipment, SimulationScenario, Disruption, RiskAssessment } from '../types';
import { mockShipments, mockLocations } from '../data/mockData';

export class SimulationAgent extends BaseAgent {
  private scenarioTemplates: Map<string, any> = new Map();

  constructor(agentId: string = 'simulation_agent_001') {
    super(agentId, 'Simulation');
    this.initializeScenarioTemplates();
  }

  public getCapabilities(): string[] {
    return [
      'What-if scenario analysis',
      'Disruption impact simulation',
      'Port closure scenarios',
      'Weather event simulations',
      'Geopolitical risk scenarios',
      'Cost and delay impact calculations',
      'Alternative strategy evaluation'
    ];
  }

  public async process(data: any): Promise<AgentResponse> {
    try {
      const { scenarioType, scenarioParams, shipments } = data;
      
      let simulationResult: SimulationScenario;
      
      switch (scenarioType) {
        case 'port_closure':
          simulationResult = await this.simulatePortClosure(scenarioParams, shipments);
          break;
        case 'weather_event':
          simulationResult = await this.simulateWeatherEvent(scenarioParams, shipments);
          break;
        case 'geopolitical_crisis':
          simulationResult = await this.simulateGeopoliticalCrisis(scenarioParams, shipments);
          break;
        case 'custom':
          simulationResult = await this.simulateCustomScenario(scenarioParams, shipments);
          break;
        default:
          throw new Error(`Unknown scenario type: ${scenarioType}`);
      }

      return this.createResponse(simulationResult, 0.9);
    } catch (error) {
      console.error('Simulation error:', error);
      return this.createResponse(
        { error: 'Simulation failed', details: error },
        0.1
      );
    }
  }

  private initializeScenarioTemplates(): void {
    // Port closure scenarios
    this.scenarioTemplates.set('port_singapore_closure', {
      name: 'Port of Singapore Closure',
      description: 'Simulation of complete closure of Port of Singapore due to major incident',
      disruptions: [{
        id: 'sim_disruption_001',
        type: 'technical' as const,
        severity: 'critical' as const,
        description: 'Port of Singapore completely closed due to major infrastructure failure',
        location: 'port_singapore',
        startDate: new Date(),
        impact: {
          delayHours: 168, // 1 week
          costIncrease: 50000,
          probability: 0.9
        }
      }]
    });

    // Weather event scenarios
    this.scenarioTemplates.set('tropical_storm_singapore', {
      name: 'Tropical Storm in Singapore',
      description: 'Simulation of severe tropical storm affecting Singapore port operations',
      disruptions: [{
        id: 'sim_disruption_002',
        type: 'weather' as const,
        severity: 'high' as const,
        description: 'Tropical storm causing 48-hour port closure and route delays',
        location: 'port_singapore',
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        impact: {
          delayHours: 48,
          costIncrease: 25000,
          probability: 0.8
        }
      }]
    });

    // Geopolitical crisis scenarios
    this.scenarioTemplates.set('trade_war_escalation', {
      name: 'Trade War Escalation',
      description: 'Simulation of escalated trade tensions affecting China-US routes',
      disruptions: [{
        id: 'sim_disruption_003',
        type: 'geopolitical' as const,
        severity: 'high' as const,
        description: 'Escalated trade tensions causing route restrictions and delays',
        location: 'port_shanghai',
        startDate: new Date(),
        impact: {
          delayHours: 72,
          costIncrease: 40000,
          probability: 0.7
        }
      }]
    });
  }

  private async simulatePortClosure(params: any, shipments: Shipment[]): Promise<SimulationScenario> {
    const { portId, closureDuration, reason } = params;
    const port = mockLocations.find(loc => loc.id === portId);
    
    if (!port) {
      throw new Error(`Port not found: ${portId}`);
    }

    const disruption: Disruption = {
      id: `sim_port_closure_${Date.now()}`,
      type: 'technical',
      severity: 'critical',
      description: `Port of ${port.name} closed due to ${reason || 'technical issues'}`,
      location: portId,
      startDate: new Date(),
      endDate: new Date(Date.now() + closureDuration * 60 * 60 * 1000), // Convert hours to milliseconds
      impact: {
        delayHours: closureDuration,
        costIncrease: closureDuration * 1000, // $1000 per hour
        probability: 0.95
      }
    };

    const affectedShipments = this.findAffectedShipments(shipments, [disruption]);
    const impact = this.calculateScenarioImpact(affectedShipments, [disruption]);

    const recommendations = this.generateScenarioRecommendations(disruption, affectedShipments);

    return {
      id: `scenario_${Date.now()}`,
      name: `Port Closure: ${port.name}`,
      description: `Simulation of ${port.name} closure for ${closureDuration} hours due to ${reason || 'technical issues'}`,
      disruptions: [disruption],
      affectedShipments: affectedShipments.map(s => s.id),
      impact,
      recommendations
    };
  }

  private async simulateWeatherEvent(params: any, shipments: Shipment[]): Promise<SimulationScenario> {
    const { locationId, eventType, severity, duration } = params;
    const location = mockLocations.find(loc => loc.id === locationId);
    
    if (!location) {
      throw new Error(`Location not found: ${locationId}`);
    }

    const disruption: Disruption = {
      id: `sim_weather_${Date.now()}`,
      type: 'weather',
      severity: severity || 'high',
      description: `${eventType} affecting operations at ${location.name}`,
      location: locationId,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 60 * 60 * 1000),
      impact: {
        delayHours: duration,
        costIncrease: duration * 500, // $500 per hour
        probability: 0.8
      }
    };

    const affectedShipments = this.findAffectedShipments(shipments, [disruption]);
    const impact = this.calculateScenarioImpact(affectedShipments, [disruption]);

    const recommendations = this.generateScenarioRecommendations(disruption, affectedShipments);

    return {
      id: `scenario_${Date.now()}`,
      name: `Weather Event: ${eventType} at ${location.name}`,
      description: `Simulation of ${eventType} affecting ${location.name} for ${duration} hours`,
      disruptions: [disruption],
      affectedShipments: affectedShipments.map(s => s.id),
      impact,
      recommendations
    };
  }

  private async simulateGeopoliticalCrisis(params: any, shipments: Shipment[]): Promise<SimulationScenario> {
    const { region, crisisType, severity, duration } = params;
    
    const locationsInRegion = mockLocations.filter(loc => loc.region === region);
    
    const disruptions: Disruption[] = locationsInRegion.map(location => ({
      id: `sim_geopolitical_${Date.now()}_${location.id}`,
      type: 'geopolitical',
      severity: severity || 'high',
      description: `${crisisType} affecting operations in ${region} region`,
      location: location.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 60 * 60 * 1000),
      impact: {
        delayHours: duration,
        costIncrease: duration * 800, // $800 per hour
        probability: 0.7
      }
    }));

    const affectedShipments = this.findAffectedShipments(shipments, disruptions);
    const impact = this.calculateScenarioImpact(affectedShipments, disruptions);

    const recommendations = this.generateScenarioRecommendations(disruptions[0], affectedShipments);

    return {
      id: `scenario_${Date.now()}`,
      name: `Geopolitical Crisis: ${crisisType} in ${region}`,
      description: `Simulation of ${crisisType} affecting ${region} region for ${duration} hours`,
      disruptions,
      affectedShipments: affectedShipments.map(s => s.id),
      impact,
      recommendations
    };
  }

  private async simulateCustomScenario(params: any, shipments: Shipment[]): Promise<SimulationScenario> {
    const { name, description, disruptions: customDisruptions } = params;
    
    if (!customDisruptions || !Array.isArray(customDisruptions)) {
      throw new Error('Custom scenario must include disruptions array');
    }

    const affectedShipments = this.findAffectedShipments(shipments, customDisruptions);
    const impact = this.calculateScenarioImpact(affectedShipments, customDisruptions);

    const recommendations = this.generateScenarioRecommendations(customDisruptions[0], affectedShipments);

    return {
      id: `scenario_${Date.now()}`,
      name: name || 'Custom Scenario',
      description: description || 'Custom simulation scenario',
      disruptions: customDisruptions,
      affectedShipments: affectedShipments.map(s => s.id),
      impact,
      recommendations
    };
  }

  private findAffectedShipments(shipments: Shipment[], disruptions: Disruption[]): Shipment[] {
    const affectedShipments: Shipment[] = [];
    
    for (const shipment of shipments) {
      for (const disruption of disruptions) {
        if (shipment.route.includes(disruption.location)) {
          affectedShipments.push(shipment);
          break;
        }
      }
    }

    return affectedShipments;
  }

  private calculateScenarioImpact(affectedShipments: Shipment[], disruptions: Disruption[]): any {
    let totalDelay = 0;
    let totalCostIncrease = 0;
    let maxRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    for (const disruption of disruptions) {
      totalDelay += disruption.impact.delayHours;
      totalCostIncrease += disruption.impact.costIncrease;
      
      // Determine highest risk level
      if (disruption.severity === 'critical' || maxRiskLevel === 'critical') {
        maxRiskLevel = 'critical';
      } else if (disruption.severity === 'high' || maxRiskLevel === 'high') {
        maxRiskLevel = 'high';
      } else if (disruption.severity === 'medium' || maxRiskLevel === 'medium') {
        maxRiskLevel = 'medium';
      }
    }

    return {
      totalDelay,
      totalCostIncrease,
      riskLevel: maxRiskLevel,
      affectedShipmentCount: affectedShipments.length
    };
  }

  private generateScenarioRecommendations(disruption: Disruption, affectedShipments: Shipment[]): string[] {
    const recommendations: string[] = [];

    if (disruption.type === 'weather') {
      recommendations.push('Monitor weather forecasts and prepare alternative routes');
      recommendations.push('Consider delaying non-critical shipments until conditions improve');
    }

    if (disruption.type === 'geopolitical') {
      recommendations.push('Assess alternative suppliers in different regions');
      recommendations.push('Review and update risk mitigation strategies');
    }

    if (disruption.type === 'technical') {
      recommendations.push('Implement immediate contingency plans');
      recommendations.push('Communicate delays to customers and stakeholders');
    }

    if (affectedShipments.length > 3) {
      recommendations.push('Prioritize critical shipments for alternative routing');
      recommendations.push('Consider temporary inventory increases at destination locations');
    }

    if (disruption.severity === 'critical') {
      recommendations.push('Activate emergency response protocols');
      recommendations.push('Establish crisis management team');
    }

    return recommendations;
  }

  public getAvailableScenarios(): string[] {
    return Array.from(this.scenarioTemplates.keys());
  }

  public getScenarioTemplate(scenarioId: string): any {
    return this.scenarioTemplates.get(scenarioId);
  }
}
