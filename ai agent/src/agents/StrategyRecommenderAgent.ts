import { BaseAgent } from './BaseAgent';
import { AgentResponse, Shipment, RiskAssessment, SimulationScenario } from '../types';
import { mockLocations } from '../data/mockData';

export class StrategyRecommenderAgent extends BaseAgent {
  private recommendationStrategies: Map<string, any> = new Map();

  constructor(agentId: string = 'strategy_recommender_001') {
    super(agentId, 'StrategyRecommender');
    this.initializeStrategies();
  }

  public getCapabilities(): string[] {
    return [
      'Route optimization recommendations',
      'Supplier diversification strategies',
      'Inventory optimization',
      'Cost reduction strategies',
      'Risk mitigation planning',
      'Contingency planning',
      'Performance improvement suggestions'
    ];
  }

  public async process(data: any): Promise<AgentResponse> {
    try {
      const { 
        shipments, 
        riskAssessments, 
        simulationResults, 
        currentPerformance,
        optimizationGoals 
      } = data;

      const recommendations = await this.generateComprehensiveRecommendations({
        shipments,
        riskAssessments,
        simulationResults,
        currentPerformance,
        optimizationGoals
      });

      return this.createResponse(recommendations, 0.9);
    } catch (error) {
      console.error('Strategy recommendation error:', error);
      return this.createResponse(
        { error: 'Strategy recommendation failed', details: error },
        0.1
      );
    }
  }

  private initializeStrategies(): void {
    // Route optimization strategies
    this.recommendationStrategies.set('route_optimization', {
      name: 'Route Optimization',
      description: 'Optimize shipping routes for cost, time, and risk reduction',
      priority: 'high',
      implementationTime: '2-4 weeks',
      expectedBenefits: ['15-25% cost reduction', '10-20% time savings', 'Risk reduction']
    });

    // Supplier diversification strategies
    this.recommendationStrategies.set('supplier_diversification', {
      name: 'Supplier Diversification',
      description: 'Reduce dependency on single suppliers and regions',
      priority: 'high',
      implementationTime: '3-6 months',
      expectedBenefits: ['Risk mitigation', 'Better pricing', 'Improved reliability']
    });

    // Inventory optimization strategies
    this.recommendationStrategies.set('inventory_optimization', {
      name: 'Inventory Optimization',
      description: 'Optimize inventory levels based on demand and supply chain risks',
      priority: 'medium',
      implementationTime: '1-3 months',
      expectedBenefits: ['Reduced holding costs', 'Improved cash flow', 'Better responsiveness']
    });

    // Technology adoption strategies
    this.recommendationStrategies.set('technology_adoption', {
      name: 'Technology Adoption',
      description: 'Implement advanced tracking and analytics technologies',
      priority: 'medium',
      implementationTime: '6-12 months',
      expectedBenefits: ['Real-time visibility', 'Better decision making', 'Automated alerts']
    });
  }

  private async generateComprehensiveRecommendations(data: any): Promise<any> {
    const {
      shipments,
      riskAssessments,
      simulationResults,
      currentPerformance,
      optimizationGoals
    } = data;

    const recommendations = {
      immediate: await this.generateImmediateRecommendations(riskAssessments),
      shortTerm: await this.generateShortTermRecommendations(shipments, riskAssessments),
      longTerm: await this.generateLongTermRecommendations(shipments, simulationResults),
      strategic: await this.generateStrategicRecommendations(optimizationGoals)
    };

    const implementation = await this.generateImplementationPlan(recommendations);

    return {
      recommendations,
      implementation,
      summary: this.generateRecommendationSummary(recommendations),
      priorityMatrix: this.createPriorityMatrix(recommendations),
      expectedOutcomes: this.calculateExpectedOutcomes(recommendations),
      timestamp: new Date()
    };
  }

  private async generateImmediateRecommendations(riskAssessments: RiskAssessment[]): Promise<any[]> {
    const immediateActions: any[] = [];

    // High-risk shipments require immediate attention
    const highRiskShipments = riskAssessments.filter(ra => ra.overallRisk > 0.7);
    
    for (const assessment of highRiskShipments) {
      immediateActions.push({
        type: 'immediate_action',
        priority: 'critical',
        shipmentId: assessment.shipmentId,
        action: 'Implement contingency plan immediately',
        description: `Shipment ${assessment.shipmentId} has high risk (${(assessment.overallRisk * 100).toFixed(1)}%). Activate emergency protocols.`,
        timeframe: 'Within 24 hours',
        responsible: 'Supply Chain Manager',
        estimatedCost: 5000
      });
    }

    // Weather-related risks
    const weatherRisks = riskAssessments.filter(ra => ra.factors.weather > 0.6);
    for (const assessment of weatherRisks) {
      immediateActions.push({
        type: 'immediate_action',
        priority: 'high',
        shipmentId: assessment.shipmentId,
        action: 'Reroute to avoid adverse weather',
        description: `Weather risk detected for shipment ${assessment.shipmentId}. Consider alternative routes.`,
        timeframe: 'Within 12 hours',
        responsible: 'Logistics Coordinator',
        estimatedCost: 2000
      });
    }

    return immediateActions;
  }

