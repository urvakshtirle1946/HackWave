import { Route, Disruption, ShipmentDisruption } from '@prisma/client';

export interface RouteRiskFactors {
  mode: string;
  travelTimeEst: number;
  costEst: number;
  fromLocationType: string;
  toLocationType: string;
}

export interface DisruptionRiskFactors {
  type: string;
  severity: string;
  status: string;
  location: string;
  impactDelayHours: number;
  rerouteNeeded: boolean;
  extraCost: number;
}

export interface EnhancedRiskCalculation {
  baseRisk: number;
  disruptionRisk: number;
  totalRisk: number;
  riskLevel: 'low' | 'medium' | 'high';
  disruptionCount: number;
  activeDisruptions: number;
  riskBreakdown: {
    transportMode: number;
    travelTime: number;
    cost: number;
    locationType: number;
    disruptionImpact: number;
  };
}

export class ShipmentRiskService {
  static calculateRouteRisk(route: RouteRiskFactors): number {
    let routeRisk = 0;
    
    // Base risk by transport mode
    switch (route.mode) {
      case 'sea': routeRisk += 25; break;
      case 'air': routeRisk += 15; break;
      case 'road': routeRisk += 20; break;
      case 'rail': routeRisk += 10; break;
      default: routeRisk += 15;
    }
    
    // Risk based on travel time
    if (route.travelTimeEst > 72) routeRisk += 20;
    else if (route.travelTimeEst > 48) routeRisk += 15;
    else if (route.travelTimeEst > 24) routeRisk += 10;
    
    // Risk based on cost
    if (route.costEst > 10000) routeRisk -= 10;
    else if (route.costEst < 1000) routeRisk += 10;
    
    // Risk based on location types
    if (route.fromLocationType === 'port' || route.toLocationType === 'port') {
      routeRisk += 5;
    }
    if (route.fromLocationType === 'warehouse' || route.toLocationType === 'warehouse') {
      routeRisk -= 5;
    }
    
    return Math.max(0, Math.min(100, routeRisk));
  }

  static calculateDisruptionRisk(disruption: DisruptionRiskFactors): number {
    try {
      let disruptionRisk = 0;
      
      // Validate input parameters
      const type = disruption.type || 'unknown';
      const severity = disruption.severity || 'medium';
      const status = disruption.status || 'monitoring';
      const impactDelayHours = disruption.impactDelayHours || 0;
      const rerouteNeeded = disruption.rerouteNeeded || false;
      const extraCost = disruption.extraCost || 0;
      
      // Risk based on disruption type
      switch (type) {
        case 'port_closure': disruptionRisk += 30; break;
        case 'carrier_strike': disruptionRisk += 25; break;
        case 'weather_event': disruptionRisk += 20; break;
        case 'fuel_spike': disruptionRisk += 15; break;
        case 'border_delay': disruptionRisk += 18; break;
        case 'infrastructure_failure': disruptionRisk += 22; break;
        case 'political_unrest': disruptionRisk += 28; break;
        case 'unknown': disruptionRisk += 10; break;
        default: disruptionRisk += 15;
      }
      
      // Risk based on severity
      switch (severity) {
        case 'critical': disruptionRisk += 25; break;
        case 'high': disruptionRisk += 20; break;
        case 'medium': disruptionRisk += 15; break;
        case 'low': disruptionRisk += 10; break;
        default: disruptionRisk += 15;
      }
      
      // Risk based on status
      switch (status) {
        case 'active': disruptionRisk += 20; break;
        case 'monitoring': disruptionRisk += 10; break;
        case 'resolved': disruptionRisk += 0; break;
        default: disruptionRisk += 10;
      }
      
      // Risk based on impact
      if (impactDelayHours > 72) disruptionRisk += 20;
      else if (impactDelayHours > 48) disruptionRisk += 15;
      else if (impactDelayHours > 24) disruptionRisk += 10;
      else if (impactDelayHours > 0) disruptionRisk += 5;
      
      // Additional risk for rerouting needed
      if (rerouteNeeded) disruptionRisk += 15;
      
      // Risk based on extra cost
      if (extraCost > 5000) disruptionRisk += 10;
      else if (extraCost > 1000) disruptionRisk += 5;
      
      return Math.max(0, Math.min(100, disruptionRisk));
    } catch (error) {
      console.error('Error in calculateDisruptionRisk:', error, disruption);
      // Return a safe default risk score
      return 15;
    }
  }

