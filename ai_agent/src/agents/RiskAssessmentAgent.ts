import { BaseAgent } from './BaseAgent';
import { AgentResponse, Shipment, RiskAssessment, WeatherData, NewsData, Disruption } from '../types';
import { mockShipments, mockLocations } from '../data/mockData';

export class RiskAssessmentAgent extends BaseAgent {
  private riskThresholds = {
    low: 0.3,
    medium: 0.6,
    high: 0.8
  };

  constructor(agentId: string = 'risk_assessor_001') {
    super(agentId, 'RiskAssessment');
  }

  public getCapabilities(): string[] {
    return [
      'Multi-factor risk analysis',
      'Weather impact assessment',
      'Geopolitical risk evaluation',
      'Port congestion analysis',
      'Route optimization recommendations',
      'Risk scoring and categorization'
    ];
  }

  public async process(data: any): Promise<AgentResponse> {
    try {
      const { shipments, weatherData, newsData, disruptions } = data;
      
      const riskAssessments: RiskAssessment[] = [];
      
      for (const shipment of shipments || mockShipments) {
        const assessment = await this.assessShipmentRisk(shipment, weatherData, newsData, disruptions);
        riskAssessments.push(assessment);
      }

      const overallRiskSummary = this.calculateOverallRisk(riskAssessments);
      
      return this.createResponse({
        assessments: riskAssessments,
        summary: overallRiskSummary,
        timestamp: new Date()
      }, 0.85);
    } catch (error) {
      console.error('Risk assessment error:', error);
      return this.createResponse(
        { error: 'Risk assessment failed', details: error },
        0.1
      );
    }
  }

  private async assessShipmentRisk(
    shipment: Shipment, 
    weatherData: WeatherData[], 
    newsData: NewsData[], 
    disruptions: Disruption[]
  ): Promise<RiskAssessment> {
    const weatherRisk = this.calculateWeatherRisk(shipment, weatherData);
    const geopoliticalRisk = this.calculateGeopoliticalRisk(shipment, newsData);
    const technicalRisk = this.calculateTechnicalRisk(shipment);
    const congestionRisk = this.calculateCongestionRisk(shipment, disruptions);
    const customsRisk = this.calculateCustomsRisk(shipment);

    const overallRisk = this.calculateOverallRiskScore({
      weather: weatherRisk,
      geopolitical: geopoliticalRisk,
      technical: technicalRisk,
      congestion: congestionRisk,
      customs: customsRisk
    });

    const recommendations = this.generateRecommendations(shipment, {
      weather: weatherRisk,
      geopolitical: geopoliticalRisk,
      technical: technicalRisk,
      congestion: congestionRisk,
      customs: customsRisk
    });

    const alternativeRoutes = this.findAlternativeRoutes(shipment);
    const alternativeSuppliers = this.findAlternativeSuppliers(shipment);

    return {
      shipmentId: shipment.id,
      overallRisk,
      factors: {
        weather: weatherRisk,
        geopolitical: geopoliticalRisk,
        technical: technicalRisk,
        congestion: congestionRisk,
        customs: customsRisk
      },
      recommendations,
      alternativeRoutes,
      alternativeSuppliers
    };
  }

  private calculateWeatherRisk(shipment: Shipment, weatherData: WeatherData[]): number {
    let totalRisk = 0;
    let locationCount = 0;

    // Check weather risk for all locations in the route
    for (const locationId of shipment.route) {
      const weather = weatherData.find(w => w.location === locationId);
      if (weather) {
        locationCount++;
        switch (weather.riskLevel) {
          case 'low':
            totalRisk += 0.1;
            break;
          case 'medium':
            totalRisk += 0.4;
            break;
          case 'high':
            totalRisk += 0.8;
            break;
        }
      }
    }

    return locationCount > 0 ? totalRisk / locationCount : 0.3;
  }

  private calculateGeopoliticalRisk(shipment: Shipment, newsData: NewsData[]): number {
    let risk = 0.2; // Base risk

    // Check for high-risk news in shipment regions
    const shipmentRegions = this.getShipmentRegions(shipment);
    
    for (const news of newsData) {
      if (news.riskLevel === 'high' && shipmentRegions.includes(news.location)) {
        risk += 0.3;
      } else if (news.riskLevel === 'medium' && shipmentRegions.includes(news.location)) {
        risk += 0.15;
      }
    }

    return Math.min(risk, 1.0);
  }

  private calculateTechnicalRisk(shipment: Shipment): number {
    let risk = 0.1; // Base technical risk

    // Vessel age and capacity factors
    if (shipment.vessel.capacity < shipment.cargo.weight) {
      risk += 0.3; // Overcapacity risk
    }

    // Route complexity
    if (shipment.route.length > 3) {
      risk += 0.2; // Complex route risk
    }

    // Cargo priority affects technical risk
    switch (shipment.cargo.priority) {
      case 'critical':
        risk += 0.1;
        break;
      case 'high':
        risk += 0.05;
        break;
    }

    return Math.min(risk, 1.0);
  }