  private async generateShortTermRecommendations(shipments: Shipment[], riskAssessments: RiskAssessment[]): Promise<any[]> {
    const shortTermActions: any[] = [];

    // Route optimization opportunities
    for (const assessment of riskAssessments) {
      if (assessment.alternativeRoutes.length > 0) {
        shortTermActions.push({
          type: 'route_optimization',
          priority: 'medium',
          shipmentId: assessment.shipmentId,
          action: 'Evaluate alternative routes',
          description: `Shipment ${assessment.shipmentId} has ${assessment.alternativeRoutes.length} alternative routes available.`,
          timeframe: '1-2 weeks',
          responsible: 'Route Planner',
          estimatedCost: 1000,
          expectedSavings: 3000
        });
      }
    }

    // Supplier diversification opportunities
    const supplierRecommendations = this.analyzeSupplierDiversification(shipments);
    shortTermActions.push(...supplierRecommendations);

    // Inventory optimization
    shortTermActions.push({
      type: 'inventory_optimization',
      priority: 'medium',
      action: 'Review safety stock levels',
      description: 'Analyze current inventory levels and adjust safety stock based on risk assessments.',
      timeframe: '2-4 weeks',
      responsible: 'Inventory Manager',
      estimatedCost: 2000,
      expectedSavings: 5000
    });

    return shortTermActions;
  }

  private async generateLongTermRecommendations(shipments: Shipment[], simulationResults: SimulationScenario[]): Promise<any[]> {
    const longTermActions: any[] = [];

    // Technology investments
    longTermActions.push({
      type: 'technology_investment',
      priority: 'medium',
      action: 'Implement advanced tracking system',
      description: 'Deploy real-time shipment tracking and predictive analytics platform.',
      timeframe: '6-12 months',
      responsible: 'IT Director',
      estimatedCost: 50000,
      expectedSavings: 15000,
      roi: '30%'
    });

    // Infrastructure improvements
    longTermActions.push({
      type: 'infrastructure_improvement',
      priority: 'low',
      action: 'Port partnership development',
      description: 'Establish strategic partnerships with alternative ports to reduce dependency.',
      timeframe: '6-12 months',
      responsible: 'Business Development',
      estimatedCost: 10000,
      expectedSavings: 8000,
      roi: '80%'
    });

    // Process improvements
    longTermActions.push({
      type: 'process_improvement',
      priority: 'medium',
      action: 'Standardize risk assessment procedures',
      description: 'Develop standardized risk assessment and mitigation procedures across all shipments.',
      timeframe: '3-6 months',
      responsible: 'Process Manager',
      estimatedCost: 15000,
      expectedSavings: 12000,
      roi: '80%'
    });

    return longTermActions;
  }

  private async generateStrategicRecommendations(optimizationGoals: any): Promise<any[]> {
    const strategicActions: any[] = [];

    // Market expansion
    strategicActions.push({
      type: 'strategic_initiative',
      priority: 'low',
      action: 'Geographic market expansion',
      description: 'Explore opportunities in new geographic markets to reduce regional concentration risk.',
      timeframe: '12-24 months',
      responsible: 'Strategic Planning',
      estimatedCost: 100000,
      expectedBenefits: ['Risk diversification', 'Market growth', 'Competitive advantage'],
      roi: '25%'
    });

    // Partnership development
    strategicActions.push({
      type: 'strategic_initiative',
      priority: 'medium',
      action: 'Strategic partnership development',
      description: 'Develop strategic partnerships with logistics providers and technology companies.',
      timeframe: '6-18 months',
      responsible: 'Partnership Manager',
      estimatedCost: 25000,
      expectedBenefits: ['Cost reduction', 'Technology access', 'Market expansion'],
      roi: '40%'
    });

    return strategicActions;
  }

  private async generateImplementationPlan(recommendations: any): Promise<any> {
    const implementationPlan = {
      phase1: {
        name: 'Immediate Actions (0-30 days)',
        actions: recommendations.immediate,
        resources: ['Emergency response team', 'Contingency budget'],
        successMetrics: ['Risk reduction', 'Incident response time']
      },
      phase2: {
        name: 'Short-term Improvements (1-6 months)',
        actions: recommendations.shortTerm,
        resources: ['Project teams', 'Implementation budget'],
        successMetrics: ['Cost savings', 'Process efficiency']
      },
      phase3: {
        name: 'Long-term Strategic (6-24 months)',
        actions: [...recommendations.longTerm, ...recommendations.strategic],
        resources: ['Strategic planning team', 'Capital investment'],
        successMetrics: ['ROI', 'Market position', 'Risk diversification']
      }
    };

    return implementationPlan;
  }