  static calculateShipmentRisk(routes: Route[]): number {
    if (routes.length === 0) return 0;
    
    const routeRisks = routes.map(route => {
      const routeFactors: RouteRiskFactors = {
        mode: route.mode,
        travelTimeEst: route.travelTimeEst,
        costEst: route.costEst,
        fromLocationType: route.fromLocationType,
        toLocationType: route.toLocationType
      };
      return this.calculateRouteRisk(routeFactors);
    });
    
    return Math.round(routeRisks.reduce((sum, risk) => sum + risk, 0) / routeRisks.length);
  }

  static calculateEnhancedShipmentRisk(
    routes: Route[], 
    disruptions: (ShipmentDisruption & { disruption: Disruption })[]
  ): EnhancedRiskCalculation {
    try {
      // Calculate base risk from routes
      const baseRisk = this.calculateShipmentRisk(routes);
      
      // Calculate disruption risk with error handling
      let totalDisruptionRisk = 0;
      let activeDisruptions = 0;
      let validDisruptions = 0;
      
      if (disruptions && disruptions.length > 0) {
        disruptions.forEach(sd => {
          try {
            // Validate disruption data
            if (!sd.disruption || !sd.disruption.type || !sd.disruption.severity || !sd.disruption.status) {
              console.warn('Invalid disruption data found:', sd);
              return; // Skip this disruption
            }
            
            const disruptionFactors: DisruptionRiskFactors = {
              type: sd.disruption.type || 'unknown',
              severity: sd.disruption.severity || 'medium',
              status: sd.disruption.status || 'monitoring',
              location: sd.disruption.location || 'Unknown',
              impactDelayHours: sd.impactDelayHours || 0,
              rerouteNeeded: sd.rerouteNeeded || false,
              extraCost: sd.extraCost || 0
            };
            
            const disruptionRisk = this.calculateDisruptionRisk(disruptionFactors);
            totalDisruptionRisk += disruptionRisk;
            validDisruptions++;
            
            if (sd.disruption.status === 'active') {
              activeDisruptions++;
            }
          } catch (error) {
            console.error('Error processing disruption:', error, sd);
            // Continue with other disruptions
          }
        });
        
        // Average disruption risk only if we have valid disruptions
        if (validDisruptions > 0) {
          totalDisruptionRisk = Math.round(totalDisruptionRisk / validDisruptions);
        }
      }
      
      // Calculate total risk (base + disruption, with disruption having higher weight)
      // If no valid disruptions, use only base risk
      const totalRisk = validDisruptions > 0 
        ? Math.min(100, Math.round(baseRisk * 0.4 + totalDisruptionRisk * 0.6))
        : baseRisk;
      
      // Calculate risk breakdown with error handling
      const riskBreakdown = this.calculateRiskBreakdown(routes, disruptions);
      
      return {
        baseRisk,
        disruptionRisk: totalDisruptionRisk,
        totalRisk,
        riskLevel: this.getRiskLevel(totalRisk),
        disruptionCount: validDisruptions,
        activeDisruptions,
        riskBreakdown
      };
    } catch (error) {
      console.error('Error in calculateEnhancedShipmentRisk:', error);
      // Return fallback calculation with only base risk
      return {
        baseRisk: this.calculateShipmentRisk(routes),
        disruptionRisk: 0,
        totalRisk: this.calculateShipmentRisk(routes),
        riskLevel: this.getRiskLevel(this.calculateShipmentRisk(routes)),
        disruptionCount: 0,
        activeDisruptions: 0,
        riskBreakdown: {
          transportMode: 0,
          travelTime: 0,
          cost: 0,
          locationType: 0,
          disruptionImpact: 0
        }
      };
    }
  }