  private calculateCongestionRisk(shipment: Shipment, disruptions: Disruption[]): number {
    let risk = 0.1; // Base congestion risk

    // Check for congestion disruptions in route
    for (const disruption of disruptions) {
      if (disruption.type === 'congestion' && shipment.route.includes(disruption.location)) {
        switch (disruption.severity) {
          case 'low':
            risk += 0.2;
            break;
          case 'medium':
            risk += 0.4;
            break;
          case 'high':
            risk += 0.6;
            break;
          case 'critical':
            risk += 0.8;
            break;
        }
      }
    }

    return Math.min(risk, 1.0);
  }

  private calculateCustomsRisk(shipment: Shipment): number {
    let risk = 0.15; // Base customs risk

    // Cargo type affects customs risk
    if (shipment.cargo.type === 'Electronics' || shipment.cargo.type === 'Machinery') {
      risk += 0.2; // Higher scrutiny for high-value items
    }

    // Route complexity affects customs risk
    if (shipment.route.length > 2) {
      risk += 0.1; // Multiple border crossings
    }

    return Math.min(risk, 1.0);
  }

  private calculateOverallRiskScore(factors: any): number {
    const weights = {
      weather: 0.25,
      geopolitical: 0.30,
      technical: 0.20,
      congestion: 0.15,
      customs: 0.10
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [factor, risk] of Object.entries(factors)) {
      if (weights[factor as keyof typeof weights]) {
        weightedSum += (risk as number) * weights[factor as keyof typeof weights];
        totalWeight += weights[factor as keyof typeof weights];
      }
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private generateRecommendations(shipment: Shipment, factors: any): string[] {
    const recommendations: string[] = [];

    if (factors.weather > 0.6) {
      recommendations.push('Consider rerouting to avoid adverse weather conditions');
    }

    if (factors.geopolitical > 0.7) {
      recommendations.push('Monitor geopolitical developments closely and prepare alternative routes');
    }

    if (factors.congestion > 0.5) {
      recommendations.push('Schedule arrival during off-peak hours to avoid port congestion');
    }

    if (factors.technical > 0.6) {
      recommendations.push('Review vessel capacity and route optimization');
    }

    if (factors.customs > 0.6) {
      recommendations.push('Ensure all documentation is complete and accurate for customs clearance');
    }

    if (recommendations.length === 0) {
      recommendations.push('Current risk levels are acceptable. Continue monitoring.');
    }

    return recommendations;
  }

  private findAlternativeRoutes(shipment: Shipment): string[][] {
    // Simple alternative route generation
    const alternatives: string[][] = [];
    
    if (shipment.route.includes('port_singapore')) {
      alternatives.push(['port_shanghai', 'port_los_angeles']); // Alternative to Singapore
    }
    
    if (shipment.route.includes('port_rotterdam')) {
      alternatives.push(['port_shanghai', 'port_los_angeles']); // Alternative to Rotterdam
    }

    return alternatives;
  }

  private findAlternativeSuppliers(shipment: Shipment): string[] {
    const alternatives: string[] = [];
    
    // Find suppliers in different regions
    const currentSupplier = mockLocations.find(loc => loc.id === shipment.supplier);
    if (currentSupplier) {
      const alternativeSuppliers = mockLocations.filter(loc => 
        loc.type === 'supplier' && 
        loc.id !== shipment.supplier &&
        loc.region !== currentSupplier.region
      );
      
      alternatives.push(...alternativeSuppliers.map(s => s.id));
    }

    return alternatives;
  }

  private getShipmentRegions(shipment: Shipment): string[] {
    const regions: string[] = [];
    
    for (const locationId of shipment.route) {
      const location = mockLocations.find(loc => loc.id === locationId);
      if (location) {
        regions.push(location.region);
      }
    }

    return [...new Set(regions)]; // Remove duplicates
  }

  private calculateOverallRisk(assessments: RiskAssessment[]): any {
    const totalRisk = assessments.reduce((sum, assessment) => sum + assessment.overallRisk, 0);
    const averageRisk = totalRisk / assessments.length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (averageRisk < this.riskThresholds.low) {
      riskLevel = 'low';
    } else if (averageRisk < this.riskThresholds.medium) {
      riskLevel = 'medium';
    } else if (averageRisk < this.riskThresholds.high) {
      riskLevel = 'high';
    } else {
      riskLevel = 'critical';
    }

    return {
      averageRisk,
      riskLevel,
      highRiskShipments: assessments.filter(a => a.overallRisk > this.riskThresholds.high).length,
      totalShipments: assessments.length
    };
  }
}