  private analyzeSupplierDiversification(shipments: Shipment[]): any[] {
    const supplierAnalysis: any[] = [];
    const supplierUsage = new Map<string, number>();

    // Count supplier usage
    for (const shipment of shipments) {
      const count = supplierUsage.get(shipment.supplier) || 0;
      supplierUsage.set(shipment.supplier, count + 1);
    }

    // Identify over-dependent suppliers
    for (const [supplierId, usageCount] of supplierUsage) {
      if (usageCount > 2) { // More than 2 shipments from same supplier
        const supplier = mockLocations.find(loc => loc.id === supplierId);
        if (supplier) {
          supplierAnalysis.push({
            type: 'supplier_diversification',
            priority: 'medium',
            action: 'Reduce dependency on single supplier',
            description: `Supplier ${supplier.name} is used for ${usageCount} shipments. Consider alternatives.`,
            timeframe: '2-4 months',
            responsible: 'Sourcing Manager',
            estimatedCost: 5000,
            expectedSavings: 8000
          });
        }
      }
    }

    return supplierAnalysis;
  }

  private generateRecommendationSummary(recommendations: any): any {
    const totalRecommendations = 
      recommendations.immediate.length + 
      recommendations.shortTerm.length + 
      recommendations.longTerm.length + 
      recommendations.strategic.length;

    const totalCost = this.calculateTotalCost(recommendations);
    const totalSavings = this.calculateTotalSavings(recommendations);

    return {
      totalRecommendations,
      totalCost,
      totalSavings,
      netBenefit: totalSavings - totalCost,
      roi: totalCost > 0 ? ((totalSavings - totalCost) / totalCost * 100).toFixed(1) + '%' : 'N/A',
      priorityBreakdown: {
        critical: recommendations.immediate.filter((r: any) => r.priority === 'critical').length,
        high: recommendations.immediate.filter((r: any) => r.priority === 'high').length,
        medium: recommendations.shortTerm.filter((r: any) => r.priority === 'medium').length,
        low: recommendations.longTerm.filter((r: any) => r.priority === 'low').length
      }
    };
  }

  private createPriorityMatrix(recommendations: any): any {
    const matrix = {
      highImpact: {
        lowCost: [],
        mediumCost: [],
        highCost: []
      },
      mediumImpact: {
        lowCost: [],
        mediumCost: [],
        highCost: []
      },
      lowImpact: {
        lowCost: [],
        mediumCost: [],
        highCost: []
      }
    };

    // Categorize recommendations by impact and cost
    const allRecommendations = [
      ...recommendations.immediate,
      ...recommendations.shortTerm,
      ...recommendations.longTerm,
      ...recommendations.strategic
    ];

    for (const rec of allRecommendations) {
      const impact = this.calculateImpact(rec);
      const cost = this.categorizeCost(rec.estimatedCost);
      
      if (matrix[impact] && matrix[impact][cost]) {
        matrix[impact][cost].push(rec);
      }
    }

    return matrix;
  }

  private calculateExpectedOutcomes(recommendations: any): any {
    return {
      riskReduction: '15-25%',
      costSavings: '20-30%',
      timeSavings: '10-20%',
      reliabilityImprovement: '25-35%',
      competitiveAdvantage: 'Significant',
      marketExpansion: '2-3 new regions'
    };
  }

  private calculateTotalCost(recommendations: any): number {
    return [
      ...recommendations.immediate,
      ...recommendations.shortTerm,
      ...recommendations.longTerm,
      ...recommendations.strategic
    ].reduce((sum, rec) => sum + (rec.estimatedCost || 0), 0);
  }

  private calculateTotalSavings(recommendations: any): number {
    return [
      ...recommendations.shortTerm,
      ...recommendations.longTerm,
      ...recommendations.strategic
    ].reduce((sum, rec) => sum + (rec.expectedSavings || 0), 0);
  }

  private calculateImpact(recommendation: any): 'highImpact' | 'mediumImpact' | 'lowImpact' {
    if (recommendation.priority === 'critical' || recommendation.priority === 'high') {
      return 'highImpact';
    } else if (recommendation.priority === 'medium') {
      return 'mediumImpact';
    } else {
      return 'lowImpact';
    }
  }

  private categorizeCost(cost: number): 'lowCost' | 'mediumCost' | 'highCost' {
    if (cost < 10000) return 'lowCost';
    if (cost < 50000) return 'mediumCost';
    return 'highCost';
  }

  public getAvailableStrategies(): string[] {
    return Array.from(this.recommendationStrategies.keys());
  }

  public getStrategyDetails(strategyId: string): any {
    return this.recommendationStrategies.get(strategyId);
  }
}