  private static calculateRiskBreakdown(
    routes: Route[], 
    disruptions: (ShipmentDisruption & { disruption: Disruption })[]
  ) {
    try {
      let transportModeRisk = 0;
      let travelTimeRisk = 0;
      let costRisk = 0;
      let locationTypeRisk = 0;
      let disruptionImpactRisk = 0;
      
      // Calculate route-based risks with error handling
      if (routes && routes.length > 0) {
        let validRoutes = 0;
        routes.forEach(route => {
          try {
            // Validate route data
            if (!route.mode || !route.travelTimeEst || !route.costEst) {
              console.warn('Invalid route data found:', route);
              return; // Skip this route
            }
            
            // Transport mode risk
            switch (route.mode) {
              case 'sea': transportModeRisk += 25; break;
              case 'air': transportModeRisk += 15; break;
              case 'road': transportModeRisk += 20; break;
              case 'rail': transportModeRisk += 10; break;
              default: transportModeRisk += 15;
            }
            
            // Travel time risk
            if (route.travelTimeEst > 72) travelTimeRisk += 20;
            else if (route.travelTimeEst > 48) travelTimeRisk += 15;
            else if (route.travelTimeEst > 24) travelTimeRisk += 10;
            
            // Cost risk
            if (route.costEst > 10000) costRisk -= 10;
            else if (route.costEst < 1000) costRisk += 10;
            
            // Location type risk
            if (route.fromLocationType === 'port' || route.toLocationType === 'port') {
              locationTypeRisk += 5;
            }
            if (route.fromLocationType === 'warehouse' || route.toLocationType === 'warehouse') {
              locationTypeRisk -= 5;
            }
            
            validRoutes++;
          } catch (error) {
            console.error('Error processing route:', error, route);
            // Continue with other routes
          }
        });
        
        // Average the risks only if we have valid routes
        if (validRoutes > 0) {
          transportModeRisk = Math.round(transportModeRisk / validRoutes);
          travelTimeRisk = Math.round(travelTimeRisk / validRoutes);
          costRisk = Math.round(costRisk / validRoutes);
          locationTypeRisk = Math.round(locationTypeRisk / validRoutes);
        }
      }
      
      // Calculate disruption impact risk with error handling
      if (disruptions && disruptions.length > 0) {
        let validDisruptions = 0;
        disruptions.forEach(sd => {
          try {
            // Validate disruption data
            if (!sd.disruption || !sd.disruption.type || !sd.disruption.severity || !sd.disruption.status) {
              console.warn('Invalid disruption data found in breakdown:', sd);
              return; // Skip this disruption
            }
            
            const disruptionFactors: DisruptionRiskFactors = {
              type: sd.disruption.type || 'unknown',
              severity: sd.disruption.severity || 'medium',
              status: sd.disruption.status || 'monitoring',
              location: sd.disruption.location || 'Unknown',
              impactDelayHours: sd.impactDelayHours || 0,
              rerouteNeeded: sd.rerouteNeeded || false,
              extraCost: sd.extraCost || 0
            };
            disruptionImpactRisk += this.calculateDisruptionRisk(disruptionFactors);
            validDisruptions++;
          } catch (error) {
            console.error('Error processing disruption in breakdown:', error, sd);
            // Continue with other disruptions
          }
        });
        
        if (validDisruptions > 0) {
          disruptionImpactRisk = Math.round(disruptionImpactRisk / validDisruptions);
        }
      }
      
      return {
        transportMode: transportModeRisk,
        travelTime: travelTimeRisk,
        cost: costRisk,
        locationType: locationTypeRisk,
        disruptionImpact: disruptionImpactRisk
      };
    } catch (error) {
      console.error('Error in calculateRiskBreakdown:', error);
      // Return safe defaults
      return {
        transportMode: 0,
        travelTime: 0,
        cost: 0,
        locationType: 0,
        disruptionImpact: 0
      };
    }
  }

  static getRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
    if (riskScore < 30) return 'low';
    if (riskScore < 70) return 'medium';
    return 'high';
  }

  static getDisruptionRiskLevel(disruptionCount: number, activeDisruptions: number): 'low' | 'medium' | 'high' {
    if (activeDisruptions === 0) return 'low';
    if (activeDisruptions <= 2) return 'medium';
    return 'high';
  }
}
